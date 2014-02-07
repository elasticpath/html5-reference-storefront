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
  var zoomArray = [];

  /**
   * Model containing information necessary for checkout.
   * @type Backbone.Model
   */
  var registrationModel = Backbone.Model.extend({
    defaults: {
      userName:'Anonymous',
      authRequest: true,
      url: ep.io.getApiContext() + '/oauth2/tokens',
      type: 'POST',
      contentType: 'application/x-www-form-urlencoded',
      success: function (json, responseStatus, xhr) {
        ep.io.localStore.setItem('oAuthRole', json.role);
        ep.io.localStore.setItem('oAuthScope', json.scope);
        ep.io.localStore.setItem('oAuthToken', 'Bearer ' + json.access_token);
        ep.io.localStore.setItem('oAuthUserName', this.userName);

        Mediator.fire('mediator.authenticationSuccess', json.role);
      },
      error: function(response) {
        if (response.status === 401) {
          EventBus.trigger('auth.loginRequestFailed', 'badCredentialErrMsg');
        } else {
          ep.logger.error('response code ' + response.status + ': ' + response.responseText);
        }
      }
    }
  });



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
;

  return {
    RegistrationModel: registrationModel
  };
});
