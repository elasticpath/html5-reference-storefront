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
