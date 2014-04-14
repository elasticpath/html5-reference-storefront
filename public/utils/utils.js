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
 * Utility functions
 */
define(function(require){
  var _ = require('underscore');
  var i18n = require('i18n');

  return {
    /**
     * Helper function to descend through the properties of a given object based on an array of strings.
     * Returns the value of the final property listed in the parameters if it is reachable.
     * Returns undefined if the final property is unreachable.
     *
     * @example
     * var someObj = {a: {b: {c: {d:1} } } };
     * getDescendedPropertyValue(someObj, ['a', 'b', 'c', 'd']);
     * // returns 1
     *
     * @param {Object} obj The object whose properties are to be descended
     * @param {String[]} propArray An array of one or more strings representing the properties to be descended
     * @returns {*|undefined} The value of the final property passed if it is found OR undefined
     */
    getDescendedPropertyValue: function (obj, propArray) {
      // The current object/property to inspect
      var current;
      // Check that we have suitable parameters to work with
      if (_.isObject(obj) && _.isArray(propArray) && propArray.length) {
        current = obj;
        for (var i = 0, j = propArray.length; i < j; i++) {
          var propName = propArray[i];
          // Descend through the object using the next property name in the array
          current = current[propName];

          if(typeof(current) === 'undefined') {
            return current;
          }
        }
      } else {
        console.warn('getDescendedPropertyValue called with unsuitable or missing parameters.');
      }
      return current;
    },

    /**
     * Format message list into HTML unordered list.
     * @param msgList array of messages
     * @returns String messages in unordered list, or just message if only 1 line.
     */
    formatMsgAsList: function (msgList) {
      var formattedMsg = '';

      // if there is more than 1 line, format it as list
      if (msgList.length > 1) {
        formattedMsg = '<UL class="error-list">';
        msgList.forEach(function (line) {
          formattedMsg += '<LI>' + line + '</LI>';
        });
        formattedMsg += '</UL>';
      }
      else if (msgList.length === 1){
        formattedMsg = msgList[0];
      }

      return formattedMsg;
    },

    /**
     * Boolean function to test if a given jQuery object is a HTML button.
     * @param $obj a jQuery object
     * @returns {Boolean}
     */
    isButton: function ($obj) {
      return (
        // Test if this is a valid jQuery object and that it refers to a <button> element
        ($obj) && ($obj instanceof jQuery) && ($obj.prop('tagName') === 'BUTTON')
      ) ? true : false;
    },

    /**
     * Translates raw error response from Cortex.
     * NOTE: this is a temporary solution until Cortex returns specific error codes/keys to enable localization.
     * @param rawMsg A raw string of error messages from Cortex
     * @param keyMap An object mapping of Cortex error message strings to locale keys
     * @param extOptions Optional parameters object
     */
    translateErrorMessage: function (rawMsg, keyMap, extOptions) {
      // Default options
      var options = {
        localePrefix: '',
        returnAsHTML: false,  // NOTE: returnAsHTML option disabled
        sortArray: false
      };

      // Merge default options and external options
      if (extOptions) {
        options = _.extend({}, options, extOptions);
      }

      var rawMsgList;
      var errMsgKeyList = [];
      var unHandledErrMsgList = [];
      var translatedMsgList = [];

      // parse message by ';' separator into separate lines
      rawMsgList = rawMsg.split('; ');

      // match raw messages to localization keys
      _.each(rawMsgList, function (cortexMsg) {
        // match message against cortexMsgToKeyMap
        if (keyMap.hasOwnProperty(cortexMsg)){
          var key = options.localePrefix + keyMap[cortexMsg];
          // check there isn't duplicate error message key
          if (errMsgKeyList.indexOf(key) < 0) {
            errMsgKeyList.push(key);
          }
        }
        // if matches nothing in cortexMsgToKeyMap, store in separate list
        else {
          unHandledErrMsgList.push(cortexMsg);
        }
      });

      // if non of raw messages are unhandled display a generic error message
      if (unHandledErrMsgList.length > 0) {
        if (errMsgKeyList.length === 0) {
          // FIXME Generalize this
          errMsgKeyList.push('addressForm.errorMsg.generalSaveAddressFailedErrMsg');
        }
        else {
          console.warn('Unhandled address form err message: ' + unHandledErrMsgList);
        }
      }

      _.each(errMsgKeyList, function(key) {
        translatedMsgList.push({error: i18n.t(key)});
      });

      if (options.sortArray) {
        translatedMsgList.sort();
      }

//      if (options.returnAsHTML) {
//        return this.formatMsgAsList(translatedMsgList);
//      } else {
//      }
      return translatedMsgList;
    },

    /**
     * Renders a message (from a i18n key) to a container referenced by a jQuery object.
     * @param msgKey a message string or an i18n key to a message
     * @param jQuery object
     */
    renderMsgToPage: function (msgKey, jQueryObj) {
      // Test for a message and a valid jQuery object and exit early if either are missing
      if (!msgKey || !jQueryObj || !(jQueryObj instanceof jQuery)) {
        console.warn('renderMsgToPage called without a valid message or target region');
        return; // skip rest of the function
      }

      var msg = i18n.t(msgKey);

      // Perform an animated scroll to the top of the page
      $('html, body').animate({ scrollTop: 0 }, 'fast');

      jQueryObj.html(msg);
    }
  };
});
