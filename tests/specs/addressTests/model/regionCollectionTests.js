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

});
