/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.

 * User: sbrookes
 * Date: 02/10/13
 * Time: 3:35 PM
 *
 */
/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.

 * User: sbrookes
 * Date: 02/10/13
 * Time: 1:28 PM
 *
 */
define(function (require) {

  describe('UI Storefront Profile Module  ', function () {
    // Receipt Controller
    describe('Profile Controller',function(){
      var profileController = require('profile');
      describe("DefaultView",function(){
        var defaultView = new profileController.DefaultView();
        it('DefaultView should exist',function(){
          expect(defaultView).to.exist;
        });
      });
    });
    // Receipt Views
    describe('Profile Views',function(){
      var profileViews = require('modules/profile/profile.views');
      describe('DefaultLayout ', function () {
        var DefaultLayout = new profileViews.DefaultLayout();
        it('DefaultLayout should exist', function () {
          expect(DefaultLayout).to.exist;
        });
        it('DefaultLayout should have a profileTitleRegion region', function () {
          expect(DefaultLayout.profileTitleRegion).to.exist;
        });
        it('DefaultLayout should have a profileSummaryRegion region', function () {
          expect(DefaultLayout.profileSummaryRegion).to.exist;
        });
        it('DefaultLayout should have a profileSubscriptionSummaryRegion region', function () {
          expect(DefaultLayout.profileSubscriptionSummaryRegion).to.exist;
        });
        it('DefaultLayout should have a profileShippingAddressRegion region', function () {
          expect(DefaultLayout.profileShippingAddressRegion).to.exist;
        });
        it('DefaultLayout should have a profileBillingAddressRegion region', function () {
          expect(DefaultLayout.profileBillingAddressRegion).to.exist;
        });
        it('PurchaseConfirmationLayout should have a profilePaymentMethodRegion region', function () {
          expect(DefaultLayout.profilePaymentMethodRegion).to.exist;
        });
      });
      it('ProfileTitleView should exist', function () {
        expect(profileViews.ProfileTitleView).to.exist;
      });
      it('ProfileSubscriptionSummaryView should exist', function () {
        expect(profileViews.ProfileSubscriptionSummaryView).to.exist;
      });
      it('ProfileSummaryView should exist', function () {
        expect(profileViews.ProfileSummaryView).to.exist;
      });
      it('PaymentMethodsView should exist', function () {
        expect(profileViews.PaymentMethodsView).to.exist;
      });
    });
    // Receipt Models
    describe('Receipt Models',function(){
      var profileModels = require('modules/profile/profile.models');
      it("ProfileModel should exist",function(){
        expect(profileModels.ProfileModel).to.exist;
      });
    });
  });
});
