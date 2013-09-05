/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.

 * User: sbrookes
 * Date: 26/07/13
 * Time: 7:31 AM
 *
 */
define(function (require) {
  var cartViews = require('modules/cart/cart.views');
  var cartModel = require('modules/cart/cart.models');

  describe('UI Storefront Cart Module - Default Layout ', function () {
    var defaultView = new cartViews.DefaultView();
    it('Cart View DefaultView should exist', function () {
      expect(defaultView).to.be.ok;
    });
    it('Default Layout should have a cartTitleRegion', function () {
      expect(defaultView.cartTitleRegion).to.be.ok;
    });
    it('Default Layout should have a mainCartRegion', function () {
      expect(defaultView.mainCartRegion).to.be.ok;
    });
    it('Default Layout should have a cartSummaryRegion', function () {
      expect(defaultView.cartSummaryRegion).to.be.ok;
    });
    it('Default Layout should have a cartCheckoutRegion', function () {
      expect(defaultView.cartCheckoutActionRegion).to.be.ok;
    });
  });

  describe('UI Storefront Cart Module - Cart Views', function () {
    it('DefaultView should exist', function () {
      expect(cartViews.DefaultView).to.be.ok;
    });
    it('CartTitleView should exist', function () {
      expect(cartViews.CartTitleView).to.be.ok;
    });
    it('MainCartView should exist', function () {
      expect(cartViews.MainCartView).to.be.ok;
    });
    it('CartLineItemView should exist', function () {
      expect(cartViews.CartLineItemView).to.be.ok;
    });
    it('CartSummaryView should exist', function () {
      expect(cartViews.CartSummaryView).to.be.ok;
    });
    it('CartCheckoutActionView should exist', function () {
      expect(cartViews.CartCheckoutActionView).to.be.ok;
    });
  });

});
