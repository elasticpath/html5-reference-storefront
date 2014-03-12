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
 * Functional Storefront Unit Test - Auth Views
 */

define(function (require) {
  'use strict';

  var ep = require('ep');
  var Backbone = require('backbone');
  var Marionette = require('marionette');
  var EventTestFactory = require('testfactory.event');

  var views = require('auth.views');
  var templates = require('text!modules/base/auth/base.auth.templates.html');


  describe('Auth Module: Views', function () {
    before(function () {
      // append templates
      $("#Fixtures").append(templates);
    });

    after(function () {
      $("#Fixtures").empty();
    });

    describe('CheckoutAuthOptionsLayout', function() {
      before(function () {
        this.view = new views.CheckoutAuthOptionsLayout();
        this.view.render();
      });

      after(function() {
        delete(this.view);
      });

      it('should be an instance of Marionette Layout object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.Layout);
      });

      it('defines and renders ui element: cancel button', function () {
        expect(this.view.ui.cancelButton).to.be.ok;
      });

      describe('has regions', function () {
        it('loginRegion', function () {
          expect(this.view.loginRegion).to.exist;
          expect(this.view.$el.find(this.view.regions.loginRegion)).to.be.length(1);
        });
        it('registrationRegion', function () {
          expect(this.view.registrationRegion).to.exist;
          expect(this.view.$el.find(this.view.regions.registrationRegion)).to.be.length(1);
        });
        it('anonymousCheckoutRegion', function () {
          expect(this.view.anonymousCheckoutRegion).to.exist;
          expect(this.view.$el.find(this.view.regions.anonymousCheckoutRegion)).to.be.length(1);
        });
      });

      describe('cancel authorization for checkout button clicked',
        EventTestFactory.simpleBtnClickTest('auth.checkoutAuthOptionCancelBtnClicked', '[data-el-label="checkoutAuthOption.cancel"]'));
    });


    describe('CheckoutAuthLoginOptionView', function() {
      before(function () {
        this.view = new views.CheckoutAuthLoginOptionView();
        this.view.render();
      });

      after(function() {
        delete(this.view);
      });

      it('should be an instance of Marionette ItemView object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.ItemView);
      });

      describe('has key ui elements', function() {
        it('defines and renders ui element login button', function () {
          expect(this.view.ui.loginButton).to.be.ok;
        });
        it('renders a feedback region', function () {
          expect(this.view.$el.find('[data-region="authLoginFormFeedbackRegion"]')).to.have.length(1);
        });
        it('renders an username input field', function () {
          expect(this.view.$el.find('#OAuthUserName')).to.have.length(1);
        });
        it('renders a password input field', function () {
          expect(this.view.$el.find('#OAuthPassword')).to.have.length(1);
        });
        it('renders an invisible scope field', function () {
          expect(this.view.$el.find('#OAuthScope').attr('type')).to.be.equal("hidden");
        });
        it('renders an invisible role field', function () {
          expect(this.view.$el.find('#OAuthRole').attr('type')).to.be.equal("hidden");
        });
      });

      describe('login form login button clicked',
        EventTestFactory.simpleBtnClickTest('auth.loginButtonClicked', '[data-el-label="checkoutAuthOption.login"]'));
    });

    describe('CheckoutAuthRegisterOptionView', function() {
      before(function () {
        this.view = new views.CheckoutAuthRegisterOptionView();
        this.view.render();
      });

      after(function() {
        delete(this.view);
      });

      it('should be an instance of Marionette ItemView object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.ItemView);
      });

      it('defines and renders ui element registration button', function () {
        expect(this.view.ui.registerButton).to.be.ok;
      });

      describe('register button clicked',
        EventTestFactory.simpleBtnClickTest('auth.registrationButtonClicked', '[data-el-label="checkoutAuthOption.register"]'));
    });

    describe('CheckoutAuthAnonymousOptionView', function() {
      before(function () {
        this.view = new views.CheckoutAuthAnonymousOptionView();
        this.view.render();
      });

      after(function() {
        delete(this.view);
      });

      it('should be an instance of Marionette ItemView object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.ItemView);
      });

      describe('has key ui elements', function() {
        it('defines and renders ui element registration button', function () {
          expect(this.view.ui.checkoutButton).to.be.ok;
        });
        it('renders a email input field', function () {
          expect(this.view.$el.find('#Email')).to.have.length(1);
        });
      });

      describe('continue checkout anonymously button clicked',
        EventTestFactory.simpleBtnClickTest('auth.continueCheckoutAnonymouslyBtnClicked', '[data-el-label="checkoutAuthOption.anonymousCheckout"]'));
    });
  });

});