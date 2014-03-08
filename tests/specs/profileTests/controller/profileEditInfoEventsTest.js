/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * Functional Storefront Unit Test - Profile Controller
 */
define(function (require) {
  var Backbone = require('backbone');
  var EventBus = require('eventbus');
  var ep = require('ep');
  var EventTestFactory = require('testfactory.event');
  var ControllerTestHelper = require('testhelpers.viewdoubles');
  var ControllerTestFactory = require('testfactory.controller');

  var model = require('profile.models');

  describe('Profile Module: Edit Personal Info Events', function () {
    require('profile');
    var template = require('text!modules/base/profile/base.profile.templates.html');
    var view = require('profile.views');

    before(function () {
      $("#Fixtures").append(template);
    });

    after(function () {
      $("#Fixtures").empty();
    });

    describe('Responds to event: profile.editPersonalInfoBtnClicked',
      EventTestFactory.simpleEventTriggersEventTest('profile.loadPersonalInfoFormViewRequest', 'profile.editPersonalInfoBtnClicked'));

    describe('Responds to event: profile.loadPersonalInfoFormViewRequest', function () {
      before(function () {
        this.formView = view.PersonalInfoFormView;
        this.formViewDouble = ControllerTestHelper.TestDouble();
        view.PersonalInfoFormView = this.formViewDouble.View;

        EventBus.trigger('profile.loadPersonalInfoFormViewRequest', new Backbone.Model());
      });

      after(function () {
        view.PersonalInfoFormView = this.formView;
        delete(this.formView);
        delete(this.formViewDouble);
      });

      it('registers correct event listener', function () {
        expect(EventBus._events['profile.loadPersonalInfoFormViewRequest']).to.have.length(1);
      });
      describe("loads profileSummaryFormView", function () {
        it('PersonalInfoFormView was rendered', function () {
          expect(this.formViewDouble.wasRendered()).to.be.true;
        });
        it('PersonalInfoFormView has a model', function () {
          expect(this.formViewDouble.hasAModel()).to.be.true;
        });
      });
    });

    describe('Responds to event: profile.personalInfoFormSaveBtnClicked',
      EventTestFactory.simpleTriggerEventTest('profile.submitPersonalInfoFormRequest', function() {
        var expectedEvent = "profile.submitPersonalInfoFormRequest";
        it('should trigger event: ' + expectedEvent, function () {
          sinon.stub(ep.ui, "disableButton");
          EventBus.trigger('profile.personalInfoFormSaveBtnClicked');

          expect(EventBus.trigger).to.be.calledWith(expectedEvent);

          ep.ui.disableButton.restore();
        });
      }));

    describe('Responds to event: profile.personalInfoFormCancelBtnClicked',
      EventTestFactory.simpleEventTriggersEventTest('profile.loadPersonalInfoViewRequest', 'profile.personalInfoFormCancelBtnClicked'));

    describe('Responds to event: profile.loadPersonalInfoViewRequest', function () {
      before(function (done) {
        sinon.spy(Backbone.Model.prototype, 'fetch');

        this.formView = view.ProfilePersonalInfoView;
        this.formViewDouble = ControllerTestHelper.TestDouble();
        view.ProfilePersonalInfoView = this.formViewDouble.View;

        var fakeUrl = model.ProfileModel.prototype.url;
        var fakeAddressResponse = {};
        this.server = ControllerTestFactory.getFakeServer({
          response: fakeAddressResponse,
          requestUrl: fakeUrl
        });

        EventBus.trigger('profile.loadPersonalInfoViewRequest');
        done();
      });

      after(function () {
        Backbone.Model.prototype.fetch.restore();

        view.PersonalInfoFormView = this.formView;
        delete(this.formView);
        delete(this.formViewDouble);
      });

      it('registers correct event listener', function () {
        expect(EventBus._events['profile.loadPersonalInfoViewRequest']).to.have.length(1);
      });

      it("fetches latest profile summary info from cortex server", function () {
        expect(Backbone.Model.prototype.fetch).to.be.calledOnce;
      });

      it('ProfilePersonalInfoView was rendered', function () {
        expect(this.formViewDouble.wasRendered()).to.be.true;
      });
      it('ProfilePersonalInfoView has a model', function () {
        expect(this.formViewDouble.hasAModel()).to.be.true;
      });
    });

    describe('Responds to event: profile.submitPersonalInfoFormRequest', function () {
      var fakeUrl = 'someHref';

      before(function () {
        sinon.stub(ep.io, 'ajax');
        sinon.stub(ep.logger, 'error');
        sinon.spy(view, 'getPersonalInfoFormValue');

        EventBus.trigger('profile.submitPersonalInfoFormRequest', fakeUrl);

        // FIXME create testfactory for reuse?
        // get first argument passed to ep.io.ajax,
        // args[0] gets arguments passed in the first time ep.io.ajax is called
        // args[0][0] gets the first argument of the first time arguments
        this.ajaxArgs = ep.io.ajax.args[0][0];
      });

      after(function () {
        ep.io.ajax.restore();
        ep.logger.error.restore();
        view.getPersonalInfoFormValue.restore();
      });

      it('registers correct event listener', function () {
        expect(EventBus._events['profile.submitPersonalInfoFormRequest']).to.have.length(1);
      });

      it("gets summary form value", function () {
        expect(view.getPersonalInfoFormValue).to.be.calledOnce;
      });

      describe('Should make a PUT request to Cortex', function () {
        it('exactly once', function () {
          expect(ep.io.ajax).to.be.calledOnce;
        });
        it('with a valid request', function () {
          expect(this.ajaxArgs.type).to.be.string('PUT');
          expect(this.ajaxArgs.url).to.be.equal(fakeUrl);
        });
      });

      describe('and on success',
        EventTestFactory.simpleTriggerEventTest('profile.submitPersonalInfoFormSuccess', function () {
          var testEventName = 'profile.submitPersonalInfoFormSuccess';

          it('should trigger ' + testEventName + ' event', function () {
            this.ajaxArgs.success(); // trigger callback function on ajax call success
            expect(EventBus.trigger).to.be.calledWithExactly(testEventName);
          });
        }));

      describe('and on failure',
        EventTestFactory.simpleTriggerEventTest('profile.submitPersonalInfoFormFailed', function () {
          var testEventName = 'profile.submitPersonalInfoFormFailed';

          it('should trigger ' + testEventName + ' event', function () {
            ep.logger.error.reset();  // make sure other test's logger call doesn't interfere
            this.ajaxArgs.error({
              status: 'any error code'
            });
            expect(EventBus.trigger).to.be.calledWith(testEventName);
          });
        }));
    });

    describe('Responds to event: profile.submitPersonalInfoFormSuccess',
      EventTestFactory.simpleEventTriggersEventTest('profile.loadPersonalInfoViewRequest', 'profile.submitPersonalInfoFormSuccess'));

    describe("Responds to event: profile.submitPersonalInfoFormFailed", function () {

      before(function () {
        sinon.stub(ep.ui, "enableButton");
        sinon.stub(view, 'translatePersonalInfoFormErrorMessage');

        this.errorView = view.PersonalInfoFormErrorCollectionView;
        this.errorViewDouble = ControllerTestHelper.TestDouble();
        view.PersonalInfoFormErrorCollectionView = this.errorViewDouble.View;

        EventBus.trigger("profile.submitPersonalInfoFormFailed");
      });

      after(function () {
        ep.ui.enableButton.restore();
        view.translatePersonalInfoFormErrorMessage.restore();
        view.PersonalInfoFormErrorCollectionView = this.errorView;
      });

      it("calls view function to localize error message", function () {
        expect(view.translatePersonalInfoFormErrorMessage).to.be.calledOnce;
      });

      describe("displays the error message to feedback region", function() {
        it("that PersonalInfoFormErrorCollectionView is rendered", function() {
          expect(this.errorViewDouble.wasRendered()).to.be.true;
        });
        it("and that this view has a collection", function() {
          expect(this.errorViewDouble.hasACollection()).to.be.true;
        });
      });
    });
  });

});