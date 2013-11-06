/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.

 * User: sbrookes
 * Date: 26/07/13
 * Time: 7:31 AM
 *
 */
define(function (require) {

  describe("Cart Module: Models", function () {
    var cartModel = require('cart.models');

    it("CartModel should exist", function () {
      expect(cartModel.CartModel).to.exist;
    });
    it("CartItemCollection should exist", function () {
      expect(cartModel.CartItemCollection).to.exist;
    });
    it("CartItemModel should exist", function () {
      expect(cartModel.CartItemModel).to.exist;
    });
  });

});
