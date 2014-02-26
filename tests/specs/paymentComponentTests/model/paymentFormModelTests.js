/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 * Functional Storefront Unit Test - Payment Component Models
 */
define(function (require) {
  'use strict';

  var ep = require('ep');
  var _ = require('underscore');

  var models = require('payment.models');
  var dataJSON = require('text!../../../../tests/data/payment.json');

  describe('Payment: NewPaymentModel', function () {
    var paymentData = JSON.parse(_.clone(dataJSON)).response;
    var paymentModel = new models.NewPaymentModel();

    describe('given valid response', function () {
      before(function () {
        this.model = paymentModel.parse(paymentData);
      });

      after(function () {
        delete(this.model);
      });

      it('returns href link', function () {
        expect(this.model.href).to.be.equal('ROOT/paymenttokens/orders/campus/ID');
      });
    });

    describe('given no response', function () {
      before(function () {
        sinon.stub(ep.logger, 'error');
        this.model = paymentModel.parse(undefined);
      });

      after(function () {
        ep.logger.error.restore();
      });

      it('logs an error', function () {
        expect(ep.logger.error).to.be.called;
      });

      it('returns empty object', function () {
        expect(this.model).to.be.eql({});
      });
    });
  });

});
