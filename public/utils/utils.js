/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 * Utility functions
 */
define(function(require){
  var _ = require('underscore');
  var ep = require('ep');
  var i18n = require('i18n');

  return {
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
        returnAsHTML: false,
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
          errMsgKeyList.push('addressForm.errorMsg.generalSaveAddressFailedErrMsg');
        }
        else {
          ep.logger.warn('Unhandled address form err message: ' + unHandledErrMsgList);
        }
      }

      _.each(errMsgKeyList, function(key) {
        translatedMsgList.push(i18n.t(key));
      });

      if (options.sortArray) {
        translatedMsgList.sort();
      }

      if (options.returnAsHTML) {
        return this.formatMsgAsList(translatedMsgList);
      } else {
        return translatedMsgList;
      }
    }
  };
});