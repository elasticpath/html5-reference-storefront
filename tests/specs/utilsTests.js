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

    describe('getDescendedPropertyValue', function () {
      beforeEach(function() {
        sinon.stub(console, 'warn');
      });
      afterEach(function() {
        console.warn.restore();
        delete(this.returnValue);
      });
      describe('when called without a valid object', function () {
        it('returns undefined and logs a warning to the console' ,function () {
          this.returnValue = utils.getDescendedPropertyValue('not an Object', ['a', 'valid', 'array']);
          expect(this.returnValue).to.be.undefined;
          expect(console.warn).to.be.calledOnce;
        });
      });
      describe('when called without a valid array', function () {
        it('returns undefined and logs a warning to the console' ,function () {
          this.returnValue = utils.getDescendedPropertyValue({}, 'not an Array');
          expect(this.returnValue).to.be.undefined;
          expect(console.warn).to.be.calledOnce;
        });
      });
      describe('when called with an empty array', function () {
        it('returns undefined and logs a warning to the console' ,function () {
          this.returnValue = utils.getDescendedPropertyValue({}, []);
          expect(this.returnValue).to.be.undefined;
          expect(console.warn).to.be.calledOnce;
        });
      });
      describe('when called with a valid object and array', function () {
        it('returns the value of the relevant property and does not log a warning to the console' ,function () {
          this.returnValue = utils.getDescendedPropertyValue({a: {b: {c: {d:1} } } }, ['a', 'b', 'c', 'd']);
          expect(this.returnValue).to.deep.equal(1);
          expect(console.warn).to.not.be.called;
        });
      });
    });

  });

});