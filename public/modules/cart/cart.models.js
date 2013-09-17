/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 */
define(['ep', 'eventbus', 'backbone'],
  function (ep, EventBus, Backbone) {


    // Cart Model
    var cartModel = Backbone.Model.extend({
      url: ep.app.config.cortexApi.path + '/carts/' + ep.app.config.cortexApi.scope + '/default?zoom=total,lineitems:element,lineitems:element:price,lineitems:element:availability,lineitems:element:item,lineitems:element:item:definition,lineitems:element:item:definition:assets:element,lineitems:element:item:price,order:purchaseform',
      parse: function (cart) {

        var cartObj = {};

        /*
         * Cart-lineitems
         */
        var lineItemsArray = [];
        var lineItemArrayLen = 0;
        var lineItemsRoot = jsonPath(cart, '$._lineitems.._element')[0];

        if (lineItemsRoot) {
          lineItemArrayLen = lineItemsRoot.length;
        }

        // Iterate over Lineitems
        for (var x = 0; x < lineItemArrayLen; x++) {
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
              name: defaultImg['name'],
              absolutePath: defaultImg['content-location'],
              relativePath: defaultImg['relative-location']
            }
          }

          /*
           * item display name
           */
          lineItemObj.displayName = jsonPath(currObj, '$._item.._definition..display-name')[0];
          lineItemObj.itemUri = jsonPath(currObj, '$._item..self.uri')[0];

          /*
           * availability
           */
          lineItemObj.availability = {};
          lineItemObj.availability.state = jsonPath(currObj, '$._availability..state')[0];

          lineItemObj.availability.releaseDate = {};
          var lineItemReleaseDate = jsonPath(currObj, '$._availability..release-date')[0];
          if (lineItemReleaseDate) {
            lineItemObj.availability.releaseDate = {
              displayValue: lineItemReleaseDate['display-value'],
              value: lineItemReleaseDate['value']
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

          var itemUnitListPrice = jsonPath(currObj, '$._item.._price..list-price')[0];
          var itemUnitPurchasePrice = jsonPath(currObj, '$._item.._price..purchase-price')[0];
          if (itemUnitListPrice) {
            lineItemObj.unitPrice.listed = {
              currency: itemUnitListPrice[0].currency,
              amount: itemUnitListPrice[0].amount,
              display: itemUnitListPrice[0].display
            }
          }

          if (itemUnitPurchasePrice) {
            lineItemObj.unitPrice.purchase = {
              currency: itemUnitPurchasePrice[0].currency,
              amount: itemUnitPurchasePrice[0].amount,
              display: itemUnitPurchasePrice[0].display
            }
          }

          /*
           * item-total (list price & purchase price)
           */
          lineItemObj.price = {};
          lineItemObj.price.listed = {};
          lineItemObj.price.purchase = {};

          var lineItemListPrice = jsonPath(currObj, '$._price..list-price')[0];
          var lineItemPurchasePrice = jsonPath(currObj, '$._price..purchase-price')[0];

          if (lineItemListPrice) {
            lineItemObj.price.listed = {
              currency: lineItemListPrice[0].currency,
              amount: lineItemListPrice[0].amount,
              display: lineItemListPrice[0].display
            }
          }

          if (lineItemPurchasePrice) {
            lineItemObj.price.purchase = {
              currency: lineItemPurchasePrice[0].currency,
              amount: lineItemPurchasePrice[0].amount,
              display: lineItemPurchasePrice[0].display
            }
          }

          /*
           * LineItem Uri (for remove lineitem button)
           */
          lineItemObj.lineitemUri = currObj.self.uri;

          lineItemsArray.push(lineItemObj);
        }
        cartObj.lineItems = lineItemsArray;

        /*
        * Cart Submit Order Action
        * */
        cartObj.submitOrderActionUri = jsonPath(cart, "$..links[?(@.rel=='submitorderaction')].uri");


        /*
         * Cart Summary: total quantity
         */
        cartObj.cartTotalQuantity = jsonPath(cart, '$.total-quantity')[0];

        /*
         * Cart Summary: total price (excluding tax)
         */
        var cartTotal = jsonPath(cart, '$._total..cost[0]')[0];
        cartObj.cartTotal = {
          currency: cartTotal.currency,
          amount: cartTotal.amount,
          display: cartTotal.display
        };

        return cartObj;
      }
    });

    var cartItemModel = Backbone.Model.extend();
    var cartItemCollection = Backbone.Collection.extend({
      model: cartItemModel,
      parse: function (collection) {
        return collection;
      }
    });

    var purchaseConfirmationModel = Backbone.Model.extend({
      parse:function(response){
        var retVal = {};
        retVal.status = response.status;
        retVal.purchaseNumber = response['purchase-number'];

        return retVal;
      }
    });


    return {
      CartModel:cartModel,
      CartItemCollection:cartItemCollection,
      CartItemModel:cartItemModel,
      PurchaseConfirmationModel:purchaseConfirmationModel
    };
  }
);
