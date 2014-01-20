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
        'search' : 'search',
        'search/:keywords' : 'search',
        'itemdetail/:href': 'item',
        'profile': 'profile',
        'mycart': 'cart',
        'checkout': 'checkout',
        'confirmation/:id': 'confirmation',
        'newaddressform' : 'newaddressform'
      },
      controller:loadRegionContentController
    });

    return {
      AppRouter:router
    };
  }
);
