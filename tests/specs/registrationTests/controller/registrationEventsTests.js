/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 * Functional Storefront Unit Test - Registration Module Controller
 */
define(function (require) {
  'use strict';

  var ep = require('ep');
  var EventBus = require('eventbus');

  describe('Registration Module General Events Tests', function () {
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

        sinon.stub(ep.io, 'ajax');

        EventBus.trigger('registration.saveButtonClicked', this.fakeFormEl);
      });

      after(function() {
        EventBus.trigger.restore();
        ep.io.ajax.restore();
        delete(this.fakeFormEl);
      });

      it("given a valid HTML form, triggers the registration.submitForm event", function() {
        expect(EventBus.trigger).to.be.calledWithExactly('registration.submitForm', this.fakeFormEl);
      });

      it("called without a valid HTML element, log an error", function() {
        EventBus.trigger('registration.saveButtonClicked', '<form></form>');

        expect(ep.logger.error).to.be.called;
      });
    });

    describe('responds to event: registration.submitFormSuccess', function() {
      before(function() {
        sinon.spy(EventBus, 'trigger');

        sinon.stub(ep.io.localStore, 'removeItem');

        EventBus.trigger('registration.submitFormSuccess');
      });

      after(function() {
        EventBus.trigger.restore();
        ep.io.localStore.removeItem.restore();
      });

      it("Revokes the auth token and loads the login form", function() {
        expect(ep.io.localStore.removeItem).to.be.calledWithExactly('oAuthToken');
        expect(EventBus.trigger).to.be.calledWithExactly('layout.loadRegionContentRequest', {
          region: 'appModalRegion',
          module: 'auth',
          view: 'LoginFormView'
        });
      });
    });

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

        this.fakeSubmitUrl = "/fakeSubmitUrl";

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
      });

      describe('when the form has mismatched password fields', function() {
        before(function() {
          // pass a form with mismatched password fields
        });
        it('renders an error message to the feedback region', function() {

        });
      });

      describe('when the server returns a 400 error', function() {

        before(function(done) {
          sinon.spy(EventBus, 'trigger');

          this.response = {responseText: "some response text"};

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
          delete(this.response);
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
        // fakeServer returns a 403 error

        // EventBus.trigger 'registration.submitFormFailed'
      });

      describe('when the server returns a 200 error', function() {
        // fakeServer returns a 200 error

        // EventBus.trigger 'registration.submitFormSuccess'
      });


    });

  });

});