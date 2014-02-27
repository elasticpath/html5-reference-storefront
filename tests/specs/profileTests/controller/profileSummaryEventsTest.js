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
      describe("loads profileSummaryFormView", function() {
        it('ProfileSummaryFormView was rendered', function () {
          expect(this.formViewDouble.wasRendered()).to.be.true;
        });
        it('ProfileSummaryFormView has a model', function () {
          expect(this.formViewDouble.hasAModel()).to.be.true;
        });
      });
    });

  });

});