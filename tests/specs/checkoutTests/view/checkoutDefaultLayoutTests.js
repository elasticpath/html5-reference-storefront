/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 * Functional Storefront Unit Test - Checkout Views
 */
define(function (require) {
  var ep = require('ep');

  var views = require('checkout.views');
  var template = require('text!modules/base/checkout/base.checkout.templates.html');

  describe('Checkout DefaultLayout', function () {
    before(function () {
      $("#Fixtures").append(template);
      this.view = new views.DefaultLayout();
      this.view.render();
    });

    after(function () {
      $("#Fixtures").empty();
    });

    it('should be an instance of Marionette Layout object', function () {
      expect(this.view).to.be.an.instanceOf(Marionette.Layout);
    });
    it('render() should return the view object', function () {
      expect(this.view.render()).to.be.equal(this.view);
    });
    it('view contents are rendered', function () {
      expect(this.view.el.childElementCount).to.be.equal(1);
    });

    describe('regions', function () {
      it('should have a checkoutTitleRegion region', function () {
        expect(this.view.checkoutTitleRegion).to.exist;
        expect(this.view.$el.find('[data-region="checkoutTitleRegion"]')).to.be.length(1);
      });
      it('should have a billingAddressesRegion region', function () {
        expect(this.view.billingAddressesRegion).to.exist;
        expect(this.view.$el.find('[data-region="billingAddressesRegion"]')).to.be.length(1);
      });
      it('should have a shippingAddressesRegion region', function () {
        expect(this.view.shippingAddressesRegion).to.exist;
        expect(this.view.$el.find('[data-region="shippingAddressesRegion"]')).to.be.length(1);
      });
      it('should have a shippingOptionsRegion region', function () {
        expect(this.view.shippingOptionsRegion).to.exist;
        expect(this.view.$el.find('[data-region="shippingOptionsRegion"]')).to.be.length(1);
      });
      it('should have a paymentMethodsRegion region', function () {
        expect(this.view.paymentMethodsRegion).to.exist;
        expect(this.view.$el.find('[data-region="paymentMethodsRegion"]')).to.be.length(1);
      });
      it('should have a checkoutOrderRegion region', function () {
        expect(this.view.checkoutOrderRegion).to.exist;
        expect(this.view.$el.find('[data-region="checkoutOrderRegion"]')).to.be.length(1);
      });
    });
  });

  describe('CheckoutTitleView', function () {
    before(function () {
      $("#Fixtures").append(template);
      this.view = new views.CheckoutTitleView();
      this.view.render();
    });

    after(function () {
      $("#Fixtures").empty();
    });

    it('should be an instance of Marionette ItemView object', function () {
      expect(this.view).to.be.an.instanceOf(Marionette.ItemView);
    });
    it('render() should return the view object', function () {
      expect(this.view.render()).to.be.equal(this.view);
    });
  });
});