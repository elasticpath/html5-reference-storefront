/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 * Functional Storefront Unit Test - Address Component Models
 */
/* global define: false, jsonPath: false, describe: false, it: false, expect: false, before: false, after: false, sinon: false */

define(function (require) {
  'use strict';

  var ep = require('ep');
  var _ = require('underscore');
  var modelTestFactory = require('testfactory.model');

  var models = require('address.models');
  var dataJSON = require('text!/tests/data/address.json');

  describe('Address Component Module: Models', function () {
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
          expect(this.model).to.be.instanceOf(Object);
          expect(this.model).to.not.eql({});  // test it's not empty
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
          expect(this.model).to.be.eql({});
        });
      });
    });

    // country collection
    describe('Country Collection', function () {
      var countryData = JSON.parse(_.clone(dataJSON)).countries.response;
      var countryCollection = new models.CountryCollection();

      describe('given valid response', function () {
        var collectionLength = countryData._element.length;
        before(function () {
          sinon.spy(modelHelpers, 'parseArray');
          sinon.spy(modelHelpers, 'parseCountry');
          this.collection = countryCollection.parse(countryData);
        });

        after(function () {
          modelHelpers.parseArray.restore();
          modelHelpers.parseCountry.restore();
        });

        it('has a comparator property with value displayName', function () {
          expect(countryCollection.comparator).to.be.equal('displayName');
        });
        it('calls modelHelpers.parseArray function to parse elements', function () {
          expect(modelHelpers.parseArray).to.be.calledOnce;
        });
        it('calls modelHelpers.parseCountry function to parse a country', function () {
          expect(modelHelpers.parseCountry.callCount).to.be.equal(collectionLength);
        });
        it('returns countries array with length match number of countries returned', function () {
          expect(this.collection).to.be.instanceOf(Array);
          expect(this.collection).to.be.not.length(0);  // test it's not empty
        });
      });

      describe('given no response', function () {
        before(function () {
          sinon.stub(ep.logger, 'error');
          this.model = countryCollection.parse(undefined);
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

    // region collection

    describe('model helper functions', function () {
      var data = JSON.parse(_.clone(dataJSON)).countries.response;

      var testData = jsonPath(data, '$.._element[0]')[0];
      var expected = {
        displayName: 'China',
        name: 'CN'
      };

      describe('helper: parseCountry',
        modelTestFactory.simpleParserTestFactory(testData, expected, modelHelpers.parseCountry));
      // parseCountries
      // parseRegions
    });
  });

});
