/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.

 * User: sbrookes
 * Date: 04/09/13
 * Time: 2:48 PM
 *
 */
define(function(require) {
  var cartViews = require('modules/cart/cart.views');
  var cartModel = require('modules/cart/cart.models');
  var templates = require('text!modules/cart/cart.templates.html');

  describe('UI Storefront Create Purchase Tests', function() {

    before(function(){
      this.$fixture = $('<div data-region="appMain"></div>');
    });

    beforeEach(function(){
      this.$fixture.empty().appendTo($("#Fixtures"));
      this.$fixture.append(templates);
      this.cartCheckoutActionRegion = new Marionette.Region({
        el:'[data-region="cartCheckoutActionRegion"]'
      });

      this.view = new cartViews.DefaultLayout({
        model: new cartModel.CartModel()
      });
      this.cartCheckoutActionRegion.show(this.view);

    });

    afterEach(function(){
      this.view.model.destroy();
    });

    after(function(){
      $("#Fixtures").empty();
    });

    it("Cart Model Exists",function(){
      var cModel = new cartModel.CartModel();
      expect(cModel).to.exist;
    });


  });


});
