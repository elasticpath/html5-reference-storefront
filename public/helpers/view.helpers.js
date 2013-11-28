/**
 * View Helpers
 */
define(function (require) {
  var _ = require('underscore');
  var i18n = require('i18n');

  var ViewHelper = {

    /**
     * Extend additional helper functions with functions in viewHelpers
     * @param options  additional functions object
     * @returns {*|{}} extended object
     */
    extend: function (options) {
      var child = options || {};

      _.extend(child, this);

      return child;
    },

    /**
     * Get the localized version of text corresponding the key given.
     * @param key the key of JSON 'key/value' pair to corresponding localized text
     * @returns   the localized text or the i18n key in error
     */
    getI18nLabel: function (key) {
      return i18n.t(key);
    }

  };

  return ViewHelper;
});