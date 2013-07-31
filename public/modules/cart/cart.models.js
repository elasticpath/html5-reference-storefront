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
         * Cart-lineitems
         */
        var lineItemsArray = [];
        var lineItemsRoot = jsonPath(cart, "$.['_lineitems'][0]['_element']")[0];

        if (lineItemsRoot) {
          var lineItemArrayLen = lineItemsRoot.length;
          for (var x = 0; x < lineItemArrayLen; x++){
            var currObj = lineItemsRoot[x];
            var lineItemObj = {};

            /*
             * quantity
             */
            lineItemObj.quantity = currObj['quantity'];

            /*
             * availability
             */
            lineItemObj.availability = currObj['_availability'][0]['state'];

            /*
             * item-toal (list price & purchase price)
             */
            lineItemObj.price = {};


            lineItemsArray.push(lineItemObj);
          }
        }
        cartObj.lineItem = lineItemsArray;


        /*
         * Cart Summary: total quantity
         */
        cartObj.cartTotalQuantity = jsonPath(cart, "$.['total-quantity']")[0];

        /*
         *    total price (excluding tax)
         */
        var cartSubTotal = jsonPath(cart, "$.['_total'][0].['cost'][0]")[0];
        cartObj.cartSubTotal = {
          currency:cartSubTotal.currency,
          amount:cartSubTotal.amount,
          display:cartSubTotal.display
        }

        ep.logger.info('CART SUB TOTAL: ' + cartObj.cartSubTotal.display );
        return cartObj;
      }
    });

    var cartItemModel = Backbone.Model.extend();
    var cartItemCollection = Backbone.Collection.extend({
      model:cartItemModel,
      parse:function(collection){
        return collection;
      }
    });



    return {
      CartModel:cartModel,
      CartItemCollection:cartItemCollection,
      CartItemModel:cartItemModel

    };
  }
);
