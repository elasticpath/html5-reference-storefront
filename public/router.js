/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
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
      }
    });

    return {
      AppRouter:router
    };
  }
);
