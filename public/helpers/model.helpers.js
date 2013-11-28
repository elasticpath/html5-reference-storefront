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
    parseArray: function (rawArray, parseFunction) {
      var parsedArray = [];

      rawArray.forEach(function(data) {
        var parsedObject = parseFunction(data);
        parsedArray.push(parsedObject);
      });

      return parsedArray;
    }
  };

  _.extend(parseHelpers, itemParser);
  _.extend(parseHelpers, profileParser);

  return parseHelpers;
});