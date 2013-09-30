/**
 * Copyright Elastic Path Software 2013.
 *
 * User: sbrookes
 * Date: 18/03/13
 * Time: 1:26 PM
 *
 */

require.config({
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
    'app'             : 'modules/app/app.controller',
    'app.models'      : 'modules/app/app.models',
    'app.views'       : 'modules/app/app.views',
    'ia'              : 'modules/ia/ia.controller',
    'ia.models'       : 'modules/ia/ia.models',
    'ia.views'        : 'modules/ia/ia.views',
    'cortex'          : 'modules/cortex/cortex.controller',
    'home'            : 'modules/home/home.controller',
    'home.models'     : 'modules/home/home.models',
    'home.views'      : 'modules/home/home.views',
    'item'            : 'modules/item/item.controller',
    'item.models'     : 'modules/item/item.models',
    'item.views'      : 'modules/item/item.views',
    'category'        : 'modules/category/category.controller',
    'category.models' : 'modules/category/category.models',
    'category.views'  : 'modules/category/category.views',
    'appheader'       : 'modules/appheader/appheader.controller',
    'appheader.models': 'modules/appheader/appheader.models',
    'appheader.views' : 'modules/appheader/appheader.views',
    'uiform'          : 'modules/ui/ui.form.controller',
    'uiform.models'   : 'modules/ui/ui.form.models',
    'uiform.views'    : 'modules/ui/ui.form.views',
    'uieditor'        : 'modules/ui/ui.codeeditor.controller',
    'uieditor.models' : 'modules/ui/ui.codeeditor.models',
    'uieditor.views'  : 'modules/ui/ui.codeeditor.views',
    'uimodal'         : 'modules/ui/ui.modal.controller',
    'uimodal.models'  : 'modules/ui/ui.modal.models',
    'uimodal.views'   : 'modules/ui/ui.modal.views',
    'uiaccordion'     : 'modules/ui/ui.accordion.controller',
    'uiaccordion.models': 'modules/ui/ui.accordion.models',
    'uiaccordion.views': 'modules/ui/ui.accordion.views',
    'settings'        : 'modules/settings/settings.controller',
    'settings.models' : 'modules/settings/settings.models',
    'settings.views'  : 'modules/settings/settings.views',
    'search'          : 'modules/search/search.controller',
    'search.models'   : 'modules/search/search.models',
    'search.views'    : 'modules/search/search.views',
    'profile'         : 'modules/profile/profile.controller',
    'profile.models'  : 'modules/profile/profile.models',
    'profile.views'   : 'modules/profile/profile.views',
    'cart'            : 'modules/cart/cart.controller',
    'cart.models'     : 'modules/cart/cart.models',
    'cart.views'      : 'modules/cart/cart.views',
    'user'            : 'modules/user/user.controller',
    'user.models'     : 'modules/user/user.models',
    'user.views'      : 'modules/user/user.views',
    'receipt'         : 'modules/receipt/receipt.controller',
    'debug'           : 'modules/debug/debug.controller',
    'auth'            : 'modules/auth/auth.controller',
    'auth.models'     : 'modules/auth/auth.models',
    'auth.views'      : 'modules/auth/auth.views'
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
});

//require(['app','eventbus','i18n'],
require(['app','eventbus','i18n','bootstrap'],
  function (App,EventBus,i18n){

    // Application DOM container is ready (viewport)
    $(document).ready(function(){

      // initialize the localization engine
      i18n.init({
          lng: 'en' // default to english
        },
        function(){

          // trigger event to let the application know it is safe to kick off
          EventBus.trigger('app.bootstrapInitSuccess');

        }
      );
    }
  );
});
