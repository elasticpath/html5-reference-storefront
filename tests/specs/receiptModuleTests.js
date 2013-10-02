/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.

 * User: sbrookes
 * Date: 02/10/13
 * Time: 1:28 PM
 *
 */
define(function (require) {

  describe('UI Storefront Receipt Module  ', function () {
    // Receipt Controller
    describe('Receipt Controller',function(){
      var receiptController = require('receipt');
      describe("DefaultView",function(){
        var defaultView = new receiptController.DefaultView();
        it('DefaultView should exist',function(){
          expect(defaultView).to.exist;
        });
      });
    });
    // Receipt Views
    describe('Receipt Views',function(){
      var receiptViews = require('modules/receipt/receipt.views');
      describe('PurchaseConfirmationLayout ', function () {
        var PurchaseConfirmationLayout = new receiptViews.PurchaseConfirmationLayout();
        it('PurchaseConfirmationLayout should exist', function () {
          expect(PurchaseConfirmationLayout).to.exist;
        });
        it('PurchaseConfirmationLayout should have a purchaseConfirmationRegion region', function () {
          expect(PurchaseConfirmationLayout.purchaseConfirmationRegion).to.exist;
        });
        it('PurchaseConfirmationLayout should have a confirmationLineItemsRegion region', function () {
          expect(PurchaseConfirmationLayout.confirmationLineItemsRegion).to.exist;
        });
        it('PurchaseConfirmationLayout should have a confirmationBillingAddressRegion region', function () {
          expect(PurchaseConfirmationLayout.confirmationBillingAddressRegion).to.exist;
        });
        it('PurchaseConfirmationLayout should have a confirmationPaymentMethodsRegion region', function () {
          expect(PurchaseConfirmationLayout.confirmationPaymentMethodsRegion).to.exist;
        });
      });
      it('PurchaseConfirmationBillingAddressView should exist', function () {
        expect(receiptViews.PurchaseConfirmationBillingAddressView).to.exist;
      });
      it('PurchaseConfirmationLineItemsContainerView should exist', function () {
        expect(receiptViews.PurchaseConfirmationLineItemsContainerView).to.exist;
      });
      it('PurchaseConfirmationView should exist', function () {
        expect(receiptViews.PurchaseConfirmationView).to.exist;
      });

    });
    // Receipt Models
    describe('Receipt Models',function(){
      var receiptModels = require('modules/receipt/receipt.models');
      it("PurchaseConfirmationModel should exist",function(){
        expect(receiptModels.PurchaseConfirmationModel).to.exist;
      });
    });
  });
});
