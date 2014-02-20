/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 * Functional Storefront Unit Test - Auth Views
 */
define(function (require) {
  var templates = require('text!modules/base/auth/base.auth.templates.html');
  var authView = require('auth.views');
  var authModel = require('auth.models');

  describe('Auth Module: Views', function () {
    before(function() {
      this.$fixture = $('<div data-region="authMenuItemRegion"></div>');
      this.$fixture.empty().appendTo($("#Fixtures"));
      this.$fixture.append(templates);
      this.authMenuItemRegion = new Marionette.Region({
        el: '[data-region="authMenuItemRegion"]'
      });

      this.view = new authView.DefaultView({
        model: new authModel.LoginFormModel()
      });
      this.authMenuItemRegion.show(this.view);
    });

    after(function() {
      $("#Fixtures").empty();
    });

    it("DefaultView should exist", function () {
      expect(authView.DefaultView).to.exist;
    });
    it("LoginFormView should exist", function () {
      expect(authView.LoginFormView).to.exist;
    });
    it("ProfileMenuView should exist", function () {
      expect(authView.ProfileMenuView).to.exist;
    });
    it("getLoginRequestModel should exist", function () {
      expect(authView.getLoginRequestModel).to.exist;
    });
    it("Login Button and hidden menu container should exist", function () {
      expect($('.btn-auth-menu').html()).to.exist;
      expect($('.auth-nav-container').html()).to.exist;
    });
  });
});