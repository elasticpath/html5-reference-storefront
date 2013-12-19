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
    var modelHelpers = _.extend({}, models.testVariable.modelHelpers);

    describe('given all necessary information', function () {
      before(function () {
        this.rawData = _.extend({}, data);
        this.model = checkoutModel.parse(this.rawData);
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
      it('parsed a billingAddresses object with the correct number of addresses', function () {
        expect(this.model.billingAddresses).to.be.not.eql([]);
        expect(this.model.billingAddresses.length).to.be.eql(this.numChosenBillingAddresses + this.numChoiceBillingAddresses);
      });

      it('parsed a shippingAddresses object with the correct number of addresses', function () {
        expect(this.model.shippingAddresses).to.be.not.eql([]);
        expect(this.model.billingAddresses.length).to.be.eql(this.numChosenShippingAddresses + this.numChoiceShippingAddresses);
      });

      it('parsed a shippingOptions object with the correct number of options', function() {
        expect(this.model.shippingOptions).to.be.not.eql([]);
        expect(this.model.shippingOptions.length).to.be.eql(this.numChosenShippingOptions + this.numChoiceShippingOptions);
      });
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

    });

    describe('model helper functions', function() {
      describe('setChosenAddress', function() {
        describe('given an addresses array with a chosen address', function() {
          before(function() {
            // The default checkout JSON data contains a chosen billing address
            this.parsedBillingAddresses = modelHelpers.parseCheckoutAddresses(data, "billingaddressinfo");
          });

          after(function() {
            delete(this.parsedBillingAddresses);
          });

          it('returns the addresses array unchanged', function() {
            expect(modelHelpers.setChosenAddress(this.parsedBillingAddresses)).to.be.eql(this.parsedBillingAddresses);
          });
        });
        describe('given an addresses array without a chosen address', function() {
          before(function() {
            // Remove the chosen address object from (a deep copy of) the checkout test data
            this.rawData = JSON.parse(JSON.stringify(data));
            delete(this.rawData._billingaddressinfo[0]._selector[0]._chosen);

            // A parsed addresses array without chosen address for comparison
            this.parsedBillingAddresses = modelHelpers.parseCheckoutAddresses(this.rawData, "billingaddressinfo");

            this.parsedBillingAddressesWithDefault =  modelHelpers.setChosenAddress(
              modelHelpers.parseCheckoutAddresses(this.rawData, "billingaddressinfo")
            );
          });

          after(function() {
            delete(this.parsedBillingAddresses);
            delete(this.parsedBillingAddressesWithDefault);
          });

          it('returns a modified addresses array', function() {
            expect(this.parsedBillingAddressesWithDefault).to.not.be.eql(this.parsedBillingAddresses);
          });
          it('adds a "setAsDefaultChoice" property to the first address in the array', function() {
            expect(this.parsedBillingAddressesWithDefault[0]).to.have.property('setAsDefaultChoice');
          });
        });
      });

      describe('sortAddresses', function() {
        describe('given an unsorted addresses array and a property name string to sort by', function() {
          before(function() {
            // The default checkout JSON data contains an unordered set of billing addresses
            this.rawData = _.extend({}, data);
            this.sortProperty = "streetAddress";

            sinon.spy(_, 'sortBy');

            this.parsedBillingAddresses = modelHelpers.parseCheckoutAddresses(this.rawData, "billingaddressinfo");

            this.testCaseInsensitiveSortedAddresses = _.sortBy(this.parsedBillingAddresses, function(addressObj) {
              return addressObj[this.sortProperty].toLowerCase();
            }, this);

            this.sortedAddresses = modelHelpers.sortAddresses(this.parsedBillingAddresses, this.sortProperty);
          });

          after(function() {
            // Clean up the test variables created
            delete(this.rawData);
            delete(this.sortProperty);
            delete(this.parsedBillingAddresses);

            _.sortBy.restore();
          });

          it('calls underscore\'s sortBy function with the billing addresses array', function() {
            expect(_.sortBy).to.be.calledWith(this.parsedBillingAddresses);
          });
          it('returns a case-insensitive sorted array of billing addresses', function() {
            expect(this.sortedAddresses).to.eql(this.testCaseInsensitiveSortedAddresses);
          });
        });
        describe('given an addresses array and a sort property of undefined', function() {
          before(function() {
            this.rawData = _.extend({}, data);
            sinon.spy(_, 'sortBy');

            this.parsedBillingAddresses = modelHelpers.parseCheckoutAddresses(this.rawData, "billingaddressinfo");

            this.sortedAddresses = modelHelpers.sortAddresses(this.parsedBillingAddresses, undefined);
          });
          after(function() {
            delete(this.parsedBillingAddresses);
            delete(this.sortedAddresses);
            _.sortBy.restore();
          });
          it('calls underscore\'s sortBy function with the billing addresses array', function() {
            expect(_.sortBy).to.be.calledWith(this.parsedBillingAddresses);
          });
          it('returns an unchanged billing addresses array', function() {
            expect(this.sortedAddresses).to.eql(this.parsedBillingAddresses);
          });
        });
      });

      describe('parseShippingOptions', function() {
        describe('given a valid JSON response', function() {
          before(function() {
            this.rawData = _.clone(data);
            this.numChosenShippingOptions = 0;

            this.parsedShippingOptions = modelHelpers.parseShippingOptions(this.rawData);

            var numShippingOptions = this.parsedShippingOptions.length;

            // Search the array of parsed shipping options for an object with a chosen property
            while(numShippingOptions--) {
              if (_.has(this.parsedShippingOptions[numShippingOptions], 'chosen')) {
                this.numChosenShippingOptions += 1;
              }
            }
          });
          after(function() {
            delete(this.parsedShippingOptions);
          });
          it('returns an array with the correct number of shipping options objects', function() {
            // The raw checkout JSON data contains 2 shipping options
            expect(this.parsedShippingOptions.length).to.eql(2);
          });
          it('returns an array with a chosen shipping option object', function() {
            expect(this.numChosenShippingOptions).to.eql(1);
          });
          it('returns an array where all choice shipping options have selectAction properties', function() {
            var numShippingOptions = this.parsedShippingOptions.length;
            var isMissingSelectAction = false;

            // Search the array of parsed shipping option objects for choice options without selectAction properties
            while(numShippingOptions--) {
              var currentObj = this.parsedShippingOptions[numShippingOptions];

              // if this is a choice address
              if (!_.has(currentObj, 'chosen')) {
                if (!_.has(currentObj, 'selectAction')) {
                  isMissingSelectAction = true;
                }
              }
            }
            expect(isMissingSelectAction).to.be.false;
          });
        });

        describe('given an undefined JSON response parameter', function(){
          before(function() {
            sinon.stub(ep.logger, 'error');
            this.parsedShippingOptions = modelHelpers.parseShippingOptions(undefined);
          });
          after(function() {
            delete(this.parsedShippingOptions);
            ep.logger.error.restore();
          });
          it('returns an empty array and logs an error', function() {
            expect(this.parsedShippingOptions).to.eql([]);
            expect(ep.logger.error).to.be.called;
          });
        });
      });
    });
  });

});
