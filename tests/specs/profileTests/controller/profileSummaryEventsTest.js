/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 * Functional Storefront Unit Test - Profile Controller
 */
define(function (require) {
  var Backbone = require('backbone');
  var EventBus = require('eventbus');
  var ep = require('ep');
  var EventTestHelpers = require('testhelpers.event');
  var EventTestFactory = require('testfactory.event');
  var ControllerTestHelper = require('testhelpers.viewdoubles');

  describe('Profile Module: Summary Events', function () {
    require('profile');
    var template = require('text!modules/base/profile/base.profile.templates.html');
    var view = require('profile.views');

    before(function () {
      $("#Fixtures").append(template);
    });

    after(function () {
      $("#Fixtures").empty();
    });

    describe('Responds to event: profile.editSummaryBtnClicked',
      EventTestFactory.simpleEventTriggersEventTest('profile.loadSummaryFormViewRequest', 'profile.editSummaryBtnClicked'));

    describe('Responds to event: profile.loadSummaryFormViewRequest', function () {
      before(function () {
        this.formView = view.ProfileSummaryFormView;
        this.formViewDouble = ControllerTestHelper.TestDouble();
        view.ProfileSummaryFormView = this.formViewDouble.View;

        EventBus.trigger('profile.loadSummaryFormViewRequest', new Backbone.Model());
      });

      after(function () {
        view.ProfileSummaryFormView = this.formView;
        delete(this.formView);
        delete(this.formViewDouble);
      });

      it('registers correct event listener', function () {
        expect(EventBus._events['profile.loadSummaryFormViewRequest']).to.have.length(1);
      });
      describe("loads profileSummaryFormView", function () {
        it('ProfileSummaryFormView was rendered', function () {
          expect(this.formViewDouble.wasRendered()).to.be.true;
        });
        it('ProfileSummaryFormView has a model', function () {
          expect(this.formViewDouble.hasAModel()).to.be.true;
        });
      });
    });

    describe('Responds to event: profile.summarySaveBtnClicked',
      EventTestFactory.simpleTriggerEventTest('profile.submitProfileSummaryFormRequest', function() {
        var expectedEvent = "profile.submitProfileSummaryFormRequest";
        it('should trigger event: ' + expectedEvent, function () {
          sinon.stub(ep.ui, "disableButton");
          EventBus.trigger('profile.summarySaveBtnClicked');

          expect(EventBus.trigger).to.be.calledWith(expectedEvent);

          ep.ui.disableButton.restore();
        });
      }));

    describe('Responds to event: profile.summaryCancelBtnClicked',
      EventTestFactory.simpleEventTriggersEventTest('profile.loadSummaryViewRequest', 'profile.summaryCancelBtnClicked'));

    describe('Responds to event: profile.loadSummaryViewRequest', function () {
      before(function () {
        sinon.stub(Backbone.Model.prototype, 'fetch');

        this.formView = view.ProfileSummaryView;
        this.formViewDouble = ControllerTestHelper.TestDouble();
        view.ProfileSummaryView = this.formViewDouble.View;

        EventBus.trigger('profile.loadSummaryViewRequest');
      });

      after(function () {
        Backbone.Model.prototype.fetch.restore();

        view.ProfileSummaryFormView = this.formView;
        delete(this.formView);
        delete(this.formViewDouble);
      });

      it('registers correct event listener', function () {
        expect(EventBus._events['profile.loadSummaryViewRequest']).to.have.length(1);
      });

      it("fetches latest profile summary info from cortex server", function () {
        expect(Backbone.Model.prototype.fetch).to.be.calledOnce;
      });

      it('ProfileSummaryView was rendered', function () {
        expect(this.formViewDouble.wasRendered()).to.be.true;
      });
      it('ProfileSummaryView has a model', function () {
        expect(this.formViewDouble.hasAModel()).to.be.true;
      });
    });

    describe('Responds to event: profile.submitProfileSummaryFormRequest', function () {
      var fakeUrl = 'someHref';

      before(function () {
        sinon.stub(ep.io, 'ajax');
        sinon.stub(ep.logger, 'error');
        sinon.spy(view, 'getSummaryFormValue');

        EventBus.trigger('profile.submitProfileSummaryFormRequest', fakeUrl);

        // get first argument passed to ep.io.ajax,
        // args[0] gets arguments passed in the first time ep.io.ajax is called
        // args[0][0] gets the first argument of the first time arguments
        this.ajaxArgs = ep.io.ajax.args[0][0];
      });

      after(function () {
        ep.io.ajax.restore();
        ep.logger.error.restore();
        view.getSummaryFormValue.restore();
      });

      it('registers correct event listener', function () {
        expect(EventBus._events['profile.submitProfileSummaryFormRequest']).to.have.length(1);
      });

      it("gets summary form value", function () {
        expect(view.getSummaryFormValue).to.be.calledOnce;
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
        EventTestFactory.simpleTriggerEventTest('profile.submitSummaryFormSuccess', function () {
          var testEventName = 'profile.submitSummaryFormSuccess';

          it('should trigger ' + testEventName + ' event', function () {
            this.ajaxArgs.success(); // trigger callback function on ajax call success
            expect(EventBus.trigger).to.be.calledWithExactly(testEventName);
          });
        }));

      describe('and on failure',
        EventTestFactory.simpleTriggerEventTest('profile.submitSummaryFormFailed', function () {
          var testEventName = 'profile.submitSummaryFormFailed';

          it('should trigger ' + testEventName + ' event', function () {
            ep.logger.error.reset();  // make sure other test's logger call doesn't interfere
            this.ajaxArgs.error({
              status: 'any error code'
            });
            expect(EventBus.trigger).to.be.calledWith(testEventName);
          });
        }));
    });

    describe('Responds to event: profile.submitSummaryFormSuccess',
      EventTestFactory.simpleEventTriggersEventTest('profile.loadSummaryViewRequest', 'profile.submitSummaryFormSuccess'));

    describe("Responds to event: profile.submitSummaryFormFailed", function () {

      before(function () {
        sinon.stub(ep.ui, "enableButton");
        sinon.stub(view, 'translateSummaryFormErrorMessage');

        this.errorView = view.ProfileSummaryFormErrorCollectionView;
        this.errorViewDouble = ControllerTestHelper.TestDouble();
        view.ProfileSummaryFormErrorCollectionView = this.errorViewDouble.View;

        EventBus.trigger("profile.submitSummaryFormFailed");
      });

      after(function () {
        ep.ui.enableButton.restore();
        view.translateSummaryFormErrorMessage.restore();
        view.ProfileSummaryFormErrorCollectionView = this.errorView;
      });

      it("calls view function to localize error message", function () {
        expect(view.translateSummaryFormErrorMessage).to.be.calledOnce;
      });

      describe("displays the error message to feedback region", function() {
        it("that ProfileSummaryFormErrorCollectionView is rendered", function() {
          expect(this.errorViewDouble.wasRendered()).to.be.true;
        });
        it("and that this view has a collection", function() {
          expect(this.errorViewDouble.hasACollection()).to.be.true;
        });
      });
    });
  });

});