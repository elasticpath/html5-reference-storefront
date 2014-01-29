/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 * Functional Storefront Unit Test - Address Component Models
 */
define(function (require) {
  'use strict';

  var ep = require('ep');
  var _ = require('underscore');
  var modelTestFactory = require('testfactory.model');

  var models = require('address.models');
  var dataJSON = require('text!/tests/data/address.json');

  describe('Address Component: Models', function () {
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

    describe('Country Collection', function () {
      var countryData = JSON.parse(_.clone(dataJSON)).countries.response;
      var countryCollection = new models.CountryCollection();

      describe('given response with array of countries', function () {
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
        it('returns countries array with length 1 greater number of countries returned', function () {
          expect(this.collection).to.be.instanceOf(Array);
          expect(this.collection).to.be.length(collectionLength + 1);  // +1 to account for --- option added
        });
        it('has 1st option as empty string value for user to select nothing', function() {
          expect(this.collection[0].name).to.equal('');
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
    describe('Region Collection', function () {
      var regionData = JSON.parse(_.clone(dataJSON)).regions.response;
      var regionCollection = new models.RegionCollection();

      describe('given response with array of regions', function () {
        var collectionLength = regionData._element.length;
        before(function () {
          sinon.spy(modelHelpers, 'parseArray');
          sinon.spy(modelHelpers, 'parseRegion');
          this.collection = regionCollection.parse(regionData);
        });

        after(function () {
          modelHelpers.parseArray.restore();
          modelHelpers.parseRegion.restore();
        });

        it('has a comparator property with value displayName', function () {
          expect(regionCollection.comparator).to.be.equal('displayName');
        });
        it('calls modelHelpers.parseArray function to parse elements', function () {
          expect(modelHelpers.parseArray).to.be.calledOnce;
        });
        it('calls modelHelpers.parseRegion function to parse a country', function () {
          expect(modelHelpers.parseRegion.callCount).to.be.equal(collectionLength);
        });
        it('returns regions array with length 1 greater number of regions returned', function () {
          expect(this.collection).to.be.instanceOf(Array);
          expect(this.collection).to.be.length(collectionLength + 1);  // +1 to account for --- option added
        });
        it('has 1st option as empty string value for user to select nothing', function() {
          expect(this.collection[0].name).to.equal('');
        });
      });

      describe('given no response', function () {
        before(function () {
          sinon.stub(ep.logger, 'error');
          this.model = regionCollection.parse(undefined);
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

    describe('model helper functions', function () {
      var countriesData = JSON.parse(_.clone(dataJSON)).countries.response;

      var testCountryData = jsonPath(countriesData, '$.._element[0]')[0];
      var expectedCountry = {
        displayName: 'China',
        name: 'CN',
        regionLink: 'http://ep-pd-ad-qa0.elasticpath.net:8080/cortex/geographies/campus/countries/inha=/regions'
      };

      describe('helper: parseCountry',
        modelTestFactory.simpleParserTestFactory(testCountryData, expectedCountry, modelHelpers.parseCountry));

      var regionsData = JSON.parse(_.clone(dataJSON)).regions.response;

      var testRegionData = jsonPath(regionsData, '$.._element[0]')[0];
      var expectedRegion = {
        displayName: 'Nunavut',
        name: 'NU'
      };

      describe('helper: parseRegion',
        modelTestFactory.simpleParserTestFactory(testRegionData, expectedRegion, modelHelpers.parseRegion));

    });
  });

});
