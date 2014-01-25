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
        'itemdetail/:href': 'item',
        'editaddress/:href': 'editaddress',
        'newaddressform' : 'newaddressform',
        'mycart': 'cart',
        'profile': 'profile',
        'purchaseReceipt/:id': 'purchaseReceipt',
        'purchaseDetails/:id': 'purchaseDetails',
        'search' : 'search',
        'search/:keywords' : 'search'
      },
      controller:loadRegionContentController
    });

    return {
      AppRouter:router
    };
  }
);
