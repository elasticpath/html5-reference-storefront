/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 */
define(['underscore', 'ep', 'eventbus', 'backbone'],
  function (_, ep, EventBus, Backbone) {

    var purchaseConfirmationModel = Backbone.Model.extend({
      parse: function (response) {
        var confirmationObj = {};

        var summary = parseHelpers.parseConfirmationSummary(response);
        // attach summary object's properties to confirmationObj
        // without override existing properties of confirmationObj
        _.extend(confirmationObj, summary);

        // Line Items
        var lineItems = jsonPath(response, '$._lineitems.._element')[0];
        confirmationObj.lineItems = parseHelpers.parseArray(lineItems, 'parseReceiptLineItem');

        // Billing Address
        var addressObj = jsonPath(response, '$._billingaddress[0]')[0];
        confirmationObj.billingAddress = parseHelpers.parseAddress(addressObj);

        // Payment Means
        confirmationObj.paymentMeans = {};
        var paymentDisplay = jsonPath(response, '$._paymentmeans[0].._element[0]')[0];
        if (paymentDisplay) {
          confirmationObj.paymentMeans.displayValue = jsonPath(paymentDisplay, '$.display-value');
        }

        return confirmationObj;
      }
    });

    var parseHelpers = {
      parseArray: function (rawArray, parseFunctionName) {
        var parsedArray = [];
        var arrayLength = 0;

        if (rawArray) {
          arrayLength = rawArray.length;
        }

        for (var i = 0; i < arrayLength; i++) {
          // invoke parse function specified by 'parseFunctionName'
          var parsedObject = this[parseFunctionName](rawArray[i]);
          parsedArray.push(parsedObject);
        }

        return parsedArray;
      },
      parseAddress: function (rawObject) {
        var address = {};

        try {
          address = {
            givenName: jsonPath(rawObject, '$.name..given-name')[0],
            familyName: jsonPath(rawObject, '$.name..family-name')[0],
            streetAddress: jsonPath(rawObject, '$.address..street-address')[0],
            extendedAddress: jsonPath(rawObject, '$.address..extended-address')[0],
            city: jsonPath(rawObject, '$.address..locality')[0],
            region: jsonPath(rawObject, '$.address..region')[0],
            country: jsonPath(rawObject, '$.address..country-name')[0],
            postalCode: jsonPath(rawObject, '$.address..postal-code')[0]
          };
        }
        catch (error) {
          ep.logger.error('Error building address object: ' + error.message);
        }

        return address;
      },
      parseConfirmationSummary: function (rawObject) {
        var confirmationSummary = {};

        try {
          confirmationSummary = {
            status: jsonPath(rawObject, '$.status')[0],
            purchaseNumber: jsonPath(rawObject, '$.purchase-number')[0],  // Oder Number
            orderTotal: jsonPath(rawObject, '$.monetary-total..display')[0],
            purchaseDate: jsonPath(rawObject, '$.purchase-date.display-value')[0],
            taxTotal: jsonPath(rawObject, '$.tax-total.display')[0]
          };

        }
        catch (error) {
          ep.logger.error('Error building purchase confirmation summary object: ' + error.message);
        }

        return confirmationSummary;
      },
      parseReceiptLineItem: function (rawObject) {
        var lineItemObj = {};

        try {
          lineItemObj.name = jsonPath(rawObject, '$.name')[0];
          lineItemObj.quantity = jsonPath(rawObject, '$.quantity')[0];

          // Line Item Rate / Price
          lineItemObj.amount = {};
          lineItemObj.tax = {};
          lineItemObj.total = {};

          // check if subscription or one-time item
          var ratesArray = jsonPath(rawObject, '$._rate..rate')[0];
          if (ratesArray) {
            // rate may have multiple items in array
            var lineItemRates = this.parseArray(ratesArray, 'parseRate')
            // but currently cortex only supports 1 rate, so we will take the first 1

            if (lineItemRates.length > 0) {
              lineItemObj.total = lineItemRates[0];
            }
          }
          // non subscription item
          else {
            lineItemObj.amount = this.parsePrice(jsonPath(rawObject, '$.line-extension-amount[0]')[0]);
            lineItemObj.tax = this.parsePrice(jsonPath(rawObject, '$.line-extension-tax[0]')[0]);
            lineItemObj.total = this.parsePrice(jsonPath(rawObject, '$.line-extension-total[0]')[0]);
          }
        }
        catch (error) {
          ep.logger.error('Error building purchase confirmation lineItem object: ' + error.message);
        }

        return lineItemObj;
      },
    parseRate: function(rawObject) {
      var rate = {};
      try {
        rate.display = rawObject.display;
        rate.cost = {
          amount: jsonPath(rawObject, '$.cost..amount')[0],
          currency: jsonPath(rawObject, '$.cost..currency')[0],
          display: jsonPath(rawObject, '$.cost..display')[0]
        }

        rate.recurrence = {
          interval: jsonPath(rawObject, '$.recurrence..interval')[0],
          display: jsonPath(rawObject, '$.recurrence..display')[0]
        }
      }
      catch (error) {
        ep.logger.error('Error building rate object: ' + error.message);
      }

        return rate;
      },
      parsePrice: function(rawObject) {
        var price = {};

        try {
          price = {
            currency: jsonPath(rawObject, '$.currency')[0],
            amount: jsonPath(rawObject, '$.amount')[0],
            display: jsonPath(rawObject, '$.display')[0]
          }
        }
        catch (error) {
          ep.logger.error('Error building price object: ' + error.message);
        }

        return price;
      }
    };

    return {
      PurchaseConfirmationModel: purchaseConfirmationModel

    };
  }
);
