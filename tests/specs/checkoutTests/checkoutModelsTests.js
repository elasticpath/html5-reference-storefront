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

    describe('given all necessary information', function () {
      before(function () {
        var rawData = _.extend({}, data);
        this.model = checkoutModel.parse(rawData);
      });

      after(function () {
        this.model = null;
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

      it('parsed a billingAddresses.chosenBillingAddress object', function () {
        expect(this.model.billingAddresses).to.be.ok;
        expect(this.model.billingAddresses.chosenBillingAddress).to.not.eql({});
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
        expect(model.summary.tax).to.be.ok;
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
  });


})
;
