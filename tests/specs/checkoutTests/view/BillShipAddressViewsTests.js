/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 * Functional Storefront Unit Test - Checkout Views
 */
define(function (require) {
  var Backbone = require('backbone');
  var ep = require('ep');
  var EventTestFactory = require('testfactory.event');

  describe('Checkout Billing / Shipping Address Views', function () {
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
        // Instantiate view with an empty model so it can be modified in the serializeData function
        this.view = new views.CheckoutAddressSelectorLayout({
          model: new Backbone.Model({})
        });
        this.view.render();
      });

      it('should be an instance of Marionette Layout object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.Layout);
      });
      it('render() should return the view object', function () {
        expect(this.view.render()).to.be.equal(this.view);
      });
      it('view contents are rendered', function () {
        // There should be 2 child elements (address radio and address label)
        expect(this.view.el.childElementCount).to.be.equal(2);
      });

      describe('regions', function () {
        it('should have a checkoutAddressRegion region', function () {
          expect(this.view.checkoutAddressRegion).to.exist;
          expect(this.view.$el.find('[data-region="checkoutAddressRegion"]')).to.be.length(1);
        });
      });
    });

    describe('BillingAddressesCompositeView', function () {
      before(function () {
        this.view = new views.BillingAddressesCompositeView();
        this.view.render();
      });

      it('should be an instance of Marionette CompositeView object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.CompositeView);
      });
      it('render() should return the view object', function () {
        expect(this.view.render()).to.be.equal(this.view);
      });
      it('renders view contents', function () {
        expect(this.view.$el.find('[data-region="billingAddressSelectorsRegion"]')).to.be.length(1);
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
      it('render() should return the view object', function () {
        expect(this.view.render()).to.be.equal(this.view);
      });
      it('view contents are rendered', function () {
        expect(this.view.$el.find('[data-region="shippingAddressSelectorsRegion"]')).to.be.length(1);
        expect(this.view.$el.find('[data-el-label="checkout.newShippingAddressBtn"]')).to.be.length(1);
      });

      describe('add new address button clicked',
        EventTestFactory.simpleBtnClickTest('checkout.addNewAddressBtnClicked', '[data-el-label="checkout.newShippingAddressBtn"]'));
    });
  });
});