/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
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