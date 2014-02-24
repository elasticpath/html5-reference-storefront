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

  describe('DefaultCreateAddressLayout', function () {
    before(function () {
      $("#Fixtures").append(addressTemplate);

      this.model = new StandardAddressModel();  // only care about href attribute
      this.view = new addressView.DefaultCreateAddressLayout({model: this.model});
      this.view.render();
    });

    after(function () {
      $("#Fixtures").empty();
      delete(this.model);
      delete(this.view);
    });

    describe('should have valid regions and ui elements', function () {
      it('addressFormRegion', function () {
        expect(this.view.addressFormRegion).to.exist;
        expect(this.view.$el.find('[data-region="componentAddressFormRegion"]')).to.be.length(1);
      });
      it('addressFeedbackMsgRegion', function () {
        expect(this.view.ui.addressFeedbackMsgRegion).to.exist;
        expect(this.view.$el.find(this.view.ui.addressFeedbackMsgRegion)).to.be.length(1);
      });
    });

    describe('renders', function () {
      it('as an instance of Layout object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.Layout);
      });
      it('as div element', function () {
        expect(this.view.el.nodeName).to.equal('DIV');
      });
      it('some child DOM elements (view content rendered)', function () {
        expect(this.view.el.childElementCount).to.be.above(0);
      });
      it('the "save" button', function () {
        expect(this.view.$el.find('button[data-el-label="addressForm.create"]')).to.be.length(1);
      });
      it('the "cancel" button', function () {
        expect(this.view.$el.find('button[data-el-label="addressForm.cancel"]')).to.be.length(1);
      });
    });

    describe('create address button clicked',
      EventTestFactory.simpleBtnClickTest('address.createAddressBtnClicked', '[data-el-label="addressForm.create"]'));

    describe('cancel address form button clicked',
      EventTestFactory.simpleBtnClickTest('address.cancelBtnClicked', '[data-el-label="addressForm.cancel"]'));
  });

});