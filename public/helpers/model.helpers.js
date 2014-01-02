/**
 * Model Parser Helpers
 */
define(function(require){
  var _ = require('underscore');
  var ep = require('ep');

  var itemParser = require('helpers/item.parsers');
  var profileParser = require('helpers/profile.parsers');

  var parseHelpers = {
    /**
     * Extend additional helper functions with functions in parsehelper
     * @param options  additional functions object
     * @returns {*|{}} extended object
     */
    extend: function(options) {
      var child = options || {};

      _.extend(child, this);

      return child;
    },

    /**
     * Parse array of objects using specified function.
     * @param rawArray  array of objects to be parsed.
     * @param parseFunction function used to parse objects in array.
     * @returns {Array} array of parsed objects.
     */
    parseArray: function (rawArray, parseFunction) {
      var parsedArray = [];

      if (rawArray) {
        rawArray.forEach(function(data) {
          var parsedObject = parseFunction(data);
          parsedArray.push(parsedObject);
        });
      }

      return parsedArray;
    },

    /**
     * Parse a tax object (has extra title field from price object).
     * @param rawObject raw tax JSON response.
     * @returns Object tax
     */
    parseTax: function(rawObject) {
      var tax = {};

      // FIXME: [CU-106] replace try/catch with test for rawObject
      try {
        tax = {
          currency: jsonPath(rawObject, '$.currency')[0],
          amount: jsonPath(rawObject, '$.amount')[0],
          display: jsonPath(rawObject, '$.display')[0],
          title: jsonPath(rawObject, '$.title')[0]
        };
      }
      catch (error) {
        ep.logger.error('Error building tax object: ' + error.message);
      }

      return tax;
    }
  };

  _.extend(parseHelpers, itemParser);
  _.extend(parseHelpers, profileParser);

  return parseHelpers;
});