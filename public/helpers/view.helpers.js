/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 * View Helpers
 */
define(function (require) {
  var _ = require('underscore');
  var ep = require('ep');
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
    },

    /**
     * Generate url with specified route root and encoded href
     * @param routeKey route key to access hash url root (e.g. #myCart)
     * @param href     href to cortex resource
     * @returns String   generated url matching a router url pattern
     */
    generateUrl: function (routeKey, href) {
      var link = '';

      if (href && ep.app.config.routes[routeKey]) {
        link = ep.app.config.routes[routeKey] + '/' + ep.ui.encodeUri(href);
      }
      else {
        ep.logger.warn('Unable to generate url; missing href or routeKey');
      }

      return link;
    },

    /**
     * Get link from ep.config.json file.
     * @param routeKey  key to access routes values
     * @returns String url link
     */
    getLink: function(routeKey) {
      var link = ep.app.config.routes[routeKey];

      if (!link) {
        ep.logger.warn("Unable to get link from ep.config; check if routes key correct.");
      }

      return link;
    },

    getStatusDisplayText:function(status){
      return  this.getI18nLabel('purchaseStatus.' + status);
    }

  };

  return ViewHelper;
});