/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 * Default PurchaseInfo Models
 * The HTML5 Reference Storefront's MVC Model manages zoom queries the model uses to ask cortex server.
 * It also parses the raw data returned from server, so necessary data are surfaced, and renamed into desired format.
 */
define(function (require) {
  var ep = require('ep');
  var Backbone = require('backbone');
  var modelHelper = require('modelHelpers');

    // Array of zoom parameters to pass to Cortex
    var zoomArray = [
      'billingaddress',
      'paymentmeans:element',
      'lineitems:element',
      'lineitems:element:rate'
    ];

    /**
     * Model containing information of a purchase.
     * @type Backbone.Model
     */
    var purchaseInfoModel = Backbone.Model.extend({
      getUrl: function (href) {
        return ep.ui.decodeUri(href) + '?zoom=' + zoomArray.join();
      },
      parse: function (response) {
        var purchaseInfoObj = {};

        var summary = parseHelpers.parseInfoSummary(response);
        // attach summary object's properties to purchaseInfoObj
        // without override existing properties of purchaseInfoObj
        _.extend(purchaseInfoObj, summary);

        // Line Items
        var lineItems = jsonPath(response, '$._lineitems.._element')[0];
        purchaseInfoObj.lineItems = parseHelpers.parseArray(lineItems, parseHelpers.parsePurchaseLineItem);

        // Billing Address
        var addressObj = jsonPath(response, '$._billingaddress[0]')[0];
        purchaseInfoObj.billingAddress = parseHelpers.parseAddress(addressObj);

        // Payment Means
        purchaseInfoObj.paymentMeans = {};
        var paymentDisplay = jsonPath(response, '$._paymentmeans[0].._element[0]')[0];
        if (paymentDisplay) {
          purchaseInfoObj.paymentMeans.displayValue = jsonPath(paymentDisplay, '$.display-value');
        }

        return purchaseInfoObj;
      }
    });

    var parseHelpers = modelHelper.extend({
      /**
       * Parses summary information of the purchase record: number, date, total, and status.
       * @param rawObject raw JSON object
       * @returns Object  parsed purchase summary information
       */
      parseInfoSummary: function (rawObject) {
        var purchaseSummary = {};

        try {
          purchaseSummary = {
            status: jsonPath(rawObject, '$.status')[0],
            purchaseNumber: jsonPath(rawObject, '$.purchase-number')[0],  // Oder Number
            orderTotal: jsonPath(rawObject, '$.monetary-total..display')[0],
            purchaseDate: jsonPath(rawObject, '$.purchase-date.display-value')[0],
            taxTotal: jsonPath(rawObject, '$.tax-total.display')[0]
          };

        }
        catch (error) {
          ep.logger.error('Error building purchase summary object: ' + error.message);
        }

        return purchaseSummary;
      },

      /**
       * Parses a lineItem information required for purchase record display.
       * @param rawObject raw JSON object
       * @returns Object  parsed purchase lineItem
       */
      parsePurchaseLineItem: function (rawObject) {
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
          ep.logger.error('Error building purchase lineItem object: ' + error.message);
        }

        return lineItemObj;
      }
    });

    return {
      PurchaseInfoModel: purchaseInfoModel

    };
  }
);
