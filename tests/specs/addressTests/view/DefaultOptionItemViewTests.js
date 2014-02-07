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

  describe('Address Country/Region Option Views', function () {
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

    before(function () {
      // append templates
      $("#Fixtures").append(template);
    });

    after(function () {
      $("#Fixtures").empty();
    });

    describe('DefaultOptionItemView', function () {

      before(function () {
        this.model = new CountryModel();
        this.view = new view.__test_only__.defaultOptionsItemView({model: this.model});
        this.view.render();
      });

      after(function () {
        delete(this.model);
        delete(this.view);
      });

      it('renders as an instance of ItemView object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.ItemView);
      });
      it('renders as correct HTML element', function () {
        expect(this.view.el.nodeName).to.equal('OPTION');
      });
      it('renders the country display name', function () {
        expect(this.view.$el.text()).to.have.string(this.model.get('displayName'));
      });
      it('renders value attribute with country code', function () {
        expect(this.view.$el.attr('value')).to.be.equal(this.model.get('name'));
      });

      it('renders selected attribute when model has selected property', function () {
        expect(this.view.$el.attr('selected')).to.be.equal('selected');
      });
      it('does no render selected attribute when model has no selected property', function () {
        var thisModel = new CountryModel();
        thisModel.unset('selected');
        var thisView = new view.__test_only__.defaultOptionsItemView({model: thisModel});
        thisView.render();

        expect(thisView.$el.attr('selected')).to.be.undefined;
      });
    });

    describe('DefaultSelectionNoneOptionView', function () {
      before(function () {
        this.view = new view.__test_only__.defaultSelectionNoneOptionView();
        this.view.render();
      });

      after(function () {
        delete(this.model);
        delete(this.view);
      });

      it('renders as an instance of ItemView object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.ItemView);
      });
      it('renders as correct HTML element', function () {
        expect(this.view.el.nodeName).to.equal('OPTION');
      });
      it('renders string: ----', function () {
        expect(this.view.$el.text()).to.have.string('----');
      });
      it('renders nothing in value attribute', function () {
        expect(this.view.$el.attr('value')).to.be.empty;
      });
    });
  });

});