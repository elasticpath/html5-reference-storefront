/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.
 *
 * Functional Storefront Unit Test - Checkout Views
 */
define(function (require) {
  var Backbone = require('backbone');
  var EventBus = require('eventbus');
  var Mediator = require('mediator');
  var EventTestFactory = require('EventTestFactory');
  var EventTestHelpers = require('testhelpers.event');
  var dataJSON = require('text!/tests/data/checkout.json');

  describe('Checkout Module: Views', function () {
    var views = require('checkout.views');
    var template = require('text!modules/base/checkout/base.checkout.templates.html');
    var data = JSON.parse(dataJSON).response;

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
        it('should have a billingAddressRegion region', function () {
          expect(this.view.billingAddressesRegion).to.exist;
          expect(this.view.$el.find('[data-region="billingAddressesRegion"]')).to.be.length(1);
        });
        it('should have a cancelCheckoutActionRegion region', function () {
          expect(this.view.cancelCheckoutActionRegion).to.exist;
          expect(this.view.$el.find('[data-region="cancelCheckoutActionRegion"]')).to.be.length(1);
        });
        it('should have a checkoutOrderRegion region', function () {
          expect(this.view.checkoutOrderRegion).to.exist;
          expect(this.view.$el.find('[data-region="checkoutOrderRegion"]')).to.be.length(1);
        });
      });
    });

    describe('BillingAddressSelectorLayout', function () {
      before(function () {
        this.view = new views.BillingAddressSelectorLayout();
        this.view.render();
      });

      it('should be an instance of Marionette Layout object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.Layout);
      });
      it('render() should return the view object', function () {
        expect(this.view.render()).to.be.equal(this.view);
      });
      it('view contents are rendered', function () {
        // There should be 2 child elements (billing address radio and billing address label)
        expect(this.view.el.childElementCount).to.be.equal(2);
      });

      describe('regions', function () {
        it('should have a checkoutTitleRegion region', function () {
          expect(this.view.billingAddressRegion).to.exist;
          expect(this.view.$el.find('[data-region="billingAddressRegion"]')).to.be.length(1);
        });
      });

      // FIXME: triggering the click event of the radio button doesn't seem to trigger the change event
//      describe('selected billing address changes', function() {
//      before(function () {
//        sinon.spy(EventBus, 'trigger');
//
//        // isolate unit by unbinding subsequent triggered events
//        EventTestHelpers.unbind('checkout.billingAddressRadioChanged');
//
//        this.view.$el.find('input[name="billingAddress"]').trigger('click');
//      });
//
//      after(function() {
//        EventBus.trigger.restore();
//        EventTestHelpers.reset();
//      });
//
//      it('should trigger cart.billingAddressRadioChanged event', function() {
//        expect(EventBus.trigger).to.be.calledWith('checkout.billingAddressRadioChanged');
//      });
//    });
  });

    describe('BillingAddressesCompositeView', function () {
      before(function () {
        this.view = new views.BillingAddressesCompositeView();
        this.view.render();
      });

      it('should be an instance of Marionette Layout object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.CompositeView);
      });
      it('render() should return the view object', function () {
        expect(this.view.render()).to.be.equal(this.view);
      });
      it('view contents are rendered', function () {
        // View should contain a heading element and a <div> region for billing addresses
        expect(this.view.el.childElementCount).to.be.equal(2);
        expect(this.view.$el.find('[data-region="billingAddressSelectorsRegion"]')).to.be.length(1);
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
        "totalQuantity": "1",
        "submitOrderActionLink": "submitOrderActionLink",
        "taxTotal": {
          "currency": "CAD",
          "amount": 0.4,
          "display": "$0.40"
        },
        "taxes": [
          {
            "currency": "CAD",
            "amount": 0.1,
            "display": "$0.10",
            "title": "GST"
          },
          {
            "currency": "CAD",
            "amount": 0.3,
            "display": "$0.30",
            "title": "PST"
          }
        ],
        "total": {
          "currency": "CAD",
          "amount": 5.19,
          "display": "$5.19"
        },
        "subTotal": {
          "currency": "CAD",
          "amount": 4.99,
          "display": "$4.99"
        }
      };

      before(function () {
        this.view = new views.CheckoutSummaryView(
          new Backbone.Model(rawData)
        );
        this.view.render();
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

      describe('when missing taxes', function() {
        it('does not render taxes collection');
      });

      describe('when missing taxTotal & taxes', function() {
        it('view renders without error');
      });
    });

    describe('CheckoutSummaryView', function () {
      before(function () {
        // Mock the model with just the data we need
        var rawData = {
          "tax": {
            "currency": "CAD",
            "amount": 0.2,
            "display": "$0.20"
          },
          "total": {
            "currency": "CAD",
            "amount": 5.19,
            "display": "$5.19"
          },
          "totalQuantity": "1",
          "subTotal": {
            "currency": "CAD",
            "amount": 4.99,
            "display": "$4.99"
          }
        };
        this.model = new Backbone.Model(rawData);

        this.view = new views.CheckoutSummaryView({
          model: this.model
        });
        this.view.render();
      });

      after(function () {
        this.model.destroy();
      });

      it('should be an instance of Marionette ItemView object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.ItemView);
      });
      it('render() should return the view object', function () {
        expect(this.view.render()).to.be.equal(this.view);
      });

      it('renders view content correctly', function () {
        expect($('[data-el-value="checkout.totalQuantity"]', this.view.$el).text())
          .to.be.equal(this.model.get('totalQuantity'));

        expect($('[data-el-value="checkout.subTotal"]', this.view.$el).text())
          .to.be.equal(this.model.get('subTotal').display);

        expect($('[data-el-value="checkout.tax"]', this.view.$el).text())
          .to.be.equal(this.model.get('tax').display);

        expect($('[data-el-value="checkout.total"]', this.view.$el).text())
          .to.be.equal(this.model.get('total').display);

      });
    });

    describe('submitOrderActionView', function () {
      before(function () {
        // Mock the model with just the data we need
        var rawData = {
          "submitOrderActionLink": "someUri"
        };
        this.model = new Backbone.Model(rawData);
        this.view = new views.submitOrderActionView({ model: this.model });
        this.view.render();
      });

      it('should be an instance of Marionette ItemView object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.ItemView);
      });
      it('render() should return the view object', function () {
        expect(this.view.render()).to.be.equal(this.view);
      });
      it('renders submitOrder button', function() {
        expect(this.view.$el.find('button[data-el-label="checkout.submitOrder"]')).to.be.length(1);
      });

      describe('complete purchase button clicked', function() {
        before(function() {
          sinon.spy(EventBus, 'trigger');

          // Unbind subsequently triggered events
          EventTestHelpers.unbind('checkout.submitOrderBtnClicked');

          this.view.$el.find('[data-el-label="checkout.submitOrder"]').click();
        });

        after(function() {
          EventBus.trigger.restore();
          EventTestHelpers.reset();
        });

        it('should trigger submitOrderBtnClicked event', function() {
          expect(EventBus.trigger).to.be.calledWithExactly('checkout.submitOrderBtnClicked', this.model.get('submitOrderActionLink'));
        });
      });
    });

    describe('CancelCheckoutActionView', function () {
      before(function () {
        this.view = new views.CancelCheckoutActionView();
        this.view.render();
      });

      it('should be an instance of Marionette ItemView object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.ItemView);
      });
      it('render() should return the view object', function () {
        expect(this.view.render()).to.be.equal(this.view);
      });
      it('renders submitOrder button', function() {
        expect(this.view.$el.find('button[data-el-label="checkout.cancelCheckout"]')).to.be.length(1);
      });

      describe('checkout cancel button clicked',
        EventTestFactory.simpleBtnClickTest('checkout.cancelOrderBtnClicked', '[data-el-label="checkout.cancelCheckout"]'));
    });

  });
});