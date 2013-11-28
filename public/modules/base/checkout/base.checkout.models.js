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
      var checkoutObj = {};

      checkoutObj.submitOrderActionLink = jsonPath(response, "$..links[?(@.rel=='submitorderaction')].href")[0];
      checkoutObj.summary = modelHelper.parseCheckoutSummary(response);
      checkoutObj.billingAddresses = modelHelper.parseBillingAddresses(response);

      return checkoutObj;
    }
  });


  var modelHelper = ModelHelper.extend({
    /**
     * Parse checkout summary information.
     * @param response to be parsed
     * @returns Object order quantity, subtotal, tax, and total
     */
    parseCheckoutSummary: function (response) {
      var summary = {
        totalQuantity: undefined,
        subTotal: {},
        tax: {},
        total: {}
      };

      try {
        summary.totalQuantity = jsonPath(response, '$._cart..total-quantity')[0];

        var subTotal = jsonPath(response, '$._cart.._total..cost[0]')[0];
        if (subTotal) {
          summary.subTotal = modelHelper.parsePrice(subTotal);
        }

        var tax = jsonPath(response, '$._tax..total')[0];
        if (tax) {
          summary.tax = modelHelper.parsePrice(tax);
        }

        var total = jsonPath(response, '$._total[0].cost[0]')[0];
        if (total) {
          summary.total = modelHelper.parsePrice(total);
        }
      }
      catch (error) {
        ep.logger.error('Error when parsing checkout summary information: ' + error.message);
      }

      return summary;
    },

    /**
     * Parse all billing addresses the registered user can use for checkout.
     * Currently only parses the chosen billing address
     *
     * @param response to be parsed
     * @returns Object billing addresses of a user
     */
    parseBillingAddresses: function (response) {
      var billingAddresses = {
        chosenBillingAddress: undefined
      };

      try {
        var chosenAddress = jsonPath(response, '$.._billingaddressinfo[0].._chosen.._description[0]')[0];
        if (chosenAddress) {
          billingAddresses.chosenBillingAddress = modelHelper.parseAddress(chosenAddress);
          // flag this address as selected
//          billingAddresses.chosenBillingAddress.chosen = true;
        }
      }
      catch (error) {
        ep.logger.error('Error when building billing addresses object: ' + error.message);
      }

      return billingAddresses;
    }

  });

  return {
    CheckoutModel: checkoutModel
  };
});
