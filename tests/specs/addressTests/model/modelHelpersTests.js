/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
