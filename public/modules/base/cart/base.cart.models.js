/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 *
 */
define(['ep', 'eventbus', 'backbone'],
  function (ep, EventBus, Backbone) {

    // Array of zoom parameters to pass to Cortex
    var zoomArray = [
      'total',
      'lineitems:element',
      'lineitems:element:price',
      'lineitems:element:rate',
      'lineitems:element:availability',
      'lineitems:element:item',
      'lineitems:element:item:definition',
      'lineitems:element:item:definition:assets:element',
      'lineitems:element:item:price',
      'lineitems:element:item:rate',
      'order',
      'order:purchaseform'
    ];

    // Cart Model
    var cartModel = Backbone.Model.extend({
      url: ep.io.getApiContext() +
            '/carts/' +
            ep.app.config.cortexApi.scope +
            '/default?zoom=' +
            zoomArray.join(),

      parse: function (response) {

        var cartObj = {};

        /*
         * Cart-lineitems
         */
        var lineItemsArray = [];
        var lineItemArrayLen = 0;
        var lineItemsRoot = jsonPath(response, '$._lineitems.._element')[0];

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
          var defaultImgObj = jsonPath(currObj, '$._item.._definition.._assets.._element[?(@.name="default-image")]')[0];
          lineItemObj.thumbnail = parseDefaultImg(defaultImgObj);

          /*
           * item display name
           */
          lineItemObj.displayName = jsonPath(currObj, '$._item.._definition..display-name')[0];
          lineItemObj.itemLink = jsonPath(currObj, '$._item..self.href')[0];

          /*
           * availability
           */
          var availabilityObj = jsonPath(currObj, '$._availability')[0];
          lineItemObj.availability = parseAvailability(availabilityObj);

          /*
           * quantity
           */
          lineItemObj.quantity = currObj['quantity'];

          /*
           * item unit price
           */
          lineItemObj.unitPrice = {};

          var itemUnitListPrice = jsonPath(currObj, '$._item.._price..list-price')[0];
          lineItemObj.unitPrice.listed = parsePrice(itemUnitListPrice);

          var itemUnitPurchasePrice = jsonPath(currObj, '$._item.._price..purchase-price')[0];
          lineItemObj.unitPrice.purchase = parsePrice(itemUnitPurchasePrice);

          /*
           * item-total (list price & purchase price)
           */
          lineItemObj.price = {};

          var lineItemListPrice = jsonPath(currObj, '$._price..list-price')[0];
          lineItemObj.price.listed = parsePrice(lineItemListPrice);

          var lineItemPurchasePrice = jsonPath(currObj, '$._price..purchase-price')[0];
          lineItemObj.price.purchase = parsePrice(lineItemPurchasePrice);

          /*
           * Rates
           */
          // Item unit rates
          var itemRates = jsonPath(currObj, '$._item.._rate..rate')[0];
          lineItemObj.unitRateCollection = parseRates(itemRates);

          // LineItem rates
          var lineItemRates = jsonPath(currObj, '$._rate..rate')[0];
          lineItemObj.rateCollection = parseRates(lineItemRates);

          // fake a price object when neither rate nor price present
          if (!lineItemPurchasePrice && lineItemObj.rateCollection.length == 0) {
            lineItemObj.price.purchase = {
              display: 'none'
            };

            lineItemObj.unitPrice.purchase = {
              display: 'none'
            };
          }

          /*
           * LineItem Link (for remove lineitem button)
           */
          lineItemObj.lineitemLink = currObj.self.href;

          lineItemsArray.push(lineItemObj);
        }
        cartObj.lineItems = lineItemsArray;


        /*
         * Cart Summary: total quantity
         */
        cartObj.cartTotalQuantity = jsonPath(response, '$.total-quantity')[0];

        /*
         * Cart Summary: total price (excluding tax)
         */
        cartObj.cartTotal = {};
        var cartTotal = jsonPath(response, '$._total..cost[0]');
        if (cartTotal) {
          cartObj.cartTotal = parsePrice(cartTotal);
        }


        /*
         * Cart Submit Order Action
         * */
        cartObj.submitOrderActionLink = jsonPath(response, "$..links[?(@.rel=='submitorderaction')].href")[0];

        cartObj.checkoutLink = jsonPath(response, '$.._order[0].self.href')[0];

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




    // function to parse default image
    var parseDefaultImg = function(imgObj) {
      var defaultImg = {};

      if (imgObj) {
        defaultImg = {
          absolutePath: imgObj['content-location'],
          relativePath: imgObj['relative-location'],
          name: imgObj['name']
        };
      }

      return defaultImg;
    };

    // function to parse availability (states and release-date)
    var parseAvailability = function(availabilityObj) {
      var availability = {};

      if (availabilityObj) {
        availability.state = jsonPath(availabilityObj, '$..state')[0];
        var releaseDate = jsonPath(availabilityObj, '$..release-date')[0];
        if (releaseDate) {
          availability.releaseDate = {
            displayValue: releaseDate['display-value'],
            value: releaseDate['value']
          };
        }
      }

      return availability;
    };

    // function to parse one-time price (list or purchase)
    var parsePrice = function(priceObj) {
      var price = {};

      if (priceObj) {
        price = {
          currency: priceObj[0].currency,
          amount: priceObj[0].amount,
          display: priceObj[0].display
        }
      }

      return price;
    };

    // function to parse rates collection
    var parseRates = function(rates) {
      var ratesArrayLen = 0;
      var rateCollection = [];

      if (rates) {
        ratesArrayLen = rates.length;
      }

      for (var i = 0; i < ratesArrayLen; i++) {
        var rateObj = {};

        rateObj.display = rates[i].display;
        rateObj.cost = {
          amount: jsonPath(rates[i], '$.cost..amount')[0],
          currency: jsonPath(rates[i], '$.cost..currency')[0],
          display: jsonPath(rates[i], '$.cost..display')[0]
        }

        rateObj.recurrence = {
          interval: jsonPath(rates[i], '$.recurrence..interval')[0],
          display: jsonPath(rates[i], '$.recurrence..display')[0]
        }

        rateCollection.push(rateObj);
      }

      return rateCollection;
    };

    return {
      CartModel:cartModel,
      CartItemCollection:cartItemCollection,
      CartItemModel:cartItemModel
    };
  }
);
