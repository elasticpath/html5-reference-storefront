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
  var dataJSON = require('text!../../../../tests/data/address.json');
  var modelHelpers = models.testVariable.modelHelpers;

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
