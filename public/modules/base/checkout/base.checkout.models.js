/**
 * Copyright Elastic Path Software 2013.
 *
 * Storefront - Checkout Models
 */
define(function (require) {
  var ep = require('ep');
  var Backbone = require('backbone');
  var ModelHelper = require('modelHelpers');

  // Array of zoom parameters to pass to Cortex
  var zoomArray = [
    'purchaseform',
    'billingaddressinfo:selector:chosen:description',
    'billingaddressinfo:selector:choice',
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
      return href + '?zoom=' + zoomArray.join();
    },

    parse: function (response) {
      var checkoutObj = {
        summary: {},
        billingAddresses: {}
      };

      if (response) {
        checkoutObj.submitOrderActionLink = jsonPath(response, "$..links[?(@.rel=='submitorderaction')].href")[0];
        checkoutObj.billingAddresses = modelHelpers.parseBillingAddresses(response);
        checkoutObj.summary = modelHelpers.parseCheckoutSummary(response);
      } else {
        ep.logger.error("Checkout model wasn't able to fetch valid data for parsing. ");
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

      // FIXME: replace try/catch with test for response
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
     * If there is no chosen address, we mark the first 'choice' address as being 'chosen',
     * so we have a default billing address to use at checkout.
     *
     * @param response to be parsed
     * @returns Array billing addresses of a user
     */
    parseBillingAddresses: function (response) {
      var billingAddresses = [];

      /**
       * Add a property to identify a billing address as the chosen address.
       * @param address
       */
      var markAsChosenAddress = function(address) {
        return _.extend(address, {chosen: true});
      };

      if (response) {

        var chosenAddress = jsonPath(response, '$.._billingaddressinfo[0].._chosen.._description[0]')[0];
        var choiceAddresses = jsonPath(response, '$.._billingaddressinfo[0].._choice')[0];

        if (chosenAddress) {
          var parsedChosenAddress = modelHelpers.parseAddress(chosenAddress);
   
          markAsChosenAddress(parsedChosenAddress);

          billingAddresses.push(parsedChosenAddress);
        }

        if (choiceAddresses) {
          var numAddresses = choiceAddresses.length;

          for (var i = 0; i < numAddresses; i++) {
            var parsedChoiceAddress =  modelHelpers.parseAddress(choiceAddresses[i]._description[0]);
            var selectActionHref = jsonPath(choiceAddresses[i], '$..links[?(@.rel=="selectaction")].href');

            // Add the Cortex select action to the choice billing address
            if (selectActionHref && selectActionHref[0]) {
              _.extend(parsedChoiceAddress, {selectAction: selectActionHref[0]});
            }

            // If there is no chosen address, designate the first choice address to be chosen
            if (i === 0 && !chosenAddress) {
              markAsChosenAddress(parsedChoiceAddress);
              // Add an identifier to identity this as a default choice address
              _.extend(parsedChoiceAddress, {defaultChoice: true});
            }

            billingAddresses.push(parsedChoiceAddress);
          }
        }
      } else {
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
