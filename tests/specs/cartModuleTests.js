/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.

 * User: sbrookes
 * Date: 26/07/13
 * Time: 7:31 AM
 *
 */
define(function (require) {

  describe('UI Storefront Cart Module  ', function () {

    describe('Cart Controller',function(){
      var cartController = require('cart');
      describe("DefaultView",function(){
        var defaultView = new cartController.DefaultView();
        it('DefaultView should exist',function(){
          expect(defaultView).to.exist;
        });
      });

    });
    describe('Cart Views', function () {
      var cartViews = require('cart.views');
      describe('DefaultView ', function () {
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
        it('DefaultView should have a cartCheckoutMasterRegion region', function () {
          expect(defaultView.cartCheckoutMasterRegion).to.exist;
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
      it('CartCheckoutMasterView should exist', function () {
        expect(cartViews.CartCheckoutMasterView).to.exist;
      });
      it('CartCheckoutActionView should exist', function () {
        expect(cartViews.CartCheckoutActionView).to.exist;
      });
      it('EmptyCartView should exist', function () {
        expect(cartViews.EmptyCartView).to.exist;
      });


    });
    describe("Cart Models",function(){
      var cartModel = require('cart.models');
      it("CartModel should exist",function(){
        expect(cartModel.CartModel).to.exist;
      });
      it("CartItemCollection should exist",function(){
        expect(cartModel.CartItemCollection).to.exist;
      });
      it("CartItemModel should exist",function(){
        expect(cartModel.CartItemModel).to.exist;
      });

    });



  });
});
