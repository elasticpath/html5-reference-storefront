/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 * Functional Storefront Unit Test - Auth Models
 */
define(function (require) {
  var authModel = require('auth.models');

  describe('Auth Module: Models', function () {
    it("LogoutModel should exist", function () {
      expect(authModel.LogoutModel).to.exist;
    });
    it("LoginFormModel should exist", function () {
      expect(authModel.LoginFormModel).to.exist;
    });
    it("LoginModel should exist", function () {
      expect(authModel.LoginModel).to.exist;
    });
  });
});