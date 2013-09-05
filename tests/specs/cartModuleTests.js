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

  describe('UI Storefront Cart Module  ', function () {

    describe('Cart Controller',function(){
      var cartController = require('cart');
      it('DefaultView should exist',function(){
        expect(cartController.DefaultView).to.exist;
      });
    });
    describe('Cart Views', function () {
      describe('Default View ', function () {
        var defaultView = new cartViews.DefaultView();
        it('DefaultView should exist', function () {
          expect(defaultView).to.exist;
        });
        it('DefaultView should have a cartTitleRegion region', function () {
          expect(defaultView.cartTitleRegion).to.exist;
        });
        it('DefaultView should have a mainCartRegion region', function () {
          expect(defaultView.mainCartRegion).to.exist;
        });
        it('DefaultView should have a cartSummaryRegion region', function () {
          expect(defaultView.cartSummaryRegion).to.exist;
        });
        it('DefaultView should have a cartCheckoutRegion region', function () {
          expect(defaultView.cartCheckoutActionRegion).to.exist;
        });
      });
      it('CartTitleView should exist', function () {
        expect(cartViews.CartTitleView).to.exist;
      });
      it('MainCartView should exist', function () {
        expect(cartViews.MainCartView).to.exist;
      });
      it('CartLineItemView should exist', function () {
        expect(cartViews.CartLineItemView).to.exist;
      });
      it('CartSummaryView should exist', function () {
        expect(cartViews.CartSummaryView).to.exist;
      });
      it('CartCheckoutActionView should exist', function () {
        expect(cartViews.CartCheckoutActionView).to.exist;
      });
    });
    describe("Cart Models",function(){
      var defaultView = new cartViews.DefaultView();
    });



  });
});
