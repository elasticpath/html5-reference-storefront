/**
 * Copyright Elastic Path Software 2013.
 *
 * Storefront - Profile Models
 */
define(function (require) {
  var ep = require('ep');
  var Backbone = require('backbone');
  var ModelHelper = require('modelHelpers');

  // Array of zoom parameters to pass to Cortex
  var zoomArray = [
    'purchases:element',
    'paymentmethods:element',
    'subscriptions:element',
    'emails',
    'addresses:element'
  ];

  /**
   * Model containing profile information of a registered user.
   * @type Backbone.Model
   */
  var profileModel = Backbone.Model.extend({
    url: ep.io.getApiContext() + '/profiles/' + ep.app.config.cortexApi.scope + '/default?zoom=' + zoomArray.join(),
    parse: function (response) {
      var profileObj = {};

      // Name info
      profileObj.familyName = jsonPath(response, 'family-name')[0];
      profileObj.givenName = jsonPath(response, 'given-name')[0];

      // Payment methods (tokenized only)
      // Only select payment methods with a display-value property (credit cards do not have this property)
      var paymentMethodsArray = jsonPath(response, "$._paymentmethods.._element[?(@['display-value'])]");
      profileObj.paymentMethods = modelHelpers.parseArray(paymentMethodsArray, modelHelpers.parsePaymentMethod);

      // Subscription info
      var subscriptionsArray = jsonPath(response, '$._subscriptions.._element')[0];
      profileObj.subscriptions = modelHelpers.parseArray(subscriptionsArray, modelHelpers.parseSubscription);

      // Profile addresses
      var addressesArray = jsonPath(response, '$._addresses.._element')[0];
      profileObj.addresses = modelHelpers.parseArray(addressesArray, modelHelpers.parseAddress);

      return profileObj;
    }
  });

  var modelHelpers = ModelHelper.extend({
    /**
     * Parse a payment method object.
     * @param rawObject raw payment method JSON response
     * @returns Object - parsed payment method object
     */
    parsePaymentMethod: function (rawObject) {
      var paymentMethod = {};
      if (rawObject) {
        paymentMethod = {
          displayValue: jsonPath(rawObject,'display-value')[0]
        };
      } else {
        ep.logger.error('Error building payment method object');
      }

      return paymentMethod;
    }
  });

  return {
    ProfileModel: profileModel
  };
});