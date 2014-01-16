/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.

 * User: sbrookes
 * Date: 08/10/13
 * Time: 11:32 PM
 *
 */

var config = {
  baseDependencyConfig: {
    paths: {
      'jquery': 'scripts/lib/jquery-1.8.3',
      'bootstrap': 'scripts/lib/bootstrap.min',
      'underscore': 'scripts/lib/underscore',
      'backbone': 'scripts/lib/backbone',
      'marionette': 'scripts/lib/backbone.marionette',
      'jsonpath': 'scripts/lib/jsonpath-0.8.0',
      'i18n': 'scripts/lib/i18next.amd-1.6.0',      'modernizr': 'scripts/lib/modernizr-latest',
      'toast': 'scripts/lib/plugins/jquery.toastmessage',
      'modalwin': 'scripts/lib/plugins/jquery.simplemodal-1.4.4',
      'pace': 'scripts/lib/pace.min',
      'URI': 'scripts/lib/URI',   // used by Cortex module only, remove after redo search
      'equalize': 'scripts/lib/plugins/jquery-equalheights',
      'spin': 'scripts/lib/plugins/spin',
      'jquerySpin': 'scripts/lib/plugins/jquery.spin',

      'router': 'router',
      'ep': 'ep.client',
      'eventbus': 'eventbus',
      'mediator': 'ep.mediator',
      'viewHelpers': 'helpers/view.helpers',
      'modelHelpers': 'helpers/model.helpers',
      'loadRegionContentEvents': 'loadRegionContentEvents',

      'app': 'modules/base/app/base.app.controller',
      'app.models': 'modules/base/app/base.app.models',
      'app.views': 'modules/base/app/base.app.views',
      'ia': 'modules/base/ia/base.ia.controller',
      'ia.models': 'modules/base/ia/base.ia.models',
      'ia.views': 'modules/base/ia/base.ia.views',
      'cortex': 'modules/base/cortex/base.cortex.controller', // used by Search module only, remove after redo search
      'home': 'modules/base/home/base.home.controller',
      'home.models': 'modules/base/home/base.home.models',
      'home.views': 'modules/base/home/base.home.views',
      'item': 'modules/base/item/base.item.controller',
      'item.models': 'modules/base/item/base.item.models',
      'item.views': 'modules/base/item/base.item.views',
      'category': 'modules/base/category/base.category.controller',
      'category.models': 'modules/base/category/base.category.models',
      'category.views': 'modules/base/category/base.category.views',
      'appheader': 'modules/base/appheader/base.appheader.controller',
      'appheader.models': 'modules/base/appheader/base.appheader.models',
      'appheader.views': 'modules/base/appheader/base.appheader.views',
      'search': 'modules/base/search/base.search.controller',
      'search.models': 'modules/base/search/base.search.models',
      'search.views': 'modules/base/search/base.search.views',
      'profile': 'modules/base/profile/base.profile.controller',
      'profile.models': 'modules/base/profile/base.profile.models',
      'profile.views': 'modules/base/profile/base.profile.views',
      'cart': 'modules/base/cart/base.cart.controller',
      'cart.models': 'modules/base/cart/base.cart.models',
      'cart.views': 'modules/base/cart/base.cart.views',
      'purchaseinfo': 'modules/base/purchaseinfo/base.purchaseinfo.controller',
      'purchaseinfo.models': 'modules/base/purchaseinfo/base.purchaseinfo.models',
      'purchaseinfo.views': 'modules/base/purchaseinfo/base.purchaseinfo.views',
      'auth': 'modules/base/auth/base.auth.controller',
      'auth.models': 'modules/base/auth/base.auth.models',
      'auth.views': 'modules/base/auth/base.auth.views',
      'checkout': 'modules/base/checkout/base.checkout.controller',
      'checkout.models': 'modules/base/checkout/base.checkout.models',
      'checkout.views': 'modules/base/checkout/base.checkout.views',
      'address'       : 'modules/base/components/address/base.component.address.controller',
      'address.views' : 'modules/base/components/address/base.component.address.views',
      'payment'       : 'modules/base/components/payment/base.component.payment.controller',
      'payment.views' : 'modules/base/components/payment/base.component.payment.views'
    },
    shim: {
      'backbone': {
        deps: ['underscore', 'jquery'],
        exports: 'Backbone'
      },
      marionette: {
        deps: ['backbone', 'underscore', 'jquery'],
        exports: 'Marionette'
      },
      ep: {
        deps: ['jquery', 'marionette'],
        exports: 'ep'
      },
      i18n: {
        deps: ['jquery'],
        exports: 'i18n'
      },
      bootstrap: {
        deps: ['jquery'],
        exports: 'bootstrap'
      },
      'underscore': {
        'exports': '_'
      }
    }
  }

};


