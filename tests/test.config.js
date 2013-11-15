// Set the require.js configuration for the unit tests.
requirejs.config({
  baseUrl: '/public',
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
    'viewHelpers'     : 'ep.viewHelpers',
    'jsonpath'        : 'scripts/lib/jsonpath-0.8.0',
    'i18n'            : 'scripts/lib/i18next.amd-1.6.0',
    'eventbus'        : 'eventbus',
    'toast'           : 'scripts/lib/plugins/jquery.toastmessage',
    'colorpicker'     : 'scripts/lib/plugins/colorpicker',
    'modalwin'        : 'scripts/lib/plugins/jquery.simplemodal-1.4.4',
    'app'             : 'modules/base/app/base.app.controller',
    'app.models'      : 'modules/base/app/base.app.models',
    'app.views'       : 'modules/base/app/base.app.views',
    'ia'              : 'modules/base/ia/base.ia.controller',
    'ia.models'       : 'modules/base/ia/base.ia.models',
    'ia.views'        : 'modules/base/ia/base.ia.views',
    'home'            : 'modules/base/home/base.home.controller',
    'home.models'     : 'modules/base/home/base.home.models',
    'home.views'      : 'modules/base/home/base.home.views',
    'item'            : 'modules/base/item/base.item.controller',
    'item.models'     : 'modules/base/item/base.item.models',
    'item.views'      : 'modules/base/item/base.item.views',
    'category'        : 'modules/base/category/base.category.controller',
    'category.models' : 'modules/base/category/base.category.models',
    'category.views'  : 'modules/base/category/base.category.views',
    'appheader'       : 'modules/base/appheader/base.appheader.controller',
    'appheader.models': 'modules/base/appheader/base.appheader.models',
    'appheader.views' : 'modules/base/appheader/base.appheader.views',
    'search'          : 'modules/base/search/base.search.controller',
    'search.models'   : 'modules/base/search/base.search.models',
    'search.views'    : 'modules/base/search/base.search.views',
    'profile'         : 'modules/base/profile/base.profile.controller',
    'profile.models'  : 'modules/base/profile/base.profile.models',
    'profile.views'   : 'modules/base/profile/base.profile.views',
    'cart'            : 'modules/base/cart/base.cart.controller',
    'cart.models'     : 'modules/base/cart/base.cart.models',
    'cart.views'      : 'modules/base/cart/base.cart.views',
    'receipt'         : 'modules/base/receipt/base.receipt.controller',
    'receipt.models'  : 'modules/base/receipt/base.receipt.models',
    'receipt.views'   : 'modules/base/receipt/base.receipt.views',
    'auth'            : 'modules/base/auth/base.auth.controller',
    'auth.models'     : 'modules/base/auth/base.auth.models',
    'auth.views'      : 'modules/base/auth/base.auth.views',
    'address'         : 'modules/base/components/address/base.component.address.controller',
    'address.views'   : 'modules/base/components/address/base.component.address.views',
    'chai'            : '/tests/libs/chai',
    'sinon-chai'      : '/tests/libs/sinon-chai',
    'mocha.common'    : '/tests/libs/mocha.common',
    'EventTestFactory': '/tests/TestHelpers/EventTestFactory',
    'EventTestHelpers': '/tests/TestHelpers/EventTestHelpers',
    'sinon'           :  'scripts/lib/sinon-1.7.3'

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

// Run the tests
var runMocha = function () {

  // Add Sinon assertions to Chai
  setupSinonChai();
  if (window.mochaPhantomJS) {
    mochaPhantomJS.run();
  } else {
    mocha.run();
  }
};

var setupSinonChai = function () {
  var sinonChai = require("sinon-chai");
  chai.use(sinonChai);
}