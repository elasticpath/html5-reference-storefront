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
      it('should have a ui hash for the save and cancel buttons', function() {
        expect(this.view).to.have.deep.property('ui.saveButton');
        expect(this.view).to.have.deep.property('ui.cancelButton');
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