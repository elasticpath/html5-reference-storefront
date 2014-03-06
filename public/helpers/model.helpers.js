/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
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
      else {
        ep.logger.warn('modelHelper.parseArray was called with undefined data');
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

      if(rawObject) {
        tax = {
          currency: jsonPath(rawObject, '$.currency')[0],
          amount: jsonPath(rawObject, '$.amount')[0],
          display: jsonPath(rawObject, '$.display')[0],
          title: jsonPath(rawObject, '$.title')[0]
        };
      }
      else {
        ep.logger.warn('Error building tax object: raw tax object was undefined.');
      }

      return tax;
    }
  };

  _.extend(parseHelpers, itemParser);
  _.extend(parseHelpers, profileParser);

  return parseHelpers;
});