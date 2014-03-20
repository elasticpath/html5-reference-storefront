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
 * Functional Storefront Unit Test - Checkout Views
 */
define(function (require) {
  var ep = require('ep');

  describe('Checkout Module: Views: ', function () {
    var views = require('checkout.views');
    var template = require('text!modules/base/checkout/base.checkout.templates.html');

    before(function () {
      $("#Fixtures").append(template);
    });

    after(function () {
      $("#Fixtures").empty();
    });

    // FIXME missing tests shippingOptionsSelectorView, shippingOptionsEmptyView

    describe('ShippingOptionsCompositeView', function () {
      before(function () {
        this.view = new views.ShippingOptionsCompositeView();
        this.view.render();
      });

      it('should be an instance of Marionette CompositeView object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.CompositeView);
      });
      it('has valid templateHelpers', function () {
        expect(this.view.templateHelpers).to.be.ok;
      });
      it('has an emptyView', function () {
        expect(this.view.emptyView).to.be.ok;
      });
      it('defines correct itemViewContainer', function () {
        expect(this.view.itemViewContainer).to.be.ok;
        expect(this.view.$el.find(this.view.itemViewContainer)).to.be.length(1);
      });
      it('defines a target render element for activityIndicator', function () {
        expect(this.view.ui.activityIndicatorEl).to.be.ok;
        expect(this.view.$el.find(this.view.ui.activityIndicatorEl)).to.be.length(1);
      });
    });
  });
});