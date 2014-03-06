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
  var EventTestFactory = require('testfactory.event');

  var view = require('address.views');
  var template = require('text!modules/base/components/address/base.component.address.template.html');

  var CountryModel = Backbone.Model.extend({
    defaults: {
      displayName: 'China',
      name: 'CN',
      regionLink: 'http://ep-pd-ad-qa0.elasticpath.net:8080/cortex/geographies/campus/countries/inha=/regions',
      selected: true
    }
  });

  describe('DefaultCountriesView', function () {

    before(function () {
      // append templates
      $("#Fixtures").append(template);

      this.collection = new Backbone.Collection([
        new CountryModel(),
        new CountryModel()
      ]);
      this.view = new view.DefaultCountriesView({collection: this.collection});
      this.view.render();
    });

    after(function () {
      $("#Fixtures").empty();
      delete(this.collection);
      delete(this.view);
    });

    it('renders as an instance of CompositeView object', function () {
      expect(this.view).to.be.an.instanceOf(Marionette.CompositeView);
    });
    it('renders as correct HTML element', function () {
      expect(this.view.el.nodeName).to.equal('DIV');
    });
    it('renders a label element', function () {
      expect(this.view.$el.find('label[for="Country"]')).to.be.length(1);
    });
    it('renders a select element', function () {
      expect(this.view.$el.find('select[id="Country"]')).to.be.length(1);
    });
    it('re-renders on collection change', function () {
      expect(this.view.collectionEvents.change).to.be.equal('render');
    });
    it('re-renders when collection reset', function () {
      expect(this.view.collectionEvents.reset).to.be.equal('render');
    });

    describe('country selection changed',
      EventTestFactory.simpleSelectionChangedTest('address.countrySelectionChanged', '#Country'));
  });


});