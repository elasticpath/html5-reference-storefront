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
 * Functional Storefront Unit Test - Checkout Views
 */
define(function (require) {
  var ep = require('ep');

  var Backbone = require('backbone');
  var EventTestFactory = require('testfactory.event');

  describe('Checkout Payment Method Views', function () {
    var views = require('checkout.views');
    var template = require('text!modules/base/checkout/base.checkout.templates.html');

    var StandardPayment = Backbone.Model.extend({
      defaults: {
        displayValue: "**********6754"
      }
    });

    before(function () {
      $("#Fixtures").append(template);
    });

    after(function () {
      $("#Fixtures").empty();
    });

    describe('PaymentMethodSelectorView', function () {
      before(function () {
        this.view = new views.testVariables.PaymentMethodSelectorView();
        this.view.render();
      });

      it('should be an instance of Marionette Layout object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.Layout);
      });
      it('render() should return the view object', function () {
        expect(this.view.render()).to.be.equal(this.view);
      });
      it('renders the view contents', function () {
        // View should contain a heading element and a <div> region for shipping options
        expect(this.view.el.childElementCount).to.be.equal(2);
        expect(this.view.$el.find('[data-region="paymentMethodComponentRegion"]')).to.be.length(1);
      });
      it('should have a checkoutPaymentRegion region', function () {
        expect(this.view.checkoutPaymentRegion).to.exist;
        expect(this.view.$el.find('[data-region="paymentMethodComponentRegion"]')).to.be.length(1);
      });

      // FIXME unable to test selection change trigger event
      // EventTestFactory.simpleSelectionChangedTest might help.
    });

    describe('PaymentMethodsCompositeView', function () {
      before(function () {
        this.collection = new Backbone.Collection([
          new StandardPayment()
        ]);
        this.view = new views.PaymentMethodsCompositeView({collection: this.collection});
        this.view.render();
      });

      after(function() {
        delete(this.collection);
        delete(this.view);
      });

      it('should be an instance of Marionette CompositeView object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.CompositeView);
      });
      it('render() should return the view object', function () {
        expect(this.view.render()).to.be.equal(this.view);
      });
      it('has a sub-title element', function () {
        expect(this.view.$el.find('h2')).to.be.length(1);
      });
      it('has a addNewPaymentMethod button', function () {
        expect(this.view.$el.find('button[data-el-label="checkout.newPaymentMethodBtn"]')).to.be.length(1);
      });
      it('has an emptyView', function() {
        expect(this.view.emptyView).to.be.ok;
      });
      it('defines correct itemViewContainer', function () {
        var containerDOM = '[data-region="paymentMethodSelectorsRegion"]';
        expect(this.view.itemViewContainer).to.be.equal(containerDOM);
        expect(this.view.$el.find(containerDOM)).to.be.length(1);
      });
      it('and defines a target render element for activityIndicator', function () {
        expect(this.view.ui.activityIndicatorEl).to.be.ok;
      });

      describe('add new payment method button clicked',
        EventTestFactory.simpleBtnClickTest('checkout.addNewPaymentMethodBtnClicked',
          '[data-el-label="checkout.newPaymentMethodBtn"]'));

    });

  });
});
