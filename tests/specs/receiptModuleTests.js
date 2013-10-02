/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.

 * User: sbrookes
 * Date: 02/10/13
 * Time: 1:28 PM
 *
 */
define(function (require) {

  describe('UI Storefront Receipt Module  ', function () {
    describe('Receipt Controller',function(){
      var receiptController = require('receipt');
      describe("DefaultView",function(){
        var defaultView = new receiptController.DefaultView();
        it('DefaultView should exist',function(){
          expect(defaultView).to.exist;
        });
      });

    });
  });

});
