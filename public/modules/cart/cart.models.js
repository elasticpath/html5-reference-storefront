/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 */
define(['ep','eventbus', 'backbone'],
  function(ep, EventBus, Backbone){


    // Cart Model
    var cartModel = Backbone.Model.extend({
      url:ep.app.config.cortexApi.path + '/carts/' + ep.app.config.cortexApi.scope + '/default/?zoom=total,lineitems:element,lineitems:element:price,lineitems:element:availability,lineitems:element:item:definition,lineitems:element:item:definition:assets:element,lineitems:element:item:price,order:purchaseform',
      parse:function(cart){

        var cartObj = {};

        /*
         * Cart-lineitems
         */
        var lineItemsArray = [];
        var lineItemArrayLen = 0;
        var lineItemsRoot = jsonPath(cart, "$.['_lineitems'][0]['_element']")[0];

        if (lineItemsRoot) {
          lineItemArrayLen = lineItemsRoot.length;
        }

        // Iterate over Lineitems
        for (var x = 0; x < lineItemArrayLen; x++){
          var currObj = lineItemsRoot[x];
          var lineItemObj = {};

          /*
           * item default image thumbnail
           */
          lineItemObj.thumbnail = {};
          var assetsArray = jsonPath(currObj, "$._item.._definition.._assets.._element")[0];
          if (assetsArray) {
            var defaultImg = jsonPath(assetsArray, "$.[?(@.name='default-image')]")[0];
            lineItemObj.thumbnail = {
              name:defaultImg['name'],
              contentLocation:defaultImg['content-location'],
              relativeLocation:defaultImg['relative-location']
            }
          }

          /*
           * item display name
           */
          lineItemObj.displayName = currObj['_item'][0]['_definition'][0]['display-name'];
          var itemUri = currObj['_item'][0]['_definition'][0].self.uri;
          lineItemObj.itemDefinitionUri = itemUri;

          /*
           * availability
           */
          lineItemObj.availability = {};
          lineItemObj.availability.state = currObj['_availability'][0]['state'];

          lineItemObj.availability.releaseDate = {};
          var lineItemReleaseDate = currObj['_availability'][0]['release-date'];
          if (lineItemReleaseDate) {
            lineItemObj.availability.releaseDate = {
              displayValue:lineItemReleaseDate['display-value'],
              value:lineItemReleaseDate['value']
            }
          }

          /*
           * quantity
           */
          lineItemObj.quantity = currObj['quantity'];

          /*
           * item unit price
           */
          lineItemObj.unitPrice = {};
          lineItemObj.unitPrice.listed = {};
          lineItemObj.unitPrice.purchase = {};

          var itemUnitListPrice = currObj['_item'][0]['_price'][0]['list-price'];
          var itemUnitPurchasePrice = currObj['_item'][0]['_price'][0]['purchase-price'];
          if (itemUnitListPrice) {
            lineItemObj.unitPrice.listed = {
              currency:itemUnitListPrice[0].currency,
              amount:itemUnitListPrice[0].amount,
              display:itemUnitListPrice[0].display
            }
          }

          if (itemUnitPurchasePrice) {
            lineItemObj.unitPrice.purchase = {
              currency:itemUnitPurchasePrice[0].currency,
              amount:itemUnitPurchasePrice[0].amount,
              display:itemUnitPurchasePrice[0].display
            }
          }

          /*
           * item-total (list price & purchase price)
           */
          lineItemObj.price = {};
          lineItemObj.price.listed = {};
          lineItemObj.price.purchase = {};

          var lineItemListPrice = currObj['_price'][0]['list-price'];
          var lineItemPurchasePrice = currObj['_price'][0]['purchase-price'];

          if (lineItemListPrice) {
            lineItemObj.price.listed = {
              currency:lineItemListPrice[0].currency,
              amount:lineItemListPrice[0].amount,
              display:lineItemListPrice[0].display
            }
          }

          if (lineItemPurchasePrice) {
            lineItemObj.price.purchase = {
              currency:lineItemPurchasePrice[0].currency,
              amount:lineItemPurchasePrice[0].amount,
              display:lineItemPurchasePrice[0].display
            }
          }

          /*
           * LineItem Uri (for remove lineitem button)
           */
          lineItemObj.lineitemUri = currObj['self']['uri'];

          lineItemsArray.push(lineItemObj);
        }
        cartObj.lineItems = lineItemsArray;

        /*
        * Cart Submit Order Action
        * */
        //cartObj.submitOrderActionUri = jsonPath(cart, "$.['_purchaseform'][0][links][0].uri")[0];
        cartObj.submitOrderActionUri = jsonPath(cart, "$..links[?(@.rel=='submitorderaction')].uri");
//        $..book[?(@.price<10)]


        /*
         * Cart Summary: total quantity
         */
        cartObj.cartTotalQuantity = jsonPath(cart, "$.['total-quantity']")[0];

        /*
         * Cart Summary: total price (excluding tax)
         */
        var cartTotal = jsonPath(cart, "$.['_total'][0].['cost'][0]")[0];
        cartObj.cartTotal = {
          currency:cartTotal.currency,
          amount:cartTotal.amount,
          display:cartTotal.display
        };

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

    var purchaseConfirmationModel = Backbone.Model.extend();



    return {
      CartModel:cartModel,
      CartItemCollection:cartItemCollection,
      CartItemModel:cartItemModel,
      PurchaseConfirmationModel:purchaseConfirmationModel

    };
  }
);
