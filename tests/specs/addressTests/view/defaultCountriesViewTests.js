/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
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