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

      // Profile Summary Info
      profileObj.familyName = jsonPath(response, 'family-name')[0];
      profileObj.givenName = jsonPath(response, 'given-name')[0];

      // Profile Payment Info
      var creditCardsArray = jsonPath(response, '$._paymentmethods.._element')[0];
      profileObj.paymentMethods = modelHelpers.parseArray(creditCardsArray, modelHelpers.parseCreditCard);

      // Profile Subscription Info
      var subscriptionsArray = jsonPath(response, '$._subscriptions.._element')[0];
      profileObj.subscriptions = modelHelpers.parseArray(subscriptionsArray, modelHelpers.parseSubscription);

      // Profile Addresses
      var addressesArray = jsonPath(response, '$._addresses.._element')[0];
      profileObj.addresses = modelHelpers.parseArray(addressesArray, modelHelpers.parseAddress);

      return profileObj;
    }
  });

  var modelHelpers = ModelHelper.extend({
    /**
     * Parse an credit card object.
     * @param rawObject raw credit card JSON response
     * @returns Object - parsed credit card object
     */
    parseCreditCard: function (rawObject) {
      var creditCard = {};

      if (rawObject) {
        creditCard = {
          cardNumber: jsonPath(rawObject, 'card-number')[0],
          cardType: jsonPath(rawObject, 'card-type')[0],
          cardHolderName: jsonPath(rawObject, 'cardholder-name')[0],
          expiryMonth: jsonPath(rawObject, 'expiry-month')[0],
          expiryYear: jsonPath(rawObject, 'expiry-year')[0]
        };
      } else {
        ep.logger.error('Error building credit card payment method object');
      }

      return creditCard;
    }
  });

  return {
    ProfileModel: profileModel,
    testVariable: {
      modelHelpers: modelHelpers
    }
  };
});