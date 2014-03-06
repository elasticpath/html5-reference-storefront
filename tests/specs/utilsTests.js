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
 */
define(function (require) {

  describe("Utils functions", function () {
    var utils = require('utils');

    describe('isButton', function () {

      it('returns true when called with a jQuery object that is a button', function() {
        expect(utils.isButton( $('<button></button>') )).to.be.true;
      });

      it('returns false when called with a jQuery object that is not a button', function() {
        expect(utils.isButton( $('<a></a>') )).to.be.false;
      });

      it('returns false when called without a valid jQuery object', function() {
        expect(utils.isButton( "some string" )).to.be.false;
      });

      it('returns false when called with undefined', function() {
        expect(utils.isButton( undefined )).to.be.false;
      });

    });
  });

});