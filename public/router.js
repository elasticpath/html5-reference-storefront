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
 *
 */
define(function(require) {

    var Marionette = require('marionette');
    var loadRegionContentController = require('loadRegionContentEvents');

    var router = Marionette.AppRouter.extend({
      appRoutes:{
        '': 'index',
        'home': 'index',
        'category' : 'category',
        'category/:href' : 'category',
        'category/:href/:pagehref' : 'category',
        'checkout': 'checkout',
        'itemdetail/:href': 'itemDetail',
        'editaddress/:href': 'editaddress',
        'newaddressform' : 'newaddressform',
        'newpaymentform' : 'newpaymentform',
        'mycart': 'cart',
        'profile': 'profile',
        'purchaseReceipt/:id': 'purchaseReceipt',
        'purchaseDetails/:id': 'purchaseDetails',
        'registration' : 'registration',
        'search' : 'search',
        'search/:keywords' : 'search'
      },
      controller:loadRegionContentController,
      /**
       * Matches the Backbone.history.fragment (the current URL) to a route from the AppRouter
       * and separates out any parameters appended to the current route.
       *
       * @returns Object {
       *  name: the name of the current route,
       *  params: an array of parameters appended to the current route
       *  }
       */
      getCurrentRoute: function () {
        var fragment = Backbone.history.fragment,
        // Get Marionette app routes and convert the object to a list of [key, value] pairs for processing
          routes = _.pairs(this.appRoutes),
          route,
          name,
          found;

        // Attempt to find a matching route by iterating over the array pairs using
        // _.find and an anonymous predicate function
        found = _.find(routes, function (namedRoute) {
          route = namedRoute[0];
          name = namedRoute[1];

          if (!_.isRegExp(route)) {
            // Convert the current route to a regular expression using the internal Backbone function
            route = this._routeToRegExp(route);
          }

          // Test the regular expression against the URL fragment
          return route.test(fragment);
        }, this);

        if (found) {
          return {
            name: name,
            // Extract parameters from the matched URL fragment using the internal Backbone function
            params: this._extractParameters(route, fragment)
          };
        }
      },
      /**
       * Rebuilds a URL fragment from a given route and optional parameters
       * @param routeConfigObj An object containing a mapping of route names to fragments
       * @param routeName The route name to use for the URL fragment
       * @param urlParams {Array} Optional array of parameters to append to the URL fragment
       * @returns {String} A complete URL fragment built from the supplied parameters and one
       *                   that is suitable for passing directly to Backbone.Router.navigate
       */
      rebuildUrlFragment: function (routeConfigObj, routeName, urlParams) {
        var fragment;

        // Get the corresponding route from our config file
        if (_.has(routeConfigObj, routeName)) {
          fragment = routeConfigObj[routeName];
        }

        // If there is an array of parameters, append them to the URL fragment
        if (urlParams && urlParams.length) {
          fragment = fragment + '/' + urlParams.join('/');
        }
        return fragment;
      }
    });

    return {
      AppRouter:router
    };
  }
);
