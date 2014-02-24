/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 */
// Set the require.js configuration for the unit tests.

// Use a relative base URL with Require JS if tests are being run from PhantomJS
var baseRequireUrl = '/public';
if (window.PHANTOMJS) {
  baseRequireUrl = '../public';
}

requirejs.config({
  baseUrl: baseRequireUrl,
  paths: {
    'backbone'        : 'scripts/lib/backbone',
    'bootstrap'       : 'scripts/lib/bootstrap.min',
    'equalize'        : 'scripts/lib/plugins/jquery-equalheights',
    'i18n'            : 'scripts/lib/i18next.amd-1.6.0',
    'jquery'          : 'scripts/lib/jquery-1.8.3',
    'jsonpath'        : 'scripts/lib/jsonpath-0.8.0',
    'marionette'      : 'scripts/lib/backbone.marionette',
    'modalwin'        : 'scripts/lib/plugins/jquery.simplemodal-1.4.4',
    'modernizr'       : 'scripts/lib/modernizr-latest',
    'pace'            : 'scripts/lib/pace.min',
    'spin'            : 'scripts/lib/plugins/spin',
    'jquerySpin'      : 'scripts/lib/plugins/jquery.spin',
    'toast'           : 'scripts/lib/plugins/jquery.toastmessage',
    'underscore'      : 'scripts/lib/underscore',

    'ep'              : 'ep.client',
    'eventbus'        : 'eventbus',
    'loadRegionContentEvents': 'loadRegionContentEvents',
    'mediator'        : 'ep.mediator',
    'modelHelpers'    : 'helpers/model.helpers',
    'router'          : 'router',
    'viewHelpers'     : 'helpers/view.helpers',
    'utils'           : 'utils/utils',

    'app'             : 'modules/base/app/base.app.controller',
    'app.models'      : 'modules/base/app/base.app.models',
    'app.views'       : 'modules/base/app/base.app.views',
    'appheader'       : 'modules/base/appheader/base.appheader.controller',
    'appheader.models': 'modules/base/appheader/base.appheader.models',
    'appheader.views' : 'modules/base/appheader/base.appheader.views',
    'auth'            : 'modules/base/auth/base.auth.controller',
    'auth.models'     : 'modules/base/auth/base.auth.models',
    'auth.views'      : 'modules/base/auth/base.auth.views',
    'cart'            : 'modules/base/cart/base.cart.controller',
    'cart.models'     : 'modules/base/cart/base.cart.models',
    'cart.views'      : 'modules/base/cart/base.cart.views',
    'category'        : 'modules/base/category/base.category.controller',
    'category.models' : 'modules/base/category/base.category.models',
    'category.views'  : 'modules/base/category/base.category.views',
    'checkout'        : 'modules/base/checkout/base.checkout.controller',
    'checkout.models' : 'modules/base/checkout/base.checkout.models',
    'checkout.views'  : 'modules/base/checkout/base.checkout.views',
    'home'            : 'modules/base/home/base.home.controller',
    'home.models'     : 'modules/base/home/base.home.models',
    'home.views'      : 'modules/base/home/base.home.views',
    'ia'              : 'modules/base/ia/base.ia.controller',
    'ia.models'       : 'modules/base/ia/base.ia.models',
    'ia.views'        : 'modules/base/ia/base.ia.views',
    'item'            : 'modules/base/item/base.item.controller',
    'item.models'     : 'modules/base/item/base.item.models',
    'item.views'      : 'modules/base/item/base.item.views',
    'profile'         : 'modules/base/profile/base.profile.controller',
    'profile.models'  : 'modules/base/profile/base.profile.models',
    'profile.views'   : 'modules/base/profile/base.profile.views',
    'purchaseinfo'         : 'modules/base/purchaseinfo/base.purchaseinfo.controller',
    'purchaseinfo.models'  : 'modules/base/purchaseinfo/base.purchaseinfo.models',
    'purchaseinfo.views'   : 'modules/base/purchaseinfo/base.purchaseinfo.views',
    'search'          : 'modules/base/search/base.search.controller',
    'search.models'   : 'modules/base/search/base.search.models',
    'search.views'    : 'modules/base/search/base.search.views',

    'address'         : 'modules/base/components/address/base.component.address.controller',
    'address.views'   : 'modules/base/components/address/base.component.address.views',
    'address.models'  : 'modules/base/components/address/base.component.address.models',
    'payment'         : 'modules/base/components/payment/base.component.payment.controller',
    'payment.views'   : 'modules/base/components/payment/base.component.payment.views',
    'payment.models' : 'modules/base/components/payment/base.component.payment.models',

    'registration': 'modules/base/registration/base.registration.controller',
    'registration.views': 'modules/base/registration/base.registration.views',

    'chai'            : '../tests/libs/chai',
    'mocha.common'    : '../tests/libs/mocha.common',
    'sinon'           : '../tests/libs/sinon-1.7.3',
    'sinon-chai'      : '../tests/libs/sinon-chai',

    'testfactory.event': '../tests/TestHelpers/EventTestFactory',
    'testfactory.controller': '../tests/TestHelpers/ControllerTestFactory',
    'testfactory.model': '../tests/TestHelpers/ModelTestFactory',
    "testhelpers.event": '../tests/TestHelpers/EventTestHelpers',
    'testhelpers.defaultview': '../tests/TestHelpers/DefaultViewTestHelper',

    'phantom.bridge': '../tests/libs/phantomjs/bridge.js'

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
    require('phantom.bridge', mochaPhantomJS.run);
  } else {
    mocha.run();
  }
};

var setupSinonChai = function () {
  var sinonChai = require("sinon-chai");
  chai.use(sinonChai);
};