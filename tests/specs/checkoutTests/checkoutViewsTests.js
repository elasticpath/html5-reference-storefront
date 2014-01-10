/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.
 *
 * Functional Storefront Unit Test - Checkout Views
 */
define(function (require) {
  var Backbone = require('backbone');
  var ep = require('ep');
  var EventTestFactory = require('EventTestFactory');

  describe('Checkout Module: Views', function () {
    var views = require('checkout.views');
    var template = require('text!modules/base/checkout/base.checkout.templates.html');

    before(function () {
      $("#Fixtures").append(template);
    });

    after(function () {
      $("#Fixtures").empty();
    });

    describe('DefaultLayout', function () {
      before(function () {
        this.view = new views.DefaultLayout();
        this.view.render();
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

    describe('ShippingOptionsCompositeView', function () {
      before(function () {
        this.view = new views.ShippingOptionsCompositeView();
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
        expect(this.view.$el.find('[data-region="shippingOptionSelectorsRegion"]')).to.be.length(1);
      });
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

    describe('CheckoutTitleView', function () {
      before(function () {
        this.view = new views.CheckoutTitleView();
        this.view.render();
      });

      it('should be an instance of Marionette ItemView object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.ItemView);
      });
      it('render() should return the view object', function () {
        expect(this.view.render()).to.be.equal(this.view);
      });
    });

    describe('CheckoutSummaryView', function () {
      // Mock the model with just the data we need
      var rawData = {
        "totalQuantity": 1,
        "subTotal": {
          "currency": "CAD",
          "amount": 4.99,
          "display": "$4.99"
        },
        "taxTotal": {
          "currency": "CAD",
          "amount": 0.6,
          "display": "$0.60"
        },
        "taxes": [
          {
            "currency": "CAD",
            "amount": 0.35,
            "display": "$0.35",
            "title": "PST"
          },
          {
            "currency": "CAD",
            "amount": 0.25,
            "display": "$0.25",
            "title": "GST"
          }
        ],
        "total": {
          "currency": "CAD",
          "amount": 5.59,
          "display": "$5.59"
        },
        "submitOrderActionLink": "fakeSubmitLink"
      };

      before(function () {
        this.view = new views.CheckoutSummaryView({
          model: new Backbone.Model(rawData)
        });
        this.view.render();
      });

      after(function() {
        delete this.view;
      });

      it('should be an instance of Marionette Layout object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.Layout);
      });
      it('render() should return the view object', function () {
        expect(this.view.render()).to.be.equal(this.view);
      });

      describe('regions', function () {
        it('should have a checkoutTaxBreakDownRegion region', function () {
          expect(this.view.checkoutTaxBreakDownRegion).to.exist;
          expect(this.view.$el.find('[data-region="checkoutTaxBreakDownRegion"]')).to.be.length(1);
        });
      });

      describe('renders view content correctly', function() {
        it('renders the total quantity', function() {
          expect(Number($('[data-el-value="checkout.totalQuantity"]', this.view.$el).text()))
            .to.be.equal(rawData.totalQuantity);
        });
        it('renders the sub total', function() {
          expect($('[data-el-value="checkout.subTotal"]', this.view.$el).text())
            .to.be.equal(rawData.subTotal.display);
        });
        it('renders the checkout total', function() {
          expect($('[data-el-value="checkout.total"]', this.view.$el).text())
            .to.be.equal(rawData.total.display);
        });
      });

      describe('when missing taxTotal & taxes', function() {
        before(function () {
          // Remove taxes array and taxTotal object from our raw data
          rawData.taxes = [];
          rawData.taxTotal = {};

          sinon.stub(ep.logger, 'error');

          this.view = new views.CheckoutSummaryView({
            model: new Backbone.Model(rawData)
          });
          this.view.render();
        });

        after(function () {
          ep.logger.error.restore();
        });

        it('view renders without error', function() {
          expect(ep.logger.error).to.be.not.called;
        });
      });
    });

    describe('viewHelpers functions', function() {
      var viewHelpers = views.testVariables.viewHelpers;

      describe('getSubmitOrderButtonDisabledAttr', function() {
        describe('given an input', function() {
          before(function() {
            var input = 'checkoutToEnableBtn';
            this.result = viewHelpers.getSubmitOrderButtonDisabledAttr(input);
          });

          after(function() {
            delete(this.result);
          });

          it('returns empty string', function() {
            expect(this.result).to.be.a('String');
            expect(this.result).to.be.empty;
          });
        });
        describe('given no input', function() {
          var expectedResult = 'disabled="disabled"';
          before(function() {
            this.result = viewHelpers.getSubmitOrderButtonDisabledAttr(undefined);
          });

          after(function() {
            delete(this.result);
          });

          it('returns html segment with disabled attribute', function() {
            expect(this.result).to.be.eql(expectedResult);
          });
        });
      });

      describe('getCheckoutRadioCheckedAttr', function() {
        var expectedResult = 'checked="checked"';
        describe('given an object with chosen set true', function() {
          before(function() {
            var input = {
              chosen: true
            };
            this.result = viewHelpers.getCheckoutRadioCheckedAttr(input);
          });

          after(function() {
            delete(this.result);
          });

          it('returns html segment with checked attribute', function() {
            expect(this.result).to.be.eql(expectedResult);
          });
        });
        describe('given an object without chosen property', function() {
          before(function() {
            var input = {};
            this.result = viewHelpers.getCheckoutRadioCheckedAttr(input);
          });

          after(function() {
            delete(this.result);
          });

          it('returns empty string', function() {
            expect(this.result).to.be.a('String');
            expect(this.result).to.be.empty;
          });
        });
        describe('given no input', function() {
          before(function() {
            this.result = viewHelpers.getCheckoutRadioCheckedAttr(undefined);
          });

          after(function() {
            delete(this.result);
          });

          it('returns empty string', function() {
            expect(this.result).to.be.a('String');
            expect(this.result).to.be.empty;
          });
        });
      });

      describe('getUniqueIdForFormInput', function() {
        describe('given an input', function() {
          var input = 'INPUT_TO_getUniqueIdForFormInput_';
          before(function() {
            this.result = viewHelpers.getUniqueIdForFormInput(input);
          });

          after(function() {
            delete(this.result);
          });

          it('returns an ID (non-empty string)', function() {
            expect(this.result).to.be.a('String');
            expect(this.result).to.not.empty;
          });
          it('contains input as part of output', function() {
            expect(this.result).to.have.string(input);
          });
        });
        describe('given no input', function() {
          before(function() {
            this.result = viewHelpers.getUniqueIdForFormInput(undefined);
          });

          after(function() {
            delete(this.result);
          });

          it('returns an ID (non-empty string)', function() {
            expect(this.result).to.be.a('String');
            expect(this.result).to.not.empty;
          });
        });
      });
    });
  });
});