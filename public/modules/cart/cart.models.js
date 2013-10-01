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
      url: ep.app.config.cortexApi.path + '/carts/' + ep.app.config.cortexApi.scope + '/default?zoom=total,' +
        'lineitems:element,lineitems:element:price,lineitems:element:rate,lineitems:element:availability,' +
        'lineitems:element:item,lineitems:element:item:definition,lineitems:element:item:definition:assets:element,lineitems:element:item:price,lineitems:element:item:rate,' +
        'order:purchaseform',
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
          var defaultImgObj = jsonPath(currObj, '$._item.._definition.._assets.._element[?(@.name="default-image")]')[0];
          lineItemObj.thumbnail = parseDefaultImg(defaultImgObj);

          /*
           * item display name
           */
          lineItemObj.displayName = jsonPath(currObj, '$._item.._definition..display-name')[0];
          lineItemObj.itemUri = jsonPath(currObj, '$._item..self.uri')[0];

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
        var confirmationObj = {};
        // Order Status
        confirmationObj.status = response.status;
        // Oder Number
        confirmationObj.purchaseNumber = response['purchase-number'];
        // Order Total
        confirmationObj.orderTotal = jsonPath(response, '$.monetary-total[0].display')[0];
        // Purchase Date
        confirmationObj.purchaseDate = jsonPath(response, '$.purchase-date.display-value')[0];
        // Tax Total
        confirmationObj.taxTotal = jsonPath(response, '$.tax-total.display');

        // Line Items
        confirmationObj.lineItems = [];
        var lineItems = jsonPath(response, '$._lineitems.._element')[0];
        if (lineItems){
          for (var i = 0;i < lineItems.length;i++){
            var lineItemObj = {};
            var lineItemRef = lineItems[i];
            // name
            if(lineItemRef.name){
              lineItemObj.name = lineItemRef.name;
            }
            // quantity
            if(lineItemRef.quantity){
              lineItemObj.quantity = lineItemRef.quantity;
            }


            // Line Item Rate / Price
            lineItemObj.amount = {};
            lineItemObj.tax = {};
            lineItemObj.total = {};
            // check if subscription or one-time item
            if(lineItemRef._rate && lineItemRef._rate[0]){
              // rate may have multiple items in array
//              var tempRateValue = lineItemRef._rate[0].rate;

              if (lineItemRef._rate[0].rate && lineItemRef._rate[0].rate[0]){
                lineItemObj.total.display = lineItemRef._rate[0].rate[0].display;
              }
            }
            // non subscription item
            else{
              // item total
              if (lineItemRef['line-extension-total']){
                var lineTotalObj = {};
                lineItemObj.total.display = lineItemRef['line-extension-total'][0].display || null;
                lineItemObj.total.cost = lineItemRef['line-extension-total'][0];
              //  lineItemObj.total.total.push(lineTotalObj);
              }
              // tax
              if (lineItemRef['line-extension-tax']){
                lineItemObj.tax.display = lineItemRef['line-extension-tax'][0].display || null;
                lineItemObj.tax.currency = lineItemRef['line-extension-tax'][0].currency || null;
                lineItemObj.tax.amount = lineItemRef['line-extension-tax'][0].amount || null;
              }
              // item net amount
              if (lineItemRef['line-extension-amount']){
                lineItemObj.amount.display = lineItemRef['line-extension-amount'][0].display || null;
                lineItemObj.amount.currency = lineItemRef['line-extension-amount'][0].currency || null;
                lineItemObj.amount.amount = lineItemRef['line-extension-amount'][0].amount || null;
              }
            }
            confirmationObj.lineItems.push(lineItemObj);
          }
        }

        // Billing Address
        confirmationObj.billingAddress = {};
        if (jsonPath(response, '$._billingaddress')){
          var rawBillingAddress = jsonPath(response, '$._billingaddress[0]')[0];
//          if ()
          var firstName = rawBillingAddress.name['given-name'] || null;
          var lastName = rawBillingAddress.name['family-name'] || null;
          confirmationObj.billingAddress.name = firstName + ' ' + lastName;
          confirmationObj.billingAddress.country = rawBillingAddress.address['country-name'] || null;
          confirmationObj.billingAddress.streetAddress = rawBillingAddress.address['street-address'] || null;
          confirmationObj.billingAddress.extendedAddress = rawBillingAddress.address['extended-address'] || null;
          confirmationObj.billingAddress.locality = rawBillingAddress.address.locality || null;
          confirmationObj.billingAddress.postalCode = rawBillingAddress.address['postal-code'] || null;
          confirmationObj.billingAddress.region = rawBillingAddress.address.region || null;
        }


        // Payment Method
        // TBD

        return confirmationObj;
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
    }

    return {
      CartModel:cartModel,
      CartItemCollection:cartItemCollection,
      CartItemModel:cartItemModel,
      PurchaseConfirmationModel:purchaseConfirmationModel
    };
  }
);
