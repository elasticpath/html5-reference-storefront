/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 * Functional Storefront Unit Test - Checkout Models
 */
define(function (require) {
  var ep = require('ep');
  var modelTestFactory = require('testfactory.model');

  var models = require('checkout.models');
  var dataJSON = require('text!../../../../tests/data/checkout.json');

  describe('Checkout Module: Models', function () {
    var checkoutModel = new models.CheckoutModel();

    describe('given all necessary information', function () {
      before(function () {
        this.rawData = JSON.parse(_.clone(dataJSON)).response;
        this.model = checkoutModel.parse(this.rawData);

        // Get a count of the number of choice and chosen addresses in the rawData JSON
        this.numChosenBillingAddresses = 0;
        this.numChoiceBillingAddresses = 0;

        this.numChosenBillingAddresses = jsonPath(this.rawData, '$.._billingaddressinfo[0].._chosen.._description[0]').length;
        this.numChoiceBillingAddresses = jsonPath(this.rawData, '$.._billingaddressinfo[0].._choice')[0].length;

        this.numChosenShippingAddresses = jsonPath(this.rawData, '$.._destinationinfo[0].._chosen.._description[0]').length;
        this.numChoiceShippingAddresses = jsonPath(this.rawData, '$.._destinationinfo[0].._choice')[0].length;

        this.numChosenShippingOptions = jsonPath(this.rawData, '$.._shippingoptioninfo[0].._chosen.._description[0]').length;
        this.numChoiceShippingOptions = jsonPath(this.rawData, '$.._shippingoptioninfo[0].._choice')[0].length;

        this.numChosenPaymentMethods = jsonPath(this.rawData, '$.._paymentmethodinfo.._paymentmethod[0]').length;
        this.numChoicePaymentMethods = jsonPath(this.rawData, '$.._paymentmethodinfo[0].._choice')[0].length;
      });

      after(function () {
        // Clean up created variables
        delete(this.model);
        delete(this.numChosenBillingAddresses);
        delete(this.numChoiceBillingAddresses);

        delete(this.numChosenShippingAddresses);
        delete(this.numChoiceShippingAddresses);

        delete(this.numChosenShippingOptions);
        delete(this.numChoiceShippingOptions);

        delete(this.numChosenPaymentMethods);
        delete(this.numChoicePaymentMethods);
      });

      it('has non-empty submitOrderLink', function () {
        expect(this.model.submitOrderActionLink).to.be.ok;
      });

      it('has tax object and object not empty ', function () {
        expect(this.model.summary.tax).to.not.eql({});
      });
      it('has subTotal object and object not empty', function () {
        expect(this.model.summary.subTotal).to.not.eql({});
      });
      it('has order total object and object not empty', function () {
        expect(this.model.summary.total).to.not.eql({});
      });
      it('has a total quantity greater than 0', function () {
        expect(this.model.summary.totalQuantity).to.be.above(0);
      });
      it('has parsed a delivery type', function() {
        expect(this.model.deliveryType).to.eql("SHIPMENT");
      });
      it('has showPaymentMethods property set to true', function() {
        expect(this.model.showPaymentMethods).to.be.ok;
      });
      it('has parsed the shipping total', function() {
        expect(this.model.summary.shippingTotal).to.not.empty;
      });
      it('parsed a billingAddresses object with the correct number of addresses', function () {
        expect(this.model.billingAddresses).to.be.not.empty;
        expect(this.model.billingAddresses.length).to.be.equal(this.numChosenBillingAddresses + this.numChoiceBillingAddresses);
      });
      it('parsed a shippingAddresses object with the correct number of addresses', function () {
        expect(this.model.shippingAddresses).to.be.not.empty;
        expect(this.model.billingAddresses.length).to.be.equal(this.numChosenShippingAddresses + this.numChoiceShippingAddresses);
      });
      it('parsed a shippingOptions object with the correct number of options', function() {
        expect(this.model.shippingOptions).to.be.not.empty;
        expect(this.model.shippingOptions.length).to.be.equal(this.numChosenShippingOptions + this.numChoiceShippingOptions);
      });
      it('parsed a paymentMethods object with the correct number of options', function() {
        expect(this.model.paymentMethods.length).to.be.equal(this.numChosenPaymentMethods + this.numChoicePaymentMethods);
      });
    });

    describe('given response', function() {
      var data = JSON.parse(_.clone(dataJSON)).response;
      before(function () {
        sinon.stub(ep.logger, 'error');
      });

      beforeEach(function() {
        ep.logger.error.reset();
      });

      after(function () {
        ep.logger.error.restore();
      });

      describe('is undefined', function() {
        it('logs an error', function () {
          checkoutModel.parse(undefined);
          expect(ep.logger.error).to.be.called;
        });
      });

      describe('is missing billing addresses',
        modelTestFactory.simpleExpectEmptyArrayTestFactory(data, '_billingaddressinfo', checkoutModel, 'billingAddresses'));

      describe('is missing shipping addresses',
        modelTestFactory.simpleExpectEmptyArrayTestFactory(data, '_deliveries', checkoutModel, 'shippingAddresses'));

      describe('is missing shipping options',
        modelTestFactory.simpleExpectEmptyArrayTestFactory(data, '_deliveries', checkoutModel, 'shippingOptions'));

      describe('is missing payment methods',
        modelTestFactory.simpleExpectEmptyArrayTestFactory(data, '_paymentmethodinfo', checkoutModel, 'paymentMethods'));

      describe('is missing tax',
        modelTestFactory.simpleMissingDataTestFactory(checkoutModel, _.omit(data, '_tax'), function() {
          it('returns an empty tax array', function () {
            expect(this.model.summary.taxes).to.be.ok;
          });
          it('returns an empty total tax object', function () {
            expect(this.model.summary.taxTotal).to.be.ok;
          });
        }));

      describe('is missing order total',
        modelTestFactory.simpleMissingDataTestFactory(checkoutModel, _.omit(data, '_total'), function() {
          it('returns an empty total object', function () {
            expect(this.model.summary.total).to.be.ok;
          });
        }));

      var missSubTotal = JSON.parse(_.clone(dataJSON)).response;
      missSubTotal._cart[0]._total = [];
      describe('is missing subTotal',
        modelTestFactory.simpleMissingDataTestFactory(checkoutModel, missSubTotal, function() {
          it('returns an empty subTotal object', function () {
            expect(this.model.summary.subTotal).to.be.ok;
          });
        }));
    });
  });
});
