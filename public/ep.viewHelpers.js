/**
 *
 */
define(function(require){
  var _ = require('underscore'),
    i18n = require('i18n');

  var ViewHelper = {

    /**
     * Get the localized version of text corresponding the key given.
     * @param key the key of JSON 'key/value' pair to corresponding localized text
     * @returns   the localized text or the i18n key in error
     */
    getI18nLabel:function(key){
      var retVal = key;
      try{
        retVal = i18n.t(key);
      }
      catch(e){
        // slient failure on label rendering
      }

      return retVal;

    },

    extend: function(extendedProp) {
      var child = extendedProp || {};

      _.extend(child, this);

      return child;
    }
  };

  return ViewHelper;
});