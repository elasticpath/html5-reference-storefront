/**
 * Copyright Elastic Path Software 2013.
 *
 * Storefront - Default Profile Models
 */
define(['ep', 'eventbus', 'backbone'],
  function (ep, EventBus, Backbone) {

    /**
     * Defines url to fetch model from, and parse the response.
     * Backbone.Model
     */
    var profileModel = Backbone.Model.extend({
      url: ep.io.getApiContext() + '/profiles/' + ep.app.config.cortexApi.scope + '/default?zoom=purchases:element,paymentmethods:element,subscriptions:element,emails,addresses:element',
      parse: function (response) {
        var profileObj = {};

        // Profile Summary Info
        profileObj.familyName = jsonPath(response, 'family-name')[0];
        profileObj.givenName = jsonPath(response, 'given-name')[0];

        // Profile Payment Info
        var creditCardsArray = jsonPath(response, '$._paymentmethods.._element')[0];
        profileObj.paymentMethods = parseHelpers.parseArray(creditCardsArray, 'parseCreditCard');


        // Profile Subscription Info
        var subscriptionsArray = jsonPath(response, '$._subscriptions.._element')[0];
        profileObj.subscriptions = parseHelpers.parseArray(subscriptionsArray, 'parseSubscription');


        // Profile Addresses
        var addressesArray = jsonPath(response, '$._addresses.._element')[0];
        profileObj.addresses = parseHelpers.parseArray(addressesArray, 'parseAddress');


        return profileObj;
      }
    });

    /**
     * Collection of helper functions to parse the model.
     * @type {{parseArray: Function, parseSubscription: Function, parseAddress: Function, parseCreditCard: Function}}
     */
    var parseHelpers = {
      /**
       * Parse an array of objects.
       * @param rawArray  the raw array response to be parsed.
       * @param parseFunction the name of function to parse the objects in array
       * @returns Array of parsed objects
       */
      parseArray: function (rawArray, parseFunction) {
        var parsedArray = [];
        var arrayLength = 0;

        if (rawArray) {
          arrayLength = rawArray.length;
        }

        for (var i = 0; i < arrayLength; i++) {
          var parsedObject = this[parseFunction](rawArray[i]);
          parsedArray.push(parsedObject);
        }

        return parsedArray;
      },
      /**
       * Parse a subscription object.
       * @param rawObject raw subscription JOSN response
       * @returns Object - parsed subscription object
       */
      parseSubscription: function (rawObject) {
        var subscription = {};

        try {
          subscription = {
            displayName: jsonPath(rawObject, 'display-name')[0],
            quantity: jsonPath(rawObject, 'quantity')[0],
            nextBillingDate: jsonPath(rawObject, 'next-billing-date..display-value')[0],
            status: jsonPath(rawObject, 'status')[0]
          };
        }
        catch (error) {
          ep.logger.error('Error building subscription object: ' + error.message);
        }

        return subscription;
      },
      /**
       * Parse an address object.
       * @param rawObject raw address JSON response
       * @returns Object - parsed address object
       */
      parseAddress: function (rawObject) {
        var address = {};

        try {
          address = {
            givenName: jsonPath(rawObject, '$.name..given-name')[0],
            familyName: jsonPath(rawObject, '$.name..family-name')[0],
            streetAddress: jsonPath(rawObject, '$.address..street-address')[0],
            extendedAddress: jsonPath(rawObject, '$.address..extended-address')[0],
            city: jsonPath(rawObject, '$.address..locality')[0],
            region: jsonPath(rawObject, '$.address..region')[0],
            country: jsonPath(rawObject, '$.address..country-name')[0],
            postalCode: jsonPath(rawObject, '$.address..postal-code')[0]
          };
        }
        catch (error) {
          ep.logger.error('Error building address object: ' + error.message);
        }

        return address;
      },
      /**
       * Parse an credit card object.
       * @param rawObject raw credit card JSON response
       * @returns Object - parsed credit card object
       */
      parseCreditCard: function (rawObject) {
        var creditCard = {};

        try {
          creditCard = {
            cardNumber: jsonPath(rawObject, 'card-number')[0],
            cardType: jsonPath(rawObject, 'card-type')[0],
            cardHolderName: jsonPath(rawObject, 'cardholder-name')[0],
            expiryMonth: jsonPath(rawObject, 'expiry-month')[0],
            expiryYear: jsonPath(rawObject, 'expiry-year')[0]
          };
        }
        catch (error) {
          ep.logger.error('Error building credit card payment method object: ' + error.message);
        }

        return creditCard;
      }
    };

    return {
      ProfileModel: profileModel

    };
  }
);
