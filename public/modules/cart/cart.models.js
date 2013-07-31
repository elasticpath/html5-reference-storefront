/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 */
define(['ep','eventbus', 'backbone'],
  function(ep, EventBus, Backbone){


    var cartModel = Backbone.Model.extend({
      parse:function(cart){

        var cartObj = {};

        /*
         * Cart Summary: total quantity & total price (excluding tax)
         */
        cartObj.cartTotalQuantity = jsonPath(cart, "$.['total-quantity']")[0];
        cartObj.cartSubTotal = jsonPath(cart, "$.['_total'][0].['cost'][0].['display']")[0];


        ep.logger.info('CART TOTAL-QUANTITY: ' + cartObj.cartTotalQuantity );
        ep.logger.info('CART SUB TOTAL: ' + cartObj.cartSubTotal );
        return cartObj;
      }
    });

    var cartItemModel = Backbone.Model.extend({

    });
    var cartItemCollection = Backbone.Collection.extend({
      model:cartItemModel
    });



    return {
      CartModel:cartModel,
      CartItemCollection:cartItemCollection,
      CartItemModel:cartItemModel

    };
  }
);
