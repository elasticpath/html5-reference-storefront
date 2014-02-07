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

  describe('DefaultAddressItemView', function () {
    before(function () {
      // append templates
      $("#Fixtures").append(addressTemplate);
    });

    after(function () {
      $("#Fixtures").empty();
    });

    describe('can render', function () {
      before(function () {
        this.view = new addressView.DefaultAddressItemView();
      });

      after(function () {
        delete(this.view);
      });

      it('should be an instance of ItemView object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.ItemView);
      });
      it('render() should return the view object', function () {
        expect(this.view.render()).to.be.equal(this.view);
      });
    });

    describe('renders correctly with all fields of address model', function () {
      before(function () {
        this.model = new StandardAddressModel();

        // setup view & render
        this.view = new addressView.DefaultAddressItemView({model: this.model});
        this.view.render();
      });

      after(function () {
        delete(this.model);
        delete(this.view);
      });

      it('should render as UL (unordered list)', function () {
        expect(this.view.el.nodeName).to.equal('UL');
      });
      it('should render 4 child DOM elements (view content rendered)', function () {
        expect(this.view.el.childElementCount).to.equal(4);
      });

      it('should render givenName and familyName', function () {
        expect($('[data-el-value="address.name"]', this.view.$el).text()).to.have.string('ben')
          .and.to.have.string('boxer');
      });
      it('should render street address', function () {
        expect($('[data-el-value="address.streetAddress"]', this.view.$el).text()).to.have.string('1234 HappyVille Road');
      });
      it('should render extended address', function () {
        expect($('[data-el-value="address.extendedAddress"]', this.view.$el).text()).to.have.string('Siffon Ville');
      });
      it('should render city', function () {
        expect($('[data-el-value="address.city"]', this.view.$el).text()).to.have.string('Vancouver');
      });
      it('should render region', function () {
        expect($('[data-el-value="address.region"]', this.view.$el).text()).to.have.string('BC');
      });
      it('should render country', function () {
        expect($('[data-el-value="address.country"]', this.view.$el).text()).to.have.string('CA');
      });
      it('should render postal code', function () {
        expect($('[data-el-value="address.postalCode"]', this.view.$el).text()).to.have.string('v8v8v8');
      });
    });

    describe('renders correctly with empty extendedAddress field', function () {
      before(function () {
        // setup model to have empty fields for testing
        this.model = new StandardAddressModel();
        this.model.set('extendedAddress', undefined);

        // setup view & render
        this.view = new addressView.DefaultAddressItemView({model: this.model});
        this.view.render();
      });

      after(function () {
        delete(this.model);
        delete(this.view);
      });

      it('should render as UL (unordered list)', function () {
        expect(this.view.el.nodeName).to.equal('UL');
      });
      it('should still render 4 child DOM elements', function () {
        expect(this.view.el.childElementCount).to.equal(4);
      });
      it('extended address is not rendered with any text', function () {
        expect($('[data-el-value="address.extendedAddress"]', this.view.$el).text()).to.have.length(0);
      });
      // should I and how to other content are rendered with value?
    });
  });

});