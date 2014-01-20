/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
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
    'deliveries:element:shippingoptioninfo:selector:choice:description',
    // in case user does not have any payment method,
    // need paymentmethodinfo to determine if payment method region need to show
    'paymentmethodinfo',
    // chosen payment options
    'paymentmethodinfo:selector:chosen:description',
    // choice payment options
    'paymentmethodinfo:selector:choice',
    'paymentmethodinfo:selector:choice:description'
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
        shippingOptions: [],
        paymentMethods: []
      };

      if (response) {
        checkoutObj.submitOrderActionLink = jsonPath(response, "$..links[?(@.rel=='submitorderaction')].href")[0];
        checkoutObj.deliveryType = jsonPath(response, "$.._deliveries[0].._element[0].delivery-type")[0];

        var paymentMethodObj = jsonPath(response, '$.._paymentmethodinfo');
        checkoutObj.showPaymentMethods = paymentMethodObj ? true : false;

        var parsedBillingAddresses = modelHelpers.parseCheckoutAddresses(response, "billingaddressinfo");
        var parsedShippingAddresses = modelHelpers.parseCheckoutAddresses(response, "destinationinfo");
        var parsedPaymentMethods = modelHelpers.parsePaymentMethods(response);

        if (parsedBillingAddresses.length) {
          // Sort the parsed billing addresses alphabetically by the streetAddress property
          checkoutObj.billingAddresses = modelHelpers.sortAddresses(parsedBillingAddresses, "streetAddress");

          // Set a chosen billing address if there is not one set already
          checkoutObj.billingAddresses = modelHelpers.setChosenEntity(checkoutObj.billingAddresses);
        }

        if (parsedShippingAddresses.length) {
          // Sort the parsed shipping addresses alphabetically by the streetAddress property
          checkoutObj.shippingAddresses = modelHelpers.sortAddresses(parsedShippingAddresses, "streetAddress");

          // Set a chosen shipping address if there is not one set already
          checkoutObj.shippingAddresses = modelHelpers.setChosenEntity(checkoutObj.shippingAddresses);

          var parsedShippingOptions = modelHelpers.parseShippingOptions(response);

          if (parsedShippingOptions.length) {
            // Sort shipping options in ascending order by cost and then display name
            checkoutObj.shippingOptions = modelHelpers.sortShippingOptions(parsedShippingOptions, "costAmount", "displayName");

            // Set a chosen shipping option if there is not one set already
            checkoutObj.shippingOptions = modelHelpers.setChosenEntity(checkoutObj.shippingOptions);
          }
        }

        if (parsedPaymentMethods.length) {
          // Sort the parsed payment methods alphabetically by the displayValue
          checkoutObj.paymentMethods = modelHelpers.sortPaymentMethods(parsedPaymentMethods, 'displayValue');

          // Set a chosen payment method if there is not one set already
          checkoutObj.paymentMethods = modelHelpers.setChosenEntity(checkoutObj.paymentMethods);
        }

        checkoutObj.summary = modelHelpers.parseCheckoutSummary(response);


      } else {
        ep.logger.error("Checkout model wasn't able to fetch valid data for parsing.");
      }

      return checkoutObj;
    }
  });

  var paymentMethodsCollection = Backbone.Collection.extend();
  var shippingOptionsCollection = Backbone.Collection.extend();
  var checkoutSummaryModel = Backbone.Model.extend();

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
     * Searches an array of objects (addresses, shipping options, or payment methods)looking for a 'chosen' property.
     * If there is no 'chosen' object defined, it designates the first object in the array to be
     * the chosen object by giving it a 'setAsDefaultChoice' property (the presence of this
     * property will then trigger an update POST to Cortex in the checkout controller code).
     *
     * @param objArray Array of objects (these could be billing/shipping addresses or shipping options)
     * @returns {Array} Array of objects with a chosen object defined
     */
    setChosenEntity: function(objArray) {
      var chosenEntity = _.find(objArray, function(obj) {
        return obj.chosen;
      });

      if (!chosenEntity) {
        _.extend(objArray[0], { setAsDefaultChoice: true });
      }

      return objArray;
    },

    /**
     * Parse checkout summary information.
     * @param response The JSON response to be parsed
     * @returns {Object} Order quantity, subtotal, taxes, and total
     */
    parseCheckoutSummary: function (response) {
      var summary = {
        subTotal: {},
        taxTotal: {},
        taxes: [],
        total: {}
      };

      if (response) {
        summary.totalQuantity = jsonPath(response, '$._cart..total-quantity')[0];
        summary.submitOrderActionLink = jsonPath(response, "$..links[?(@.rel=='submitorderaction')].href")[0];

        var subTotal = jsonPath(response, '$._cart.._total..cost[0]')[0];
        if (subTotal) {
          summary.subTotal = modelHelpers.parsePrice(subTotal);
        }

        var shippingTotal = modelHelpers.getChosenShippingOption(response);
        if (shippingTotal && _.has(shippingTotal, "cost")) {
          summary.shippingTotal = modelHelpers.parsePrice(shippingTotal.cost[0]);
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
     * Parses the chosen shipping option information from a given JSON object.
     * Used to build the checkout summary object and the shipping options array.
     * @param response A JSON object
     * @returns {Object} An object representing the chosen shipping option
     */
    getChosenShippingOption: function (response) {
      return jsonPath(response, '$.._shippingoptioninfo[0].._chosen.._description[0]')[0];
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
          costAmount: jsonPath(rawObject, '$..cost..amount')[0],
          costDisplay: jsonPath(rawObject, '$..cost..display')[0],
          displayName: jsonPath(rawObject, '$..display-name')[0]
        };
      } else {
        ep.logger.error('Error when building checkout shipping option object');
      }

      return shippingOption;
    },

    /**
     * Parse an array of shipping options that the registered user can use at checkout.
     *
     * @param rawObject The raw JSON response to be parsed
     * @returns {Array} Parsed array of shipping options objects
     */
    parseShippingOptions: function (response) {
      var shippingOptions = [];

      if (response) {

        var chosenShippingOption = modelHelpers.getChosenShippingOption(response);
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
        ep.logger.error('parseShippingOptions called with invalid JSON response');
      }

      return shippingOptions;
    },

    /**
     * Parse addresses (billing or shipping) that the registered user can use for checkout.
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
     * Parse paymentMethods that that the registered user can use for checkout.
     *
     * @param response  The raw JSON response to be parsed
     * @returns {Array} Parsed array of paymentMethods objects
     */
    parsePaymentMethods: function(response) {
      var paymentMethods = [];

      if (response) {
        var chosenPaymentMethod = jsonPath(response, '$.._paymentmethodinfo.._chosen.._description[0]')[0];
        var choicePaymentMethods = jsonPath(response, '$.._paymentmethodinfo.._choice')[0];

        if (chosenPaymentMethod) {
          var chosen = modelHelpers.parseTokenPayment(chosenPaymentMethod);

          modelHelpers.markAsChosenObject(chosen);

          paymentMethods.push(chosen);
        }

        if (choicePaymentMethods) {
          choicePaymentMethods.forEach(function(choice) {
            var parsedChoice =  modelHelpers.parseTokenPayment(choice._description[0]);

            // Add the Cortex select action to the choice payment method
            var selectActionHref = jsonPath(choice, '$..links[?(@.rel=="selectaction")].href');
            if (selectActionHref && selectActionHref[0]) {
              _.extend(parsedChoice, {selectAction: selectActionHref[0]});
            }

            paymentMethods.push(parsedChoice);
          });
        }
      }
      else {
        ep.logger.error('parsePaymentMethods is passed with undefined JSON response');
      }

      return paymentMethods;
    },

    /**
     * Sorts an array of shipping option objects in ascending order by one or two shipping option object properties.
     * The function uses Underscore's sortBy function and as this is a stable sort (maintains the order of items
     * with the same sorting key), the optional secondary sort is carried out first.
     * @param {Array} shippingOptionsArray The array of shipping option objects to sort.
     * @param primarySortProperty The primary property to sort on.
     * @param [secondarySortProperty] The optional secondary property to sort on.
     * @returns {Array} Sorted array of shipping option objects.
     */
    sortShippingOptions: function(shippingOptionsArray, primarySortProperty, secondarySortProperty) {
      var sortedShippingOptionsArray = shippingOptionsArray;

      if (_.isArray(shippingOptionsArray) && shippingOptionsArray.length > 1) {
        // Begin with the sort by secondary property
        if (_.has(shippingOptionsArray[0], secondarySortProperty)) {
          sortedShippingOptionsArray = _.sortBy(sortedShippingOptionsArray, function(shippingOption) {
            // Convert string values to lowercase for case-insensitive sort
            if (_.isString(shippingOption[secondarySortProperty])) {
              return shippingOption[secondarySortProperty].toLowerCase();
            }
            return shippingOption[secondarySortProperty];
          });
        }
        // Then sort by the primary property (the order of items with the same key will be maintained)
        if (_.has(shippingOptionsArray[0], primarySortProperty)) {
          sortedShippingOptionsArray = _.sortBy(sortedShippingOptionsArray, function(shippingOption) {
            // Convert string values to lowercase for case-insensitive sort
            if (_.isString(shippingOption[primarySortProperty])) {
              return shippingOption[primarySortProperty].toLowerCase();
            }
            return shippingOption[primarySortProperty];
          });
        }
      }
      return sortedShippingOptionsArray;
    },

    /**
     * Performs a case-insensitive sort of a given array alphabetically by a given property.
     * @param addressArray Array to be sorted
     * @param sortProperty The property to sort by
     * @returns {Array} A sorted array
     */
    sortByAscAlphabeticOrder: function(arrayToSort, sortProperty) {
      var sortArgs = {
        "property": sortProperty
      };

      // Underscore will run each object through this iterator
      var sortIterator = function(obj) {
        // If the sort property is a string, convert it to lower case to make this a case-insensitive sort
        if (typeof obj[sortArgs.property] === "string") {
          return obj[sortArgs.property].toLowerCase();
        }
        return obj[sortArgs.property];
      };

      return _.sortBy(arrayToSort, sortIterator, sortArgs);
    },

    /**
     * Sort array of addresses by a given property.
     * @param addressArray  Array to be sorted.
     * @param sortProperty  Property to sort by.
     * @returns {Array}     Sorted array of addresses.
     */
    sortAddresses: function(addressArray, sortProperty) {
      return modelHelpers.sortByAscAlphabeticOrder(addressArray, sortProperty);
    },

    /**
     * Sort array of payment methods by a given property.
     * @param paymentMethodArray  Array to be sorted.
     * @param sortProperty        Property to sort by.
     * @returns {Array}           Sorted array of payment methods.
     */
    sortPaymentMethods: function(paymentMethodArray, sortProperty) {
      return modelHelpers.sortByAscAlphabeticOrder(paymentMethodArray, sortProperty);
    }
  });

  return {
    CheckoutModel: checkoutModel,
    CheckoutPaymentMethodsCollection: paymentMethodsCollection,
    CheckoutShippingOptionsCollection: shippingOptionsCollection,
    CheckoutSummaryModel: checkoutSummaryModel,
    testVariable: {
      modelHelpers: modelHelpers
    }
  };
});
