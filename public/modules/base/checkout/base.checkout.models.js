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
        billingAddresses: []
      };

      if (response) {
        checkoutObj.submitOrderActionLink = jsonPath(response, "$..links[?(@.rel=='submitorderaction')].href")[0];

        var parsedBillingAddresses = modelHelpers.parseBillingAddresses(response);

        if (parsedBillingAddresses.length) {
          // Sort the parsed addresses alphabetically by the streetAddress property
          checkoutObj.billingAddresses = modelHelpers.sortAddresses(parsedBillingAddresses, "streetAddress");

          /**
           * If there is no chosen billing address defined, designate the first address object in the ordered
           * array to be the chosen address by giving it a 'setAsDefaultChoice' attribute (this will trigger
           * an update POST to Cortex in the checkout controller code).
           */
          if (!modelHelpers.isChosenAddressDefined(checkoutObj.billingAddresses)) {
            _.extend(checkoutObj.billingAddresses[0], { setAsDefaultChoice: true });
          }
        }

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
     * @param response The response to be parsed
     * @returns {Object} Order quantity, subtotal, taxes, and total
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

      if (response) {
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

      return summary;
    },

    /**
     * Parse all billing addresses the registered user can use for checkout.
     * The first address in the returned array will be the chosen address.
     * If there is no chosen address, we mark the first 'choice' address as being 'chosen',
     * so we have a default billing address to use at checkout.
     *
     * @param response The response to be parsed
     * @returns {Array} Billing addresses of a user
     */
    parseBillingAddresses: function (response) {
      var billingAddresses = [];

      /**
       * Add a property to identify a billing address as the chosen address.
       * @param {Object} address
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

            billingAddresses.push(parsedChoiceAddress);
          }
        }
      } else {
        ep.logger.error('Error when building billing addresses object: ' + error.message);
      }

      return billingAddresses;
    },

    /**
     * Boolean function that searches an array of address objects looking for a 'chosen' property.
     * @param {Array} addressesArray Array of address objects
     * @returns {boolean}
     */
    isChosenAddressDefined: function(addressesArray) {
      var chosenAddress = _.find(addressesArray, function(address) {
        return address.chosen;
      });
      return chosenAddress ? true : false;
    },

    /**
     * Performs a case-insensitive sort of a given address array alphabetically by a given address property.
     * @param addressArray Array of address objects
     * @param sortProperty The address property to sort by
     * @returns {Array} A sorted array of address objects
     */
    sortAddresses: function(addressArray, sortProperty) {
      var sortArgs = {
        "property": sortProperty
      };

      // Underscore will run each address object through this iterator
      var sortIterator = function(addressObj) {
        // If the sort property is a string, convert it to lower case to make this a case-insensitive sort
        if (typeof addressObj[sortArgs.property] === "string") {
          return addressObj[sortArgs.property].toLowerCase();
        }
        return addressObj[sortArgs.property];
      };

      return _.sortBy(addressArray, sortIterator, sortArgs);
    }

  });

  return {
    CheckoutModel: checkoutModel,
    testVariable: {
      modelHelpers: modelHelpers
    }
  };
});
