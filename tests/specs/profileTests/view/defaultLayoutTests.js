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
 * Functional Storefront Unit Test - Profile Views
 */
define(function (require) {
  var ep = require('ep');

  describe('Profile Module: Views', function () {
    var view = require('profile.views');
    var template = require('text!modules/base/profile/base.profile.templates.html');

    before(function () {
      $("#Fixtures").append(template);
    });

    after(function () {
      $("#Fixtures").empty();
    });

    describe('DefaultLayout', function () {
      before(function () {
        this.view = new view.DefaultLayout();
        this.view.render();
      });

      it('should be an instance of Marionette Layout object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.Layout);
      });
      it('render() should return the view object', function () {
        expect(this.view.render()).to.be.equal(this.view);
      });
      it('view contents are rendered', function () {
        expect(this.view.el.childElementCount).to.be.above(0);
      });

      describe('regions', function () {
        it('should have a profileTitleRegion region', function () {
          expect(this.view.profileTitleRegion).to.exist;
          expect(this.view.$el.find('[data-region="profileTitleRegion"]')).to.be.length(1);
        });
        it('should have a profilePersonalInfoRegion region', function () {
          expect(this.view.profilePersonalInfoRegion).to.exist;
          expect(this.view.$el.find('[data-region="profilePersonalInfoRegion"]')).to.be.length(1);
        });
        it('should have a profileSubscriptionSummaryRegion region', function () {
          expect(this.view.profileSubscriptionSummaryRegion).to.exist;
          expect(this.view.$el.find('[data-region="profileSubscriptionSummaryRegion"]')).to.be.length(1);
        });
        it('should have a profilePurchaseHistoryRegion region', function () {
          expect(this.view.profilePurchaseHistoryRegion).to.exist;
          expect(this.view.$el.find('[data-region="profilePurchaseHistoryRegion"]')).to.be.length(1);
        });
        it('should have a address region', function () {
          expect(this.view.profileAddressesRegion).to.exist;
          expect(this.view.$el.find('[data-region="profileAddressesRegion"]')).to.be.length(1);
        });
        it('should have a profilePaymentMethodsRegion region', function () {
          expect(this.view.profilePaymentMethodsRegion).to.exist;
          expect(this.view.$el.find('[data-region="paymentMethodsRegion"]')).to.be.length(1);
        });
      });
    });

    describe('ProfileTitleView', function () {
      before(function () {
        this.view = new view.ProfileTitleView();
        this.view.render();
      });

      it('should be an instance of Marionette ItemView object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.ItemView);
      });
      it('render() should return the view object', function () {
        expect(this.view.render()).to.be.equal(this.view);
      });
      /*it('view content is rendered', function() {
       // don't know how to test it yet
       });*/
    });

  });
});