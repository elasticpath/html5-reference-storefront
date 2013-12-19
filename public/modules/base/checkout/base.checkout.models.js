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
    // chosen billing address
    'billingaddressinfo:selector:chosen:description',
    // choice billing addresses
    'billingaddressinfo:selector:choice',
    'billingaddressinfo:selector:choice:description',
    'tax',
    'total',
    'cart',
    'cart:total',
    // delivery type
    'deliveries:element',
    // chosen shipping address
    'deliveries:element:destinationinfo:selector:chosen:description',
    // choice shipping addresses
    'deliveries:element:destinationinfo:selector:choice',
    'deliveries:element:destinationinfo:selector:choice:description',
    // chosen shipping option
    'deliveries:element:shippingoptioninfo:selector:chosen:description',
    // choice shipping options
    'deliveries:element:shippingoptioninfo:selector:choice',
    'deliveries:element:shippingoptioninfo:selector:choice:description'
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
        billingAddresses: [],
        shippingAddresses: [],
        shippingOptions: []
      };

      if (response) {
        checkoutObj.submitOrderActionLink = jsonPath(response, "$..links[?(@.rel=='submitorderaction')].href")[0];

        checkoutObj.deliveryType = jsonPath(response, "$.._deliveries[0].._element[0].delivery-type")[0];

        var parsedBillingAddresses = modelHelpers.parseCheckoutAddresses(response, "billingaddressinfo");
        var parsedShippingAddresses = modelHelpers.parseCheckoutAddresses(response, "destinationinfo");

        if (parsedBillingAddresses.length) {
          // Sort the parsed billing addresses alphabetically by the streetAddress property
          checkoutObj.billingAddresses = modelHelpers.sortAddresses(parsedBillingAddresses, "streetAddress");

          // Set a chosen billing address if there is not one set already
          checkoutObj.billingAddresses = modelHelpers.setChosenAddress(checkoutObj.billingAddresses);
        }

        if (parsedShippingAddresses.length) {
          // Sort the parsed shipping addresses alphabetically by the streetAddress property
          checkoutObj.shippingAddresses = modelHelpers.sortAddresses(parsedShippingAddresses, "streetAddress");

          // Set a chosen shipping address if there is not one set already
          checkoutObj.shippingAddresses = modelHelpers.setChosenAddress(checkoutObj.shippingAddresses);
        }

        checkoutObj.summary = modelHelpers.parseCheckoutSummary(response);

        checkoutObj.shippingOptions = modelHelpers.parseShippingOptions(response);
      } else {
        ep.logger.error("Checkout model wasn't able to fetch valid data for parsing. ");
      }

      return checkoutObj;
    }
  });

  var modelHelpers = ModelHelper.extend({
    /**
     * Helper function for billing/shipping address and shipping option objects.
     * Adds a property to identify the object as being the chosen (selected) object.
     * @param {Object} obj The object to be extended.
     * @returns {Object} The returned object with chosen property added.
     */
    markAsChosenObject: function(obj) {
      return _.extend(obj, {chosen: true});
    },

    /**
     * Parse checkout summary information.
     * @param response The JSON response to be parsed
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
     * Parse an individual shipping option object.
     * @param rawObject Raw shipping option JSON object
     * @returns {Object} Parsed shipping option object
     */
    parseShippingOption: function (rawObject) {
      var shippingOption = {};

      if (rawObject) {
        shippingOption = {
          carrier: jsonPath(rawObject, '$..carrier')[0],
          cost: jsonPath(rawObject, '$..cost..display')[0],
          displayName: jsonPath(rawObject, '$..display-name')[0]
        };
      } else {
        ep.logger.error('Error when building checkout shipping option object');
      }

      return shippingOption;
    },

    /**
     * Parse an array of shipping options that the registered user can use at checkout.
     * The first shipping option in the returned array will be the chosen option.
     * If there is no chosen option, we mark the first 'choice' option as being 'chosen',
     * so we have a default shipping option to use at checkout.
     * @param rawObject The raw JSON response to be parsed
     * @returns {Array} Parsed array of shipping options objects
     */
    parseShippingOptions: function (response) {
      var shippingOptions = [];

      if (response) {

        var chosenShippingOption = jsonPath(response, '$.._shippingoptioninfo[0].._chosen.._description[0]')[0];
        var choiceShippingOptions = jsonPath(response, '$.._shippingoptioninfo[0].._choice')[0];

        if (chosenShippingOption) {
          var parsedShippingOption = modelHelpers.parseShippingOption(chosenShippingOption);

          modelHelpers.markAsChosenObject(parsedShippingOption);

          shippingOptions.push(parsedShippingOption);
        }

        if (choiceShippingOptions) {
          var numShippingOptions = choiceShippingOptions.length;

          for (var i = 0; i < numShippingOptions; i++) {
            var parsedChoiceOption =  modelHelpers.parseShippingOption(choiceShippingOptions[i]._description[0]);
            var selectActionHref = jsonPath(choiceShippingOptions[i], '$..links[?(@.rel=="selectaction")].href');

            // Add the Cortex select action to the choice billing address
            if (selectActionHref && selectActionHref[0]) {
              _.extend(parsedChoiceOption, {selectAction: selectActionHref[0]});
            }

            shippingOptions.push(parsedChoiceOption);
          }
        }
      } else {
        ep.logger.error('Error when building checkout shipping option object');
      }

      return shippingOptions;
    },

    /**
     * Parse addresses (billing or shipping) that the registered user can use for checkout.
     * The first address in the returned array will be the chosen address.
     * If there is no chosen address, we mark the first 'choice' address as being 'chosen',
     * so we have a default billing/shipping address to use at checkout.
     *
     * @param response The JSON response to be parsed
     * @param jsonPathPrefix The prefix to use in jsonPath selections:
     *          "billingaddressinfo" for billing addresses
     *          "destinationinfo" for shipping addresses
     * @returns {Array} Addresses (billing or shipping) of a registered user
     */
    parseCheckoutAddresses: function (response, jsonPathPrefix) {
      var checkoutAddresses = [];

      if (response && jsonPathPrefix) {

        var chosenAddress = jsonPath(response, '$.._' + jsonPathPrefix + '[0].._chosen.._description[0]')[0];
        var choiceAddresses = jsonPath(response, '$.._' + jsonPathPrefix + '[0].._choice')[0];

        if (chosenAddress) {
          var parsedChosenAddress = modelHelpers.parseAddress(chosenAddress);

          modelHelpers.markAsChosenObject(parsedChosenAddress);

          checkoutAddresses.push(parsedChosenAddress);
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

            checkoutAddresses.push(parsedChoiceAddress);
          }
        }
      } else {
        ep.logger.error('Error when building checkout addresses object');
      }

      return checkoutAddresses;
    },

    /**
     * Searches an array of address objects looking for a 'chosen' property.
     * If there is no 'chosen' address defined, designates the first address object in the array
     * to be the chosen address by giving it a 'setAsDefaultChoice' property (the presence of this
     * property will then trigger an update POST to Cortex in the checkout controller code).
     *
     * @param addressesArray Array of (billing or shipping) addresses
     * @returns {Array} Array of (billing or shipping) addresses with a chosen address
     */
    setChosenAddress: function(addressesArray) {
      var chosenAddress = _.find(addressesArray, function(address) {
        return address.chosen;
      });

      if (!chosenAddress) {
        _.extend(addressesArray[0], { setAsDefaultChoice: true });
      }

      return addressesArray;
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
