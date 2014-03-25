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
  var Backbone = require('backbone');
  var ep = require('ep');
  var EventTestFactory = require('testfactory.event');
  var Mediator = require('mediator');

  describe('Checkout Module: Views: ', function () {
    var views = require('checkout.views');
    var template = require('text!modules/base/checkout/base.checkout.templates.html');

    before(function () {
      $("#Fixtures").append(template);
    });

    after(function () {
      $("#Fixtures").empty();
    });

    describe('CheckoutAddressSelectorLayout', function () {
      before(function () {
        sinon.stub(Mediator, 'fire');
        // Instantiate view with an empty model so it can be modified in the serializeData function
        this.view = new views.CheckoutAddressSelectorLayout({
          model: new Backbone.Model({})
        });
        this.view.render();
      });

      after(function() {
        Mediator.fire.restore();
        delete(this.view);
      });

      it('should be an instance of Marionette Layout object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.Layout);
      });

      describe("renders correctly", function() {
        it('should have a checkoutAddressRegion region', function () {
          expect(this.view.checkoutAddressRegion).to.exist;
          expect(this.view.$el.find(this.view.regions.checkoutAddressRegion)).to.be.length(1);
        });
        it('has valid templateHelpers', function () {
          expect(this.view.templateHelpers).to.be.ok;
        });
        it('renders a radio button', function () {
          expect(this.view.$el.find('input[type="radio"]')).to.be.length(1);
        });
        it('and a corresponding label', function () {
          expect(this.view.$el.find('label')).to.be.length(1);
        });
      });

      it("calls mediator strategy to load address view onRender", function() {
        expect(Mediator.fire).to.be.calledWith("mediator.loadAddressesViewRequest");
      });

      describe("checkout delete address button clicked",
        EventTestFactory.simpleBtnClickTest('checkout.deleteAddressBtnClicked', '[data-el-label="checkout.deleteAddressBtn"]'));

      describe("checkout edit address button clicked",
        EventTestFactory.simpleBtnClickTest('checkout.editAddressBtnClicked', '[data-el-label="checkout.editAddressBtn"]'));
    });

    describe('BillingAddressesCompositeView', function () {
      before(function () {
        this.view = new views.BillingAddressesCompositeView();
        this.view.render();
      });

      it('should be an instance of Marionette CompositeView object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.CompositeView);
      });
      it('has valid templateHelpers', function () {
        expect(this.view.templateHelpers).to.be.ok;
      });
      it('has an emptyView', function () {
        expect(this.view.emptyView).to.be.ok;
      });
      it('defines correct itemViewContainer', function () {
        expect(this.view.itemViewContainer).to.be.ok;
        expect(this.view.$el.find(this.view.itemViewContainer)).to.be.length(1);
      });
      it('defines a target render element for activityIndicator', function () {
        expect(this.view.ui.activityIndicatorEl).to.be.ok;
        expect(this.view.$el.find(this.view.ui.activityIndicatorEl)).to.be.length(1);
      });
      it('renders a "Add New Address" button', function () {
        expect(this.view.$el.find('[data-el-label="checkout.newBillingAddressBtn"]')).to.be.length(1);
      });

      describe('add new address button clicked',
        EventTestFactory.simpleBtnClickTest('checkout.addNewAddressBtnClicked', '[data-el-label="checkout.newBillingAddressBtn"]'));
    });

    describe('ShippingAddressesCompositeView', function () {
      before(function () {
        this.view = new views.ShippingAddressesCompositeView();
        this.view.render();
      });

      it('should be an instance of Marionette CompositeView object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.CompositeView);
      });
      it('has valid templateHelpers', function () {
        expect(this.view.templateHelpers).to.be.ok;
      });
      it('has an emptyView', function () {
        expect(this.view.emptyView).to.be.ok;
      });
      it('defines correct itemViewContainer', function () {
        expect(this.view.itemViewContainer).to.be.ok;
        expect(this.view.$el.find(this.view.itemViewContainer)).to.be.length(1);
      });
      it('defines a target render element for activityIndicator', function () {
        expect(this.view.ui.activityIndicatorEl).to.be.ok;
        expect(this.view.$el.find(this.view.ui.activityIndicatorEl)).to.be.length(1);
      });

      it('renders a "Add New Address" button', function () {
        expect(this.view.$el.find('[data-el-label="checkout.newShippingAddressBtn"]')).to.be.length(1);
      });

      describe('add new address button clicked',
        EventTestFactory.simpleBtnClickTest('checkout.addNewAddressBtnClicked', '[data-el-label="checkout.newShippingAddressBtn"]'));
    });
  });
});