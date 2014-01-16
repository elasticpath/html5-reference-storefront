/**
 * Copyright Elastic Path Software 2013.
 *
 * Default Profile Models
 * The HTML5 Reference Storefront's MVC Model manages zoom queries the model uses to ask cortex server.
 * It also parses the raw data returned from server, so necessary data are surfaced, and renamed into desired format.
 */
define(function (require) {
  var ep = require('ep');
  var Backbone = require('backbone');
  var ModelHelper = require('modelHelpers');

  // Array of zoom parameters to pass to Cortex
  var zoomArray = [
    'subscriptions:element',
    'purchases:element',
    'addresses:element',
    'paymentmethods:element'
  ];

  /**
   * Model containing profile information of a registered user.
   * @type Backbone.Model
   */
  var profileModel = Backbone.Model.extend({
    url: ep.io.getApiContext() + '/profiles/' + ep.app.config.cortexApi.scope + '/default?zoom=' + zoomArray.join(),
    parse: function (response) {
      var profileObj = {
        familyName: undefined,
        givenName: undefined,
        subscriptions: [],
        addresses: [],
        paymentMethods: []
      };

      if (response) {
        // Profile Summary Info
        profileObj.familyName = jsonPath(response, 'family-name')[0];
        profileObj.givenName = jsonPath(response, 'given-name')[0];

        // Payment methods (tokenized only)
        // Only select payment methods with a display-value property (credit cards do not have this property)
        var paymentMethodsArray = jsonPath(response, "$._paymentmethods.._element[?(@.self.type=='application/vnd.elasticpath.paymenttoken')]");
        if(paymentMethodsArray) {
          profileObj.paymentMethods = modelHelpers.parseArray(paymentMethodsArray, modelHelpers.parseTokenPayment);
        }

        // Profile Subscription Info
        var subscriptionsArray = jsonPath(response, '$._subscriptions.._element')[0];
        if (subscriptionsArray) {
          profileObj.subscriptions = modelHelpers.parseArray(subscriptionsArray, modelHelpers.parseSubscription);
        }

        // Profile addresses
        var addressesArray = jsonPath(response, '$._addresses.._element')[0];
        if (addressesArray) {
          profileObj.addresses = modelHelpers.parseArray(addressesArray, modelHelpers.parseAddress);
        }
      }
      else {
        ep.logger.error("Profile model wasn't able to fetch valid data for parsing. ");
      }

      return profileObj;
    }
  });

  var profilePurchaseCollection = Backbone.Collection.extend();

  /**
   * Collection of helper functions to parse the model.
   * @type Object collection of modelHelper functions
   */
  var modelHelpers = ModelHelper.extend({});

  return {
    ProfileModel: profileModel,
    ProfilePurchaseCollection: profilePurchaseCollection,
    testVariable: {
      modelHelpers: modelHelpers
    }
  };
});