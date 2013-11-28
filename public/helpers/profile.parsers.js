/**
 * Model Parser Helpers
 */
define(function (require) {
  var ep = require('ep');

  return {
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

});