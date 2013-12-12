/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.
 *
 * Functional Storefront Unit Test - Checkout Models
 */
define(function (require) {
  var ep = require('ep');
  var models = require('checkout.models');
  var dataJSON = require('text!/tests/data/checkout.json');

  describe('Checkout Module: Models', function () {
    var data = JSON.parse(dataJSON).response;
    var checkoutModel = new models.CheckoutModel();
    var modelHelpers = _.extend(models.testVariable.modelHelpers, {});

    describe('given all necessary information', function () {
      before(function () {
        this.rawData = _.extend({}, data);
        this.model = checkoutModel.parse(this.rawData);
        this.model = checkoutModel.parse(this.rawData);

        // Get a count of the number of choice and chosen addresses in the rawData JSON
        this.numChosenAddresses = 0;
        this.numChoiceAddresses = 0;

        this.numChosenAddresses = jsonPath(this.rawData, '$.._billingaddressinfo[0].._chosen.._description[0]').length;
        this.numChoiceAddresses = jsonPath(this.rawData, '$.._billingaddressinfo[0].._choice')[0].length;
      });

      after(function () {
        // Clean up created variables
        delete(this.model);
        delete(this.numChosenAddresses);
        delete(this.numChoiceAddresses);
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

      it('parsed a billingAddresses object with the correct number of addresses', function () {
        expect(this.model.billingAddresses).to.be.ok;
        expect(this.model.billingAddresses.length).to.be.eql(this.numChosenAddresses + this.numChoiceAddresses);
      });

      // CHECKIN fix/amend this test
//      it('added the chosen property to identify the chosen address object', function() {
//        if(this.numChosenAddresses === 1) {
//          // The chosen billing address will always be the first address in the billingAddresses array
//          expect(this.model.billingAddresses[0]).to.have.property('chosen', true);
//        }
//      });
    });

    describe('given undefined response argument to parse', function () {
      before(function () {
        sinon.stub(ep.logger, 'error');
        checkoutModel.parse(undefined);
      });

      after(function () {
        ep.logger.error.restore();
      });

      it('catches & logs the error', function () {
        expect(ep.logger.error).to.be.called;
      });
    });

    describe('does not cause error', function () {
      beforeEach(function () {
        sinon.stub(ep.logger, 'error');
      });

      afterEach(function () {
        ep.logger.error.restore();
      });

      it('when missing submitOrderActionLink', function () {
        var rawData = _.extend({}, data);
        rawData._purchaseform = [];
        var model = checkoutModel.parse(rawData);

        expect(ep.logger.error).to.be.not.called;
        expect(model.submitOrderActionLink).to.be.undefined;
      });

      it('when missing total quantity', function () {
        var rawData = _.extend({}, data);
        rawData._cart[0]['total-quantity'] = undefined;
        var model = checkoutModel.parse(rawData);

        expect(ep.logger.error).to.be.not.called;
        expect(model.summary.totalQuantity).to.be.undefined;
      });

      it('when missing subTotal', function () {
        var rawData = _.extend({}, data);
        rawData._cart[0]._total = [];
        var model = checkoutModel.parse(rawData);

        expect(ep.logger.error).to.be.not.called;
        expect(model.summary.subTotal).to.be.ok;
      });

      it('when missing tax', function () {
        var rawData = _.extend({}, data);
        rawData._tax = [];

        var model = checkoutModel.parse(rawData);

        expect(ep.logger.error).to.be.not.called;
        expect(model.summary.taxTotal).to.be.ok;
        expect(model.summary.taxes).to.be.ok;
      });

      it('when missing order total', function () {
        var rawData = _.extend({}, data);
        rawData._total = [];
        var model = checkoutModel.parse(rawData);

        expect(ep.logger.error).to.be.not.called;
        expect(model.summary.total).to.be.ok;
      });

      it('when missing billing Address', function () {
        var rawData = _.extend({}, data);
        rawData._billingaddressinfo = [];
        var model = checkoutModel.parse(rawData);

        expect(ep.logger.error).to.be.not.called;
        expect(model.billingAddresses).to.be.ok;
      });

      // FIXME
      it('when missing a chosen billing address', function() {
        // and it doesn't add the 'chosen' property to any of the billing address objects generated
      });

    });

    describe('model helper functions', function() {
      describe('isChosenAddressDefined', function() {
        describe('given an addresses array with a chosen address', function() {
          before(function() {
            // The default checkout JSON data contains a chosen billing address
            this.parsedBillingAddresses = modelHelpers.parseBillingAddresses(data);
          });

          after(function() {
            delete(this.parsedBillingAddresses);
          });

          it('returns true', function() {
            expect(modelHelpers.isChosenAddressDefined(this.parsedBillingAddresses)).to.be.true;
          });
        });
        describe('given an addresses array without a chosen address', function() {
          before(function() {
            // Remove the chosen address object from the checkout test data
            this.rawData = _.extend(data, {});
            delete(this.rawData._billingaddressinfo[0]._selector[0]._chosen);

            // The default checkout JSON data contains a chosen billing address
            this.parsedBillingAddresses = modelHelpers.parseBillingAddresses(data);
          });

          after(function() {
            delete(this.parsedBillingAddresses);
          });

          it('returns false', function() {
            expect(modelHelpers.isChosenAddressDefined(this.parsedBillingAddresses)).to.be.false;
          });
        });
        describe('when passed an undefined addresses array', function() {
          it('returns false', function() {
            expect(modelHelpers.isChosenAddressDefined(undefined)).to.be.false;
          });
        });
      });

      describe('sortAddresses', function() {
        describe('given an unsorted addresses array and property name to sort by that contains a string', function() {
          it('returns a sorted array', function() {

          });
        });
        describe('given a sorted addresses array and a valid property name to sort by', function() {
          it('returns the array unchanged', function() {

          });
        });
        describe('when it is called with a sort property that is not a string', function() {
          it('returns the array unchanged', function() {

          });
        });
      });

    });

  });


})
;
