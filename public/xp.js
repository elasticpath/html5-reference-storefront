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
        'app'             : 'modules/base/app/base.app.controller',
        'base.app.models'      : 'modules/base/app/base.app.models',
        'base.app.views'       : 'modules/base/app/base.app.views',
        'base.ia'              : 'modules/base/ia/base.ia.controller',
        'base.ia.models'       : 'modules/base/ia/base.ia.models',
        'base.ia.views'        : 'modules/base/ia/base.ia.views',
        'base.cortex'          : 'modules/base/cortex/base.cortex.controller',
        'base.home'            : 'modules/base/home/base.home.controller',
        'base.home.models'     : 'modules/base/home/base.home.models',
        'base.home.views'      : 'modules/base/home/base.home.views',
        'base.item'            : 'modules/base/item/base.item.controller',
        'base.item.models'     : 'modules/base/item/base.item.models',
        'base.item.views'      : 'modules/base/item/base.item.views',
        'base.category'        : 'modules/base/category/base.category.controller',
        'base.category.models' : 'modules/base/category/base.category.models',
        'base.category.views'  : 'modules/base/category/base.category.views',
        'base.appheader'       : 'modules/base/appheader/base.appheader.controller',
        'base.appheader.models': 'modules/base/appheader/base.appheader.models',
        'base.appheader.views' : 'modules/base/appheader/base.appheader.views',
        'base.uimodal'         : 'modules/base/ui/base.ui.modal.controller',
        'base.uimodal.models'  : 'modules/base/ui/base.ui.modal.models',
        'base.uimodal.views'   : 'modules/base/ui/base.ui.modal.views',
        'base.settings'        : 'modules/base/settings/base.settings.controller',
        'base.settings.models' : 'modules/base/settings/base.settings.models',
        'base.settings.views'  : 'modules/base/settings/base.settings.views',
        'base.search'          : 'modules/base/search/base.search.controller',
        'base.search.models'   : 'modules/base/search/base.search.models',
        'base.search.views'    : 'modules/base/search/base.search.views',
        'base.profile'         : 'modules/base/profile/base.profile.controller',
        'base.profile.models'  : 'modules/base/profile/base.profile.models',
        'base.profile.views'   : 'modules/base/profile/base.profile.views',
        'base.cart'            : 'modules/base/cart/base.cart.controller',
        'base.cart.models'     : 'modules/base/cart/base.cart.models',
        'base.cart.views'      : 'modules/base/cart/base.cart.views',
        'base.receipt'         : 'modules/base/receipt/base.receipt.controller',
        'base.receipt.models'  : 'modules/base/receipt/base.receipt.models',
        'base.receipt.views'   : 'modules/base/receipt/base.receipt.views',
        'base.auth'            : 'modules/base/auth/base.auth.controller',
        'base.auth.models'     : 'modules/base/auth/base.auth.models',
        'base.auth.views'      : 'modules/base/auth/base.auth.views',
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

