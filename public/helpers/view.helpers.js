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
     * Get url hash from ep.config.json file.
     * @param routeKey  key to access routes values
     * @returns String url hash
     */
    getUrlHash: function(routeKey) {
      var link = ep.app.config.routes[routeKey];

      if (routeKey !== 'home' && link === undefined){
        ep.logger.warn("this route with key " + routeKey + " does  not exist.");
      }

      return link;
    },

    /**
     * Generate url with specified route root and encoded href
     * @param routeKey route key to access hash url root (e.g. #myCart)
     * @param href     href to cortex resource
     * @returns String   generated url matching a router url pattern
     */
    generateUrl: function (routeKey, href) {
      if (!href) {
        ep.logger.warn('viewHelper.generateUrl called without href');
      }

      return this.getUrlHash(routeKey) + '/' + ep.ui.encodeUri(href);
    },

    /**
     * Returns a disabled attribute string for an HTML button suitable for inclusion in templates or an empty
     * string based on the outcome of testing a predicate function.
     *
     * @param predicateFn A predicate function to test.
     * @returns {string} A constructed disabled attribute or empty.
     */
    getButtonDisabledAttr: function(predicateFn) {
      var retVar = 'disabled="disabled"';

      if (predicateFn && _.isFunction(predicateFn)) {
        if ( predicateFn() ) {
          retVar = '';
        }
      }

      return retVar;
    },

    getStatusDisplayText:function(status){
      return  this.getI18nLabel('purchaseStatus.' + status);
    },

    generateNumericOptions: function(start, range) {
      if (isNaN(start) || isNaN(range)) {
        ep.logger.warn("generateNumericOptions viewHelper called with invalid argument.");
        return '';
      }

      var max = start + range - 1;
      var html = "";

      for (var i = start; i <= max; i++) {
        html += '<option value="' + i + '">' + i + '</option>\n';
      }

      return html;
    },

    /**
     * Determines if the object (billing/shipping address or shipping option) being rendered has been marked as
     * chosen (selected). If so, returns the HTML checked attribute to be applied to the associated radio button.
     *
     * @param obj The checkout object being rendered (billing/shipping addresses and shipping options are supported)
     * @returns {string} HTML checked attribute or empty string
     */
    getAddressRadioCheckedAttr: function (obj) {
      var checkedAttr = '';

      if (obj && obj.chosen === true) {
        checkedAttr = 'checked="checked"';
      }

      return checkedAttr;
    },


  };

  return ViewHelper;
});