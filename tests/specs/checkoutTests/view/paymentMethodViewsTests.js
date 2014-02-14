/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 * Functional Storefront Unit Test - Checkout Views
 */
define(function (require) {
  var ep = require('ep');

  describe('Checkout Payment Method Views', function () {
    var views = require('checkout.views');
    var template = require('text!modules/base/checkout/base.checkout.templates.html');

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
        expect(this.view.$el.find('[data-region="checkoutPaymentMethodRegion"]')).to.be.length(1);
      });
      it('should have a checkoutPaymentRegion region', function () {
        expect(this.view.checkoutPaymentRegion).to.exist;
        expect(this.view.$el.find('[data-region="checkoutPaymentMethodRegion"]')).to.be.length(1);
      });

      // FIXME unable to test selection change trigger event
      // EventTestFactory.simpleSelectionChangedTest might help.
    });

    describe('PaymentMethodsCompositeView', function () {
      before(function () {
        this.view = new views.PaymentMethodsCompositeView();
        this.view.render();
      });

      it('should be an instance of Marionette CompositeView object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.CompositeView);
      });
      it('render() should return the view object', function () {
        expect(this.view.render()).to.be.equal(this.view);
      });
      it('renders the view contents', function () {
        // View should contain a heading element and a <div> region for shipping options
        expect(this.view.el.childElementCount).to.be.equal(2);
        expect(this.view.$el.find('[data-region="paymentMethodSelectorsRegion"]')).to.be.length(1);
      });
      it('has an emptyView', function() {
        expect(this.view.emptyView).to.be.ok;
      });
    });

  });
});