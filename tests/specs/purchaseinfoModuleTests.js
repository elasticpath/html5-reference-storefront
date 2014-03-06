/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
