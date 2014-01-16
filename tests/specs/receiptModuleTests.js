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
      var receiptController = require('purchaseinfo');
      describe("DefaultView",function(){
//        var defaultView = new receiptController.DefaultView();
//        it('DefaultView should exist',function(){
//          expect(defaultView).to.exist;
//        });
      });
    });
    // Receipt Views
    describe('Receipt Views',function(){
      var receiptViews = require('purchaseinfo.views');
      describe('PurchaseInformationLayout ', function () {
        var PurchaseInformationLayout = new receiptViews.PurchaseInformationLayout();
        it('PurchaseInformationLayout should exist', function () {
          expect(PurchaseInformationLayout).to.exist;
        });
        it('PurchaseInformationLayout should have a purchaseSummaryRegion region', function () {
          expect(PurchaseInformationLayout.purchaseSummaryRegion).to.exist;
        });
        it('PurchaseInformationLayout should have a purchaseLineItemsRegion region', function () {
          expect(PurchaseInformationLayout.purchaseLineItemsRegion).to.exist;
        });
        it('PurchaseInformationLayout should have a purchaseBillingAddressRegion region', function () {
          expect(PurchaseInformationLayout.purchaseBillingAddressRegion).to.exist;
        });
        it('PurchaseInformationLayout should have a purchasePaymentMethodsRegion region', function () {
          expect(PurchaseInformationLayout.purchasePaymentMethodsRegion).to.exist;
        });
      });
      it('PurchaseBillingAddressView should exist', function () {
        expect(receiptViews.PurchaseBillingAddressView).to.exist;
      });
      it('PurchaseLineItemsView should exist', function () {
        expect(receiptViews.PurchaseLineItemsView).to.exist;
      });
      it('PurchaseSummaryView should exist', function () {
        expect(receiptViews.PurchaseSummaryView).to.exist;
      });

    });
    // Receipt Models
    describe('Receipt Models',function(){
      var receiptModels = require('purchaseinfo.models');
      it("PurchaseInfoModel should exist",function(){
        expect(receiptModels.PurchaseInfoModel).to.exist;
      });
    });
  });
});
