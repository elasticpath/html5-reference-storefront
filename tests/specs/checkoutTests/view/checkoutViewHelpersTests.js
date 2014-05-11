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
 * Functional Storefront Unit Test - Checkout Views
 */
define(function (require) {
  var ep = require('ep');

  describe('Checkout ViewHelpers', function () {
    var views = require('checkout.views');
    var viewHelpers = views.testVariables.viewHelpers;

    describe('getSubmitOrderButtonDisabledAttr', function() {
      describe('given an input', function() {
        before(function() {
          var input = 'checkoutToEnableBtn';
          this.result = viewHelpers.getSubmitOrderButtonDisabledAttr(input);
        });

        after(function() {
          delete(this.result);
        });

        it('returns empty string', function() {
          expect(this.result).to.be.a('String');
          expect(this.result).to.be.empty;
        });
      });
      describe('given no input', function() {
        var expectedResult = 'disabled="disabled"';
        before(function() {
          this.result = viewHelpers.getSubmitOrderButtonDisabledAttr(undefined);
        });

        after(function() {
          delete(this.result);
        });

        it('returns html segment with disabled attribute', function() {
          expect(this.result).to.be.eql(expectedResult);
        });
      });
    });

    describe('getUniqueIdForFormInput', function() {
      describe('given an input', function() {
        var input = 'INPUT_TO_getUniqueIdForFormInput_';
        before(function() {
          this.result = viewHelpers.getUniqueIdForFormInput(input);
        });

        after(function() {
          delete(this.result);
        });

        it('returns an ID (non-empty string)', function() {
          expect(this.result).to.be.a('String');
          expect(this.result).to.not.empty;
        });
        it('contains input as part of output', function() {
          expect(this.result).to.have.string(input);
        });
      });
      describe('given no input', function() {
        before(function() {
          this.result = viewHelpers.getUniqueIdForFormInput(undefined);
        });

        after(function() {
          delete(this.result);
        });

        it('returns an ID (non-empty string)', function() {
          expect(this.result).to.be.a('String');
          expect(this.result).to.not.empty;
        });
      });
    });
  });
});