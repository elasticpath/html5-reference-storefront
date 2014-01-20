/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 * Model Parser Helpers
 */
define(function (require) {
  var ep = require('ep');

  return {
    /**
     * Parse an availability object.
     * @param rawObject raw availability JSON response
     * @returns Object availability (states and release-date)
     */
    parseAvailability: function (rawObject) {
      var availability = {};

      if(rawObject) {
        availability.state = jsonPath(rawObject, '$..state')[0];
        var releaseDate = jsonPath(rawObject, '$..release-date')[0];
        if (releaseDate) {
          availability.releaseDate = {
            displayValue: jsonPath(releaseDate, 'display-value')[0],
            value: jsonPath(releaseDate, 'value')[0]
          };
        }
      }
      else {
        ep.logger.warn('Error building availability object: raw availability object was undefined.');
      }

      return availability;
    },

    /**
     * Parse a rate object.
     * @param rawObject raw rate JSON response
     * @returns Object  item rate
     */
    parseRate: function (rawObject) {
      var rate = {};
      if(rawObject) {
        rate.display = rawObject.display;
        rate.cost = {
          amount: jsonPath(rawObject, '$.cost..amount')[0],
          currency: jsonPath(rawObject, '$.cost..currency')[0],
          display: jsonPath(rawObject, '$.cost..display')[0]
        };

        rate.recurrence = {
          interval: jsonPath(rawObject, '$.recurrence..interval')[0],
          display: jsonPath(rawObject, '$.recurrence..display')[0]
        };
      }
      else {
        ep.logger.warn('Error building rate object: raw rate object was undefined.');

      }

      return rate;
    },

    /**
     * Parse a price object (list or purchase price).
     * @param rawObject raw price JSON response.
     * @returns Object  item price (list or purchase price).
     */
    parsePrice: function (rawObject) {
      var price = {};

      if(rawObject) {
        price = {
          currency: jsonPath(rawObject, '$.currency')[0],
          amount: jsonPath(rawObject, '$.amount')[0],
          display: jsonPath(rawObject, '$.display')[0]
        };
      }
      else {
        ep.logger.warn('Error building price object: raw price object was undefined.');
      }

      return price;
    },

    /**
     * Parse an image object.
     * @param rawObject raw image object.
     * @returns Object item image.
     */
    parseImage: function (rawObject) {
      var defaultImg = {};

      if(rawObject) {
        defaultImg = {
          absolutePath: jsonPath(rawObject, '$.content-location')[0],
          relativePath: jsonPath(rawObject, '$.relative-location')[0],
          name: jsonPath(rawObject, '$.name')[0]
        };
      }
      else {
        ep.logger.warn('Error building image object: raw image object was undefined.');

      }

      return defaultImg;
    }
  };

});