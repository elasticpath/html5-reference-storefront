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
 *
 * Functional Storefront Unit Test - Address Component Views
 */

define(function (require) {
  'use strict';

  var ep = require('ep');
  var Backbone = require('backbone');
  var Marionette = require('marionette');

  var addressView = require('address.views');
  var addressTemplate = require('text!modules/base/components/address/base.component.address.template.html');

  var StandardAddressModel = Backbone.Model.extend({
    defaults: {
      givenName: 'ben',
      familyName: 'boxer',
      streetAddress: '1234 HappyVille Road',
      extendedAddress: 'Siffon Ville',
      city: "Vancouver",
      region: "BC",
      country: "CA",
      postalCode: "v8v8v8",
      href: 'fakeUrlToPostAddressForm'
    }
  });

  describe('DefaultAddressFormView', function () {
    before(function () {
      // append templates
      $("#Fixtures").append(addressTemplate);
    });

    after(function () {
      $("#Fixtures").empty();
    });

    describe('renders', function () {
      before(function () {
        this.view = new addressView.DefaultAddressFormView();
        this.view.render();
      });

      after(function () {
        delete(this.view);
      });

      it('as an instance of Layout object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.Layout);
      });
      it('as correct HTML element', function () {
        expect(this.view.el.nodeName).to.equal('DIV');
      });
      it('8 child DOM elements (view content rendered)', function () {
        expect(this.view.el.childElementCount).to.equal(8);
      });

      describe('should have valid regions', function () {
        it('selectCountryRegion', function () {
          expect(this.view.countriesRegion).to.exist;
          expect(this.view.$el.find('[data-region="addressCountryRegion"]')).to.be.length(1);
        });
        it('selectRegionRegion', function () {
          expect(this.view.regionsRegion).to.exist;
          expect(this.view.$el.find('[data-region="addressRegionsRegion"]')).to.be.length(1);
        });
      });
    });

    describe('given a valid data model', function () {
      before(function () {
        this.model = new StandardAddressModel();
        this.view = new addressView.DefaultAddressFormView({model: this.model});
        this.view.render();

        this.validationFn = function (jQuerySelector, modelKey) {
          expect($(jQuerySelector, this.view.$el).val()).to.have.string(this.model.get(modelKey));
        };
      });

      after(function () {
        delete(this.model);
        delete(this.view);
      });

      it('renders all fields correctly', function () {
        this.validationFn('#FirstName', 'givenName');
        this.validationFn('#LastName', 'familyName');
        this.validationFn('#StreetAddress', 'streetAddress');
        this.validationFn('#ExtendedAddress', 'extendedAddress');
        this.validationFn('#City', 'city');
        this.validationFn('#PostalCode', 'postalCode');
      });
    });
  });

});