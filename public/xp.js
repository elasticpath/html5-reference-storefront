/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.

 * User: sbrookes
 * Date: 08/10/13
 * Time: 11:32 PM
 *
 */
//(function(){
  var config = {
    logging:{
      logInfo:true,
      logWarnings:true,
      logErrors:true
    },
    debug:{
      showInstrumentation:false
    },
    cortexApi:{
      path:'cortex',
      scope:'mobee'
    },
    deployMode:'development',
    requireAuthToCheckout:true,
    viewFadeInValue:500,
    routes: {
      cart:'#mycart',
      category:'#category',
      profile:'#profile',
      itemDetail:'#itemdetail'
    },
    baseDependencyConfig:{
      paths: {
        'jquery'          : 'scripts/lib/jquery-1.8.3',
        'underscore'      : 'scripts/lib/underscore',
        'backbone'        : 'scripts/lib/backbone',
        'marionette'      : 'scripts/lib/backbone.marionette',
        'modernizr'       : 'scripts/lib/modernizr-latest',
        'pace'            : 'scripts/lib/pace.min',
        'bootstrap'       : 'scripts/lib/bootstrap.min',
        'URI'             : 'scripts/lib/URI',
        'equalize'        : 'scripts/lib/plugins/jquery-equalheights',
        'tabs'            : 'scripts/lib/plugins/kube.tabs',
        'contextmenu'     : 'scripts/lib/plugins/jquery.contextmenu',
        'router'          : 'router',
        'ep'              : 'ep.client',
        'mediator'        : 'ep.mediator',
        'jsonpath'        : 'scripts/lib/jsonpath-0.8.0',
        'i18n'            : 'scripts/lib/i18next.amd-1.6.0',
        'eventbus'        : 'eventbus',
        'toast'           : 'scripts/lib/plugins/jquery.toastmessage',
        'colorpicker'     : 'scripts/lib/plugins/colorpicker',
        'modalwin'        : 'scripts/lib/plugins/jquery.simplemodal-1.4.4',
        'app'             : 'modules/base/app/app.controller',
        'app.models'      : 'modules/base/app/app.models',
        'app.views'       : 'modules/base/app/app.views',
        'ia'              : 'modules/base/ia/ia.controller',
        'ia.models'       : 'modules/base/ia/ia.models',
        'ia.views'        : 'modules/base/ia/ia.views',
        'cortex'          : 'modules/base/cortex/cortex.controller',
        'home'            : 'modules/base/home/home.controller',
        'home.models'     : 'modules/base/home/home.models',
        'home.views'      : 'modules/base/home/home.views',
        'item'            : 'modules/base/item/item.controller',
        'item.models'     : 'modules/base/item/item.models',
        'item.views'      : 'modules/base/item/item.views',
        'category'        : 'modules/base/category/category.controller',
        'category.models' : 'modules/base/category/category.models',
        'category.views'  : 'modules/base/category/category.views',
        'appheader'       : 'modules/base/appheader/appheader.controller',
        'appheader.models': 'modules/base/appheader/appheader.models',
        'appheader.views' : 'modules/base/appheader/appheader.views',
        'uimodal'         : 'modules/base/ui/ui.modal.controller',
        'uimodal.models'  : 'modules/base/ui/ui.modal.models',
        'uimodal.views'   : 'modules/base/ui/ui.modal.views',
        'settings'        : 'modules/base/settings/settings.controller',
        'settings.models' : 'modules/base/settings/settings.models',
        'settings.views'  : 'modules/base/settings/settings.views',
        'search'          : 'modules/base/search/search.controller',
        'search.models'   : 'modules/base/search/search.models',
        'search.views'    : 'modules/base/search/search.views',
        'profile'         : 'modules/base/profile/profile.controller',
        'profile.models'  : 'modules/base/profile/profile.models',
        'profile.views'   : 'modules/base/profile/profile.views',
        'cart'            : 'modules/base/cart/cart.controller',
        'cart.models'     : 'modules/base/cart/cart.models',
        'cart.views'      : 'modules/base/cart/cart.views',
        'user'            : 'modules/base/user/user.controller',
        'user.models'     : 'modules/base/user/user.models',
        'user.views'      : 'modules/base/user/user.views',
        'receipt'         : 'modules/base/receipt/receipt.controller',
        'receipt.models'  : 'modules/base/receipt/receipt.models',
        'receipt.views'   : 'modules/base/receipt/receipt.views',
        'debug'           : 'modules/base/debug/debug.controller',
        'auth'            : 'modules/base/auth/auth.controller',
        'auth.models'     : 'modules/base/auth/auth.models',
        'auth.views'      : 'modules/base/auth/auth.views',
        'chai'            : '/tests/libs/chai',
        'mocha.common'    : '/tests/libs/mocha.common',
        'sinon'           :  'scripts/lib/sinon-1.7.3'
      },
      shim: {
        'backbone': {
          deps: ['underscore', 'jquery'],
          exports: 'Backbone'
        },
        marionette : {
          deps : ['backbone','underscore','jquery'],
          exports : 'Marionette'
        },
        ep : {
          deps: ['jquery','marionette'],
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
//}());

