/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 */
define(['ep', 'eventbus', 'backbone'],
  function (ep, EventBus, Backbone) {


    var profileModel = Backbone.Model.extend({
      url: ep.app.config.cortexApi.path + '/profiles/' + ep.app.config.cortexApi.scope + '/default?zoom=purchases:element,paymentmethods:element,subscriptions:element,emails,addresses:element',
      parse: function (response) {
        var profileObj = {};

        // Profile Summary Info
        profileObj.familyName = jsonPath(response, 'family-name');
        profileObj.givenName = jsonPath(response, 'given-name');

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

    var parseHelpers = {
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
      parseSubscription: function (rawObject) {
        var subscription = {
          displayName: jsonPath(rawObject, 'display-name')[0],
          quantity: jsonPath(rawObject, 'quantity')[0],
          nextBillingDate: jsonPath(rawObject, 'next-billing-date..display-value')[0],
          status: jsonPath(rawObject, 'status')[0]
        };

        return subscription;
      },
      parseAddress: function (rawObject) {
        var address = {
          givenName: jsonPath(rawObject, 'name..given-name')[0],
          familyName: jsonPath(rawObject, 'name..family-name')[0],
          streetAddress: jsonPath(rawObject, 'address..street-address')[0],
          extAddress: jsonPath(rawObject, 'address..extended-address')[0],
          city: jsonPath(rawObject, 'address..locality')[0],
          region: jsonPath(rawObject, 'address..region')[0],
          country: jsonPath(rawObject, 'address..country-name')[0],
          postalCode: jsonPath(rawObject, 'address..postal-code')[0]
        };

        return address;
      },
      parseCreditCard: function (rawObject) {
        var creditCard = {
          cardNumber: jsonPath(rawObject, 'card-number')[0],
          cardType: jsonPath(rawObject, 'card-type')[0],
          cardHolderName: jsonPath(rawObject, 'cardholder-name')[0],
          expiryMonth: jsonPath(rawObject, 'expiry-month')[0],
          expiryYear: jsonPath(rawObject, 'expiry-year')[0]
        };

        return creditCard;
      }
    };

    return {
      ProfileModel: profileModel


    };
  }
);
