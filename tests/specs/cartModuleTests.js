/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.

 * User: sbrookes
 * Date: 26/07/13
 * Time: 7:31 AM
 *
 */
define(function(require) {
  var cart   = require('cart');
  var cartViews = require('modules/cart/cart.views');
  var cartModel = require('modules/cart/cart.models');

  describe('UI Storefront Cart Module - Default Layout ', function(){
    var defaultLayout = new cart.DefaultLayout();
    it('Cart View defaultLayout should exist', function(){
      expect(defaultLayout).to.be.ok;
    });
    it('Default Layout should have a cartTitleRegion',function(){
      expect(defaultLayout.cartTitleRegion).to.be.ok;
    });
    it('Default Layout should have a mainCartRegion',function(){
      expect(defaultLayout.mainCartRegion).to.be.ok;
    });
    it('Default Layout should have a cartSummaryRegion',function(){
      expect(defaultLayout.cartSummaryRegion).to.be.ok;
    });
    it('Default Layout should have a cartCheckoutRegion',function(){
      expect(defaultLayout.cartCheckoutActionRegion).to.be.ok;
    });


  });
  describe('UI Storefront Cart Module - Cart Views',function(){
    it('DefaultLayout should exist', function(){
      expect(cartViews.DefaultLayout).to.be.ok;
    });
    it('CartTitleView should exist', function(){
      expect(cartViews.CartTitleView).to.be.ok;
    });
    it('MainCartView should exist', function(){
      expect(cartViews.MainCartView).to.be.ok;
    });
    it('CartLineItemView should exist', function(){
      expect(cartViews.CartLineItemView).to.be.ok;
    });
    it('CartSummaryView should exist', function(){
      expect(cartViews.CartSummaryView).to.be.ok;
    });
    it('CartCheckoutActionView should exist', function(){
      expect(cartViews.CartCheckoutActionView).to.be.ok;
    });
  });
  describe('UI Storefront - Cart - Model', function(){
    var testData = {
      "lineItemCount":"3",
      "lineItems":[
        {
          "itemUri": "http://xyz.com/items/mobee/xasdfasdfasdfoiasdfasdfasdff",
          "thumbNailUrl": "http://xyz.com/items/mobee/images/xasdfasdfasdfoiasdfasdfasdff.jpg",
          "thumbNailName":"default-image",
          "displayName": "Test Item One",
          "quantity": "1",
          "price": {
            "list":{
              "amount": "31",
              "currency": "CAD",
              "display": "$31.00"
            },
            "purchase": {
              "amount": "30",
              "currency": "CAD",
              "display": "$30.00"
            }
          },
          totalPrice:{
            "amount": "31",
            "currency": "CAD",
            "display": "$31.00"
          }
        },
        {
          "itemUri": "http://xyz.com/items/mobee/xasdfasdeeeeesdfasdfasdff",
          "thumbNailUrl": "http://xyz.com/items/mobee/images/xasdfasafaeseefoiasdfasdfasdff.jpg",
          "thumbNailName":"default-image",
          "displayName": "Test Item Two",
          "quantity": "2",
          "price": {
            "list":{
              "amount": "10",
              "currency": "CAD",
              "display": "$10.00"
            },
            "purchase": {
              "amount": "10",
              "currency": "CAD",
              "display": "$10.00"
            }
          },
          totalPrice:{
            "amount": "20",
            "currency": "CAD",
            "display": "$20.00"
          }
        },
        {
          "itemUri": "http://xyz.com/items/mobee/55599fasdfasfasdfsdfasdfasdff",
          "thumbNailUrl": "http://xyz.com/items/mobee/images/xasaesre9999ewfsasdfoooosdfasdfasdff.jpg",
          "thumbNailName":"default-image",
          "displayName": "Test Item Three",
          "quantity": "1",
          "price": {
            "list":{
              "amount": "25",
              "currency": "CAD",
              "display": "$25.00"
            },
            "purchase": {
              "amount": "22",
              "currency": "CAD",
              "display": "$22.00"
            }
          },
          totalPrice:{
            "amount": "22",
            "currency": "CAD",
            "display": "$22.00"
          }
        }
      ],
      "summary": {
        "tax":{
          "amount": "0",
          "currency": "CAD",
          "display": "$0.00"
        },
        "subTotal": {
          "amount": "30",
          "currency": "CAD",
          "display": "$30.00"
        },
        "total": {
          "amount": "30",
          "currency": "CAD",
          "display": "$30.00"
        }
      },
      "checkout": {
        "actionlink": "http://10.10.2.141:8080/cortex/carts/mobee/default/lineitems/items/mobee/m5yxissunrjgovjqnrefsrluizlwercvnbyuokzrmqyfg5dspi3xqntbgf4xgqrpoazu44tekvhhmwshk5zwiscrgjheiujsjzdvu5kygjugw"
      }
    };
    it('UI Storefront - Cart - Model',function(){
      var testCartModel = new cartModel.CartModel();
      expect(testCartModel).to.be.ok;
    });
    it('UI Storefront - Cart Item - Collection',function(){
      var testCartItemCollection = new cartModel.CartItemCollection();
      expect(testCartItemCollection).to.be.ok;
    });
    it('UI Storefront - Cart Item - Model',function(){
      var testCartItemModel = new cartModel.CartItemModel();
      expect(testCartItemModel).to.be.ok;
    });


  });
});
