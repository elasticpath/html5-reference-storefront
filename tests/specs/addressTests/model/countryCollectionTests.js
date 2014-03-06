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

  var models = require('address.models');
  var dataJSON = require('text!../../../../tests/data/address.json');
  var modelHelpers = models.testVariable.modelHelpers;

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

});
