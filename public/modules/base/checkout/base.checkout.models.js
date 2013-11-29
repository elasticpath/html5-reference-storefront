/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 */
define(function (require) {
  var ep = require('ep');
  var Backbone = require('backbone');
  var ModelHelper = require('modelHelpers');

  // Array of zoom parameters to pass to Cortex
  var zoomArray = [
    'purchaseform',
    'billingaddressinfo:selector:chosen:description',
    'billingaddressinfo:selector:choice:description',
    'tax',
    'total',
    'cart',
    'cart:total'
  ];

  /**
   * Model containing information necessary for checkout.
   * @type Backbone.Model
   */
  var checkoutModel = Backbone.Model.extend({
    getUrl: function (href) {
      return ep.ui.decodeUri(href) + '?zoom=' + zoomArray.join();
    },

    parse: function (response) {
      var checkoutObj = {
        summary: {},
        billingAddresses: {}
      };

      try{
        checkoutObj.submitOrderActionLink = jsonPath(response, "$..links[?(@.rel=='submitorderaction')].href")[0];
        checkoutObj.summary = modelHelpers.parseCheckoutSummary(response);
        checkoutObj.billingAddresses = modelHelpers.parseBillingAddresses(response);
      }
      catch(error){
        ep.logger.error("chekcout model wasn't able to fetch valid data for parsing. " + error.message);
      }

      return checkoutObj;
    }
  });


  var modelHelpers = ModelHelper.extend({
    /**
     * Parse checkout summary information.
     * @param response to be parsed
     * @returns Object order quantity, subtotal, tax, and total
     */
    parseCheckoutSummary: function (response) {
      var summary = {
        totalQuantity: undefined,
        subTotal: {},
        taxTotal: {},
        taxes: [],
        total: {},
        submitOrderActionLink: undefined
      };

      try {
        summary.totalQuantity = jsonPath(response, '$._cart..total-quantity')[0];
        summary.submitOrderActionLink = jsonPath(response, "$..links[?(@.rel=='submitorderaction')].href")[0];

        var subTotal = jsonPath(response, '$._cart.._total..cost[0]')[0];
        if (subTotal) {
          summary.subTotal = modelHelpers.parsePrice(subTotal);
        }

        var taxTotal = jsonPath(response, '$._tax..total')[0];
        if (taxTotal) {
          summary.taxTotal = modelHelpers.parsePrice(taxTotal);
        }

        var taxes = jsonPath(response, '$._tax..cost')[0];
        if(taxes) {
          summary.taxes = modelHelpers.parseArray(taxes, modelHelpers.parseTax);
        }

        var total = jsonPath(response, '$._total[0].cost[0]')[0];
        if (total) {
          summary.total = modelHelpers.parsePrice(total);
        }
      }
      catch (error) {
        ep.logger.error('Error when parsing checkout summary information: ' + error.message);
      }

      return summary;
    },

    /**
     * Parse all billing addresses the registered user can use for checkout.
     * The first address in the returned array will be the chosen address.
     *
     * @param response to be parsed
     * @returns Array billing addresses of a user
     */
    parseBillingAddresses: function (response) {
      var billingAddresses = [];

      try {
        var chosenAddress = jsonPath(response, '$.._billingaddressinfo[0].._chosen.._description[0]')[0];
        var choiceAddresses = jsonPath(response, '$.._billingaddressinfo[0].._choice.._description');

        if (chosenAddress) {
          billingAddresses.push(modelHelpers.parseAddress(chosenAddress));
        }

        if (choiceAddresses) {
          var numAddresses = choiceAddresses.length;

          for (var i = 0; i < numAddresses; i++) {
            var currObj = choiceAddresses[i];
            billingAddresses.push(
              modelHelpers.parseAddress(currObj[0])
            );
          }
        }
      }
      catch (error) {
        ep.logger.error('Error when building billing addresses object: ' + error.message);
      }

      return billingAddresses;
    }

  });

  return {
    CheckoutModel: checkoutModel,
    testVariable: {
      modelHelpers: modelHelpers
    }
  };
});
