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

  var addressView = require('address.views');
  var addressTemplate = require('text!modules/base/components/address/base.component.address.template.html');

  var NoneOptionModel = Backbone.Model.extend({
    defaults: {
      displayName: '----',
      name: ''
    }
  });

  describe('DefaultRegionsView', function () {

    before(function () {
      // append templates
      $("#Fixtures").append(addressTemplate);
    });

    after(function () {
      $("#Fixtures").empty();
    });

    describe('renders', function () {
      before(function () {
        this.collection = new Backbone.Collection();
        this.view = new addressView.DefaultRegionsView({collection: this.collection});
        this.view.render();
      });

      after(function () {
        delete(this.collection);
        delete(this.view);
      });

      it('as an instance of CompositeView object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.CompositeView);
      });
      it('as correct HTML element', function () {
        expect(this.view.el.nodeName).to.equal('DIV');
      });
      it('a label element', function () {
        expect(this.view.$el.find('label[for="Region"]')).to.be.length(1);
      });
      it('a select element', function () {
        expect(this.view.$el.find('select[id="Region"]')).to.be.length(1);
      });
      it('and has an emptyView', function () {
        expect(this.view.emptyView).to.be.ok;
      });
      it('and defines a target render element for activityIndicator', function () {
        expect(this.view.ui.activityIndicatorEl).to.be.ok;
      });
      it('and re-renders on collection change', function () {
        expect(this.view.collectionEvents.change).to.be.equal('render');
      });
      it('and re-renders when collection reset', function () {
        expect(this.view.collectionEvents.reset).to.be.equal('render');
      });
      it('and has a ui hash element for the region select drop-down', function () {
        expect(this.view.ui.regionSelect).to.be.instanceOf(jQuery);
      });

      describe('region selection changed',
        EventTestFactory.simpleSelectionChangedTest('address.regionSelectionChanged', '#Region'));
    });

    describe('onRender', function () {
      beforeEach(function () {
        sinon.spy($.prototype, 'slideUp');
        sinon.spy($.prototype, 'slideDown');
      });

      afterEach(function () {
        $.prototype.slideUp.restore();
        $.prototype.slideDown.restore();
      });

      it('hides the regionsRegion when collection return empty from server', function () {
        var collection = new Backbone.Collection([
          // RegionCollection.parse will insert noneOption when collection return empty from server
          new NoneOptionModel()
        ]);

        var view = new addressView.DefaultRegionsView({collection: collection});
        view.render();

        expect($.prototype.slideUp).to.be.calledOnce;
      });

      it('does not hide regionsRegion when no country is selected', function () {
        //
        var collection = new Backbone.Collection([
          // when no country is selected, regionCollection will not fetch, and call parse, thus returns
          // completely empty collection
        ]);

        var view = new addressView.DefaultRegionsView({collection: collection});
        view.render();

        expect($.prototype.slideUp).to.be.not.called;
        expect($.prototype.slideDown).to.be.called;
      });

    });

  });


});