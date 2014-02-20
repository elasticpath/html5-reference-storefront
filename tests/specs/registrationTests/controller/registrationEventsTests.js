/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 * Functional Storefront Unit Test - Registration Module Controller
 */
define(function (require) {
  'use strict';

  var ep = require('ep');
  var EventBus = require('eventbus');

  var EventTestFactory = require('testfactory.event');

  describe('Registration Module: Controller: General Events Tests', function () {
    var registrationController = require('registration'); // load controller file
    var registrationView = require('registration.views');
    var registrationTemplate = require('text!modules/base/registration/base.registration.templates.html');
    var controllerTestFactory = require('testfactory.controller');

    before(function() {
      sinon.stub(ep.logger, 'error');
      sinon.stub(ep.logger, 'warn');
      $("#Fixtures").append(registrationTemplate);
    });

    after(function() {
      ep.logger.error.restore();
      ep.logger.warn.restore();
      $("#Fixtures").empty();
    });

    describe('responds to event: registration.saveButtonClicked', function() {
      before(function() {
        this.fakeFormEl = document.createElement('form');
        sinon.spy(EventBus, 'trigger');
        sinon.stub(ep.ui, 'disableButton');

        sinon.stub(ep.io, 'ajax');

        EventBus.trigger('registration.saveButtonClicked', this.fakeFormEl);
      });

      after(function() {
        EventBus.trigger.restore();
        ep.ui.disableButton.restore();
        ep.io.ajax.restore();
        delete(this.fakeFormEl);
      });

      it("given a valid HTML form, disables the save button and triggers the registration.submitForm event", function() {
        expect(ep.ui.disableButton).to.be.calledOnce;
        expect(EventBus.trigger).to.be.calledWithExactly('registration.submitForm', this.fakeFormEl);
      });

      it("called without a valid HTML element, log an error", function() {
        EventBus.trigger('registration.saveButtonClicked', '<form></form>');

        expect(ep.logger.error).to.be.called;
      });
    });

    describe('responds to event: registration.submitFormSuccess',
      EventTestFactory.simpleEventTriggersEventTest('registration.navigateToReturnRoute', 'registration.submitFormSuccess'));

    describe('responds to event: registration.cancelButtonClicked',
      EventTestFactory.simpleEventTriggersEventTest('registration.navigateToReturnRoute', 'registration.cancelButtonClicked'));

    /**
     * ======================
     * AJAX form submit tests
     * ======================
     */
    describe('responds to event: registration.submitForm', function() {
      // Common before() and after() sections for the AJAX form submit tests
      before(function() {
        // NOTE: building a valid form as we are unable to stub the local isPasswordConfirmed() function

        // Build a form element with 2 input fields
        var passwordInput = $('<input name="password" value="password123" />');
        var passwordConfirmInput = $('<input name="passwordConfirm" value="password123" />');

        // Some settings for our fakeServer
        this.fakeSubmitUrl = "/fakeSubmitUrl";
        this.response = {responseText: "some response text"};

        this.fakeFormEl = $('<form></form>');
        this.fakeFormEl.append(passwordInput, passwordConfirmInput);
        this.fakeFormEl.attr('action', this.fakeSubmitUrl);

        // Temporarily stub EventBus.trigger while loading the default layout to prevent a request being made
        // to Cortex to get the submit URL for the registration form.
        sinon.stub(EventBus, 'trigger');

        this.view = new registrationController.DefaultController();

        this.view.render();

        this.view.registrationFormRegion.show(
          new registrationView.RegistrationFormItemView({
            model: new Backbone.Model()
          })
        );

        // Enter some values in the password fields for our later tests
        $('#Password', this.view.$el).val("password123");
        $('#PasswordConfirm', this.view.$el).val("password123");

        // Revert stubbing of EventBus.trigger
        EventBus.trigger.restore();
      });
      after(function() {
        delete(this.fakeFormEl);
        delete(this.fakeSubmitUrl);
        delete(this.response);
      });

      describe('when the server returns a 400 error', function() {

        before(function(done) {
          sinon.spy(EventBus, 'trigger');

          this.fakeRegistrationServer = controllerTestFactory.getFakeServer({
            method: 'POST',
            response: this.response,
            responseCode: 400,
            requestUrl: this.fakeSubmitUrl
          });

          EventBus.trigger('registration.submitForm', this.fakeFormEl.get(0));

          EventBus.on('registration.submitFormFailed.invalidFields', function() {
            done();
          });
        });

        after(function() {
          EventBus.trigger.restore();
        });

        it("triggers the 'registration.submitFormFailed.invalidFields' event", function() {
          expect(EventBus.trigger).to.be.calledWith('registration.submitFormFailed.invalidFields', JSON.stringify(this.response));
        });

        it("renders an error message in the feedback area", function() {
          // Check that the error message list has at least one list item
          expect($('[data-region="registrationFeedbackMsgRegion"] li', this.view.$el).length).to.be.greaterThan(0);
        });

        it("clears the contents of the password fields", function() {
          expect($('#Password', this.view.$el).val()).to.be.equal("");
          expect($('#PasswordConfirm', this.view.$el).val()).to.be.equal("");
        });
      });

      describe('when the server returns a 403 error', function() {
        before(function(done) {
          sinon.spy(EventBus, 'trigger');

          this.fakeRegistrationServer = controllerTestFactory.getFakeServer({
            method: 'POST',
            response: this.response,
            responseCode: 403,
            requestUrl: this.fakeSubmitUrl
          });

          EventBus.trigger('registration.submitForm', this.fakeFormEl.get(0));

          EventBus.on('registration.submitFormFailed', function() {
            done();
          });
        });

        after(function() {
          EventBus.trigger.restore();
        });

        it("triggers the 'registration.submitFormFailed' event", function() {
          expect(EventBus.trigger).to.be.calledWith('registration.submitFormFailed');
        });

        it("renders an error message in the feedback area", function() {
          // Check that the error message list has at least one list item
          expect($('[data-region="registrationFeedbackMsgRegion"] li', this.view.$el).length).to.be.greaterThan(0);
        });
      });

      describe('when the server returns a 200 error', function() {
        before(function(done) {
          sinon.spy(EventBus, 'trigger');
          ep.router = new Marionette.AppRouter();

          this.fakeRegistrationServer = controllerTestFactory.getFakeServer({
            method: 'POST',
            response: this.response,
            responseCode: 200,
            requestUrl: this.fakeSubmitUrl
          });

          EventBus.trigger('registration.submitForm', this.fakeFormEl.get(0));

          EventBus.on('registration.submitFormSuccess', function() {
            done();
          });
        });

        after(function() {
          EventBus.trigger.restore();
        });

        it("triggers the 'registration.submitFormSuccess' event", function() {
          expect(EventBus.trigger).to.be.calledWith('registration.submitFormSuccess');
        });

        it("does not render an error message in the feedback area", function() {
          // Check that the error message list has at least one list item
          expect($('[data-region="registrationFeedbackMsgRegion"] li', this.view.$el).length).to.be.equal(0);
        });
      });
    });

    describe('responds to event: registration.submitFormFailed', function() {
      before(function() {
        sinon.stub(ep.ui, 'enableButton');
        sinon.stub(Backbone.Collection.prototype, 'add');

        EventBus.trigger('registration.submitFormFailed', {status: 'something'});
      });

      after(function() {
        ep.ui.enableButton.restore();
        Backbone.Collection.prototype.add.restore();
      });

      it('should add a generic error to the errors collection', function () {
        expect(Backbone.Collection.prototype.add).to.be.calledWith(
          { error: "registration.errorMsg.generic" }
        );
      });
      it('should re-enable to save button', function() {
        expect(ep.ui.enableButton).to.be.calledOnce;
      });
    });

    describe('responds to event: registration.submitFormFailed.invalidFields', function() {
      before(function() {
        sinon.spy(EventBus, 'trigger');
        sinon.stub(ep.ui, 'enableButton');

        EventBus.trigger('registration.submitFormFailed.invalidFields', "");
      });

      after(function() {
        EventBus.trigger.restore();
        ep.ui.enableButton.restore();
      });

      it('should re-enable to save button', function() {
        expect(ep.ui.enableButton).to.be.calledOnce;
      });
    });

  });
});