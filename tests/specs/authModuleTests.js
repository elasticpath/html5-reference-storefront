/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.

 * User: sbrookes
 * Date: 22/08/13
 * Time: 4:10 PM
 *
 */
define(
  function(require) {
    var auth   = require('auth');

    describe('UI Storefront Auth Module - Model', function() {
      var testData = {};

      var testAuthModel = new auth.AuthModel(testData);

      it("testAuthModel should exist");
      it("testAuthModel has ROLE");
      it("testAuthModel has Scope");
      it("testAuthModel has post url");
    });

    describe('UI Storefront Auth Module - Views', function() {
      it("AuthLoginFormView should exists");
      it("ProfileMenuView should exists");
    });

  }
);
