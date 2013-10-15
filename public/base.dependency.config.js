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
      'underscore': 'scripts/lib/underscore',
      'backbone': 'scripts/lib/backbone',
      'marionette': 'scripts/lib/backbone.marionette',
      'modernizr': 'scripts/lib/modernizr-latest',
      'pace': 'scripts/lib/pace.min',
      'bootstrap': 'scripts/lib/bootstrap.min',
      'URI': 'scripts/lib/URI',
      'equalize': 'scripts/lib/plugins/jquery-equalheights',
      'tabs': 'scripts/lib/plugins/kube.tabs',
      'contextmenu': 'scripts/lib/plugins/jquery.contextmenu',
      'router': 'router',
      'ep': 'ep.client',
      'mediator': 'ep.mediator',
      'jsonpath': 'scripts/lib/jsonpath-0.8.0',
      'i18n': 'scripts/lib/i18next.amd-1.6.0',
      'eventbus': 'eventbus',
      'toast': 'scripts/lib/plugins/jquery.toastmessage',
      'colorpicker': 'scripts/lib/plugins/colorpicker',
      'modalwin': 'scripts/lib/plugins/jquery.simplemodal-1.4.4',
      'app': 'modules/base/app/base.app.controller',
      'app.models': 'modules/base/app/base.app.models',
      'app.views': 'modules/base/app/base.app.views',
      'ia': 'modules/base/ia/base.ia.controller',
      'ia.models': 'modules/base/ia/base.ia.models',
      'ia.views': 'modules/base/ia/base.ia.views',
      'cortex': 'modules/base/cortex/base.cortex.controller',
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
      'uimodal': 'modules/base/ui/base.ui.modal.controller',
      'uimodal.models': 'modules/base/ui/base.ui.modal.models',
      'uimodal.views': 'modules/base/ui/base.ui.modal.views',
      'settings': 'modules/base/settings/base.settings.controller',
      'settings.models': 'modules/base/settings/base.settings.models',
      'settings.views': 'modules/base/settings/base.settings.views',
      'search': 'modules/base/search/base.search.controller',
      'search.models': 'modules/base/search/base.search.models',
      'search.views': 'modules/base/search/base.search.views',
      'profile': 'modules/base/profile/base.profile.controller',
      'profile.models': 'modules/base/profile/base.profile.models',
      'profile.views': 'modules/base/profile/base.profile.views',
      'cart': 'modules/base/cart/base.cart.controller',
      'cart.models': 'modules/base/cart/base.cart.models',
      'cart.views': 'modules/base/cart/base.cart.views',
      'receipt': 'modules/base/receipt/base.receipt.controller',
      'receipt.models': 'modules/base/receipt/base.receipt.models',
      'receipt.views': 'modules/base/receipt/base.receipt.views',
      'auth': 'modules/base/auth/base.auth.controller',
      'auth.models': 'modules/base/auth/base.auth.models',
      'auth.views': 'modules/base/auth/base.auth.views',
      'chai': '/tests/libs/chai',
      'mocha.common': '/tests/libs/mocha.common',
      'sinon': 'scripts/lib/sinon-1.7.3'
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


