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
 *
 * Model Test Factories.
 */

define(function (require) {
  var ep = require('ep');

  return {
    /**
     * Create a simple test to test model provides empty object / array for a property
     * even if that part of raw data is missing. The importance of this is to prevent view from throw error
     * when using that property to render.
     *
     * @param model       model under testing
     * @param rawData     name of part of raw data to be removed
     * @param testFns     test functions to assert property has empty object / array for value
     * @returns {Function} a simple test expecting model will not cause error for views even with missing raw data
     */
    simpleMissingDataTestFactory: function (model, rawData, testFns) {
      return function () {
        var isSpying = false;

        before(function () {
          // make sure EventBus.trigger isn't spied already outside
          if (ep.logger.error.toString() !== 'error') {
            sinon.spy(ep.logger, 'error');
            isSpying = true;
          }

          this.model = model.parse(rawData);
        });

        after(function () {
          delete(this.model);

          if (isSpying) {
            ep.logger.error.restore();
          }
        });

        it('does not raise an error', function () {
          expect(ep.logger.error).to.be.not.called;
        });

        testFns();
      };
    },

    /**
     * Create a simple test that expect empty array when tested raw data is unavailable.
     *
     * @param jsonData          the raw json data
     * @param dataToRemove      name of part of raw data to be removed
     * @param model             model under testing
     * @param arrayName         name of array expected to be empty
     * @returns {Function}      a simple test expecting empty array when raw data is unavailable
     */
    simpleExpectEmptyArrayTestFactory: function (jsonData, dataToRemove, model, arrayName) {
      return this.simpleMissingDataTestFactory(model, _.omit(jsonData, dataToRemove), function () {
        it('returns an empty ' + arrayName + ' array', function () {
          expect(this.model[arrayName]).to.be.instanceOf(Array);
          expect(this.model[arrayName]).to.be.empty;
        });
      });
    },

    simpleParserTestFactory: function (testData, expected, fnToTest) {
      return function () {
        beforeEach(function () {
          sinon.stub(ep.logger, 'warn');
        });

        afterEach(function () {
          ep.logger.warn.restore();
        });

        it("parses JSON object correctly", function () {
          var model = fnToTest(testData);
          for (var attr in expected) {
            expect(model[attr]).to.be.eql(expected[attr]);
          }
        });

        it("logs error given undefined argument", function () {
          fnToTest(undefined);
          expect(ep.logger.warn).to.be.calledOnce;
        });

        it("return empty model object given invalid data to parse", function () {
          var model = fnToTest({invalidData: 'invalid'});
          expect(model).to.be.ok;
        });
      };
    }
  };
});