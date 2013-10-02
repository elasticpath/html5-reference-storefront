// Set the require.js configuration for the unit tests.
requirejs.config({
  baseUrl: '/public',
  paths: {
    'jquery': 'scripts/lib/jquery-1.8.3',
    'underscore': 'scripts/lib/underscore',
    'backbone': 'scripts/lib/backbone',
    'cortex': 'modules/cortex/cortex.controller',
    'marionette': 'scripts/lib/backbone.marionette',
    'modernizr': 'scripts/lib/modernizr-latest',
    'chai': '/tests/libs/chai',
    'mocha.common': '/tests/libs/mocha.common',
    'sinon':  'scripts/lib/sinon-1.7.3',
    'pace'            : 'scripts/lib/pace.min',
    'bootstrap'       : 'scripts/lib/bootstrap.min',
    'URI'             : 'scripts/lib/URI',
    'equalize'        : 'scripts/lib/plugins/jquery-equalheights',
    'router': 'router',
    'ep': 'ep.client',
    'mediator': 'ep.mediator',
    'app': 'modules/app/app.controller',
    'jsonpath': 'scripts/lib/jsonpath-0.8.0',
    'i18n': 'scripts/lib/i18next.amd-1.6.0',
    'eventbus': 'eventbus',
    'toast': 'scripts/lib/plugins/jquery.toastmessage',
    'colorpicker': 'scripts/lib/plugins/colorpicker',
    'modalwin': 'scripts/lib/plugins/jquery.simplemodal-1.4.4',
    'home': 'modules/home/home.controller',
    'composer': 'modules/composer/composer.controller',
    'composer2': 'modules/composer2/composer.controller',
    'category': 'modules/category/category.controller',
    'theme': 'modules/theme/theme.controller',
    'appheader': 'modules/appheader/appheader.controller',
    'uiform': 'modules/ui/ui.form.controller',
    'uieditor': 'modules/ui/ui.codeeditor.controller',
    'uimodal': 'modules/ui/ui.modal.controller',
    'uiaccordion': 'modules/ui/ui.accordion.controller',
    'settings': 'modules/settings/settings.controller',
    'tabs': 'scripts/lib/plugins/kube.tabs',
    'contextmenu': 'scripts/lib/plugins/jquery.contextmenu',
    'ia': 'modules/ia/ia.controller',
    'item': 'modules/item/item.controller',
    'cart': 'modules/cart/cart.controller',
    'auth': 'modules/auth/auth.controller',
    'itemviews': 'modules/item/item.views',
    'debug': 'modules/debug/debug.controller',
    'itemdata': './tests/data/item',
    'ace': 'http://rawgithub.com/ajaxorg/ace-builds/master/src-noconflict/ace'
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
    'underscore': {
      'exports': '_'
    }
  }
});

mocha.setup({
  ui: 'bdd',
  ignoreLeaks: true
});

// Protect from barfs
console = window.console || function () {
};

// Don't track
window.notrack = true;

// Helper... not really needed but in case we want to do something fancy
var runMocha = function () {
  if (window.mochaPhantomJS) {
    mochaPhantomJS.run();
  } else {
    mocha.run();
  }
};
