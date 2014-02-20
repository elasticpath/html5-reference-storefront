/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 * Functional Storefront Unit Test - Address Component Models
 */
define(function (require) {
  'use strict';

  var ep = require('ep');
  var _ = require('underscore');

  var models = require('address.models');
  var dataJSON = require('text!../../../../tests/data/address.json');

  var modelHelpers = models.testVariable.modelHelpers;

  describe('Address Model', function () {
    var addressData = JSON.parse(_.clone(dataJSON)).address.response;
    var addressModel = new models.AddressModel();

    describe('given valid response', function () {
      before(function () {
        sinon.spy(modelHelpers, 'parseAddress');
        this.model = addressModel.parse(addressData);
      });

      after(function () {
        modelHelpers.parseAddress.restore();
      });

      it('calls modelHelpers.parseAddress function to parse address', function () {
        expect(modelHelpers.parseAddress).to.be.calledOnce;
      });
      it('returns non-empty address object', function () {
        expect(this.model).to.be.instanceOf(Object)
          .and.not.empty;
      });
    });

    describe('given no response', function () {
      before(function () {
        sinon.stub(ep.logger, 'error');
        this.model = addressModel.parse(undefined);
      });

      after(function () {
        ep.logger.error.restore();
      });

      it('logs an error', function () {
        expect(ep.logger.error).to.be.called;
      });

      it('returns empty object', function () {
        expect(this.model).to.be.empty;
      });
    });
  });

});
