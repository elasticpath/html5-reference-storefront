/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 * Functional Storefront Unit Test - Registration Module Views
 */

define(function (require) {
  'use strict';

  var ep = require('ep');
  var Backbone = require('backbone');
  var Marionette = require('marionette');
  var EventTestFactory = require('testfactory.event');

  var registrationView = require('registration.views');
  var registrationTemplate = require('text!modules/base/registration/base.registration.templates.html');

  var registrationFormModel = new Backbone.Model({
    submitUrl: 'fakeSubmitUrl'
  });

  describe('RegistrationFormItemView', function () {
    before(function () {
      // append templates
      $("#Fixtures").append(registrationTemplate);

      this.view = new registrationView.RegistrationFormItemView({
        model: registrationFormModel
      });
      this.view.render();
    });

    after(function () {
      $("#Fixtures").empty();
      delete(this.view);
    });

    describe('can render', function () {
      it('should be an instance of ItemView object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.ItemView);
      });
      it('render() should return the view object', function () {
        expect(this.view.render()).to.be.equal(this.view);
      });
    });

    describe('renders correctly with the submitUrl of the model', function() {
      it('should render a form element with an action attribute', function() {
        expect($('form[action="fakeSubmitUrl"]', this.view.$el)).to.have.length(1);
      });
    });

    describe('save button clicked',
      EventTestFactory.simpleBtnClickTest('registration.saveButtonClicked', '[data-el-label="registration.save"]'));
  });

});