/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
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

    describe('getCheckoutRadioCheckedAttr', function() {
      var expectedResult = 'checked="checked"';
      describe('given an object with chosen set true', function() {
        before(function() {
          var input = {
            chosen: true
          };
          this.result = viewHelpers.getCheckoutRadioCheckedAttr(input);
        });

        after(function() {
          delete(this.result);
        });

        it('returns html segment with checked attribute', function() {
          expect(this.result).to.be.eql(expectedResult);
        });
      });
      describe('given an object without chosen property', function() {
        before(function() {
          var input = {};
          this.result = viewHelpers.getCheckoutRadioCheckedAttr(input);
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
        before(function() {
          this.result = viewHelpers.getCheckoutRadioCheckedAttr(undefined);
        });

        after(function() {
          delete(this.result);
        });

        it('returns empty string', function() {
          expect(this.result).to.be.a('String');
          expect(this.result).to.be.empty;
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