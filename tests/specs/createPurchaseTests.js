/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 */
define(function (require) {
  var cartController = require('cart');
  var cartViews = require('cart.views');
  var cartModel = require('cart.models');
  var templates = require('text!modules/base/cart/base.cart.templates.html');

  describe('UI Storefront Create Purchase Tests', function () {

    before(function () {
      this.$fixture = $('<div data-region="appMain"></div>');
    });

    beforeEach(function () {
      this.$fixture.empty().appendTo($("#Fixtures"));
      this.$fixture.append(templates);
      this.cartCheckoutActionRegion = new Marionette.Region({
        el: '[data-region="cartCheckoutActionRegion"]'
      });

      this.view = new cartViews.DefaultView();
      this.cartCheckoutActionRegion.show(this.view);

    });

    afterEach(function () {
      //this.view.model.destroy();
    });

    after(function () {
      $("#Fixtures").empty();
    });




  });


});
