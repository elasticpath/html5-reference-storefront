/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 * Functional Storefront Unit Test - Profile Views
 */
define(function (require) {
  var ep = require('ep');
  var profileViews = require('profile.views');
  var viewHelpers = profileViews.testVariables.viewHelpers;


  describe('viewHelpers functions', function() {

    describe('getDate', function() {
      describe('given an date object', function() {
        var dateObj = {
          displayValue: 'fakeDateDisplayValue'
        };
        before(function() {
          this.result = viewHelpers.getDate(dateObj);
        });

        after(function() {
          delete(this.result);
        });

        it('returns the date display value', function() {
          expect(this.result).to.be.equal(dateObj.displayValue);
        });
      });
      describe('given no input', function() {
        before(function() {
          this.result = viewHelpers.getDate(undefined);
        });

        after(function() {
          delete(this.result);
        });

        it('returns an empty string', function() {
          expect(this.result).to.be.a('String');
        });
      });
    });

    describe('getTotal', function() {
      describe('given an date object', function() {
        var dateObj = {
          display: 'fakeValue'
        };
        before(function() {
          this.result = viewHelpers.getTotal(dateObj);
        });

        after(function() {
          delete(this.result);
        });

        it('returns the display value', function() {
          expect(this.result).to.be.equal(dateObj.display);
        });
      });
      describe('given no input', function() {
        before(function() {
          this.result = viewHelpers.getDate(undefined);
        });

        after(function() {
          delete(this.result);
        });

        it('returns an empty string', function() {
          expect(this.result).to.be.a('String');
        });
      });
    });

  });
});