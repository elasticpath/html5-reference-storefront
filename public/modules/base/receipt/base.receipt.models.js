/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 *
 */
define(['underscore', 'ep', 'eventbus', 'backbone', 'modelHelpers'],
  function (_, ep, EventBus, Backbone, modelHelper) {

    var purchaseConfirmationModel = Backbone.Model.extend({
      parse: function (response) {
        var confirmationObj = {};

        var summary = parseHelpers.parseConfirmationSummary(response);
        // attach summary object's properties to confirmationObj
        // without override existing properties of confirmationObj
        _.extend(confirmationObj, summary);

        // Line Items
        var lineItems = jsonPath(response, '$._lineitems.._element')[0];
        confirmationObj.lineItems = parseHelpers.parseArray(lineItems, parseHelpers.parseReceiptLineItem);

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

    var parseHelpers = modelHelper.extend({
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
            var lineItemRates = parseHelpers.parseArray(ratesArray, parseHelpers.parseRate);
            // but currently cortex only supports 1 rate, so we will take the first 1

            if (lineItemRates.length > 0) {
              lineItemObj.total = lineItemRates[0];
            }
          }
          // non subscription item
          else {
            lineItemObj.amount = parseHelpers.parsePrice(jsonPath(rawObject, '$.line-extension-amount[0]')[0]);
            lineItemObj.tax = parseHelpers.parsePrice(jsonPath(rawObject, '$.line-extension-tax[0]')[0]);
            lineItemObj.total = parseHelpers.parsePrice(jsonPath(rawObject, '$.line-extension-total[0]')[0]);
          }
        }
        catch (error) {
          ep.logger.error('Error building purchase confirmation lineItem object: ' + error.message);
        }

        return lineItemObj;
      }
    });

    return {
      PurchaseConfirmationModel: purchaseConfirmationModel

    };
  }
);
