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
