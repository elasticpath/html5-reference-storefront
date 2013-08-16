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
    'chai'            : 'scripts/lib/chai',
    'URI'             : 'scripts/lib/URI',
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
    'ia'              : 'modules/ia/ia.controller',
    'cortex'          : 'modules/cortex/cortex.controller',
    'home'            : 'modules/home/home.controller',
    'item'            : 'modules/item/item.controller',
    'composer'        : 'modules/composer/composer.controller',
    'composer2'       : 'modules/composer2/composer.controller',
    'category'        : 'modules/category/category.controller',
    'theme'           : 'modules/theme/theme.controller',
    'appheader'       : 'modules/appheader/appheader.controller',
    'uiform'          : 'modules/ui/ui.form.controller',
    'uieditor'        : 'modules/ui/ui.codeeditor.controller',
    'uimodal'         : 'modules/ui/ui.modal.controller',
    'uiaccordion'     : 'modules/ui/ui.accordion.controller',
    'settings'        : 'modules/settings/settings.controller',
    'search'          : 'modules/search/search.controller',
    'cart'            : 'modules/cart/cart.controller',
    'user'            : 'modules/user/user.controller',
    'tabs'            : 'scripts/lib/plugins/kube.tabs',
    'contextmenu'     : 'scripts/lib/plugins/jquery.contextmenu',
    'debug'           : 'modules/debug/debug.controller',
    'ace'             : 'http://rawgithub.com/ajaxorg/ace-builds/master/src-noconflict/ace'
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
    'underscore': {
      'exports': '_'
    }
  }
});

define(['app','eventbus','i18n'],
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
