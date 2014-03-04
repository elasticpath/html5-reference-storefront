/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 * Functional Storefront Unit Test - Address Component Views
 */

define(function (require) {
  'use strict';

  var ep = require('ep');
  var Backbone = require('backbone');

  describe('Address View Helpers Tests', function () {
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

    var CountryModel = Backbone.Model.extend({
      defaults: {
        displayName: 'China',
        name: 'CN',
        regionLink: 'http://ep-pd-ad-qa0.elasticpath.net:8080/cortex/geographies/campus/countries/inha=/regions',
        selected: true
      }
    });

    var RegionModel = Backbone.Model.extend({
      defaults: {
        displayName: 'Nunavut',
        name: 'NU',
        selected: true
      }
    });

    before(function () {
      // append templates
      $("#Fixtures").append(addressTemplate);
    });

    after(function () {
      $("#Fixtures").empty();
    });

    describe('function: formatMsgAsList', function () {
      before(function () {
        this.testFn = addressView.__test_only__.formatMsgAsList;
      });

      after(function () {
        delete(this.testFn);
      });

      it('format list into unordered list (ul)', function () {
        var errMsg = ['line1', 'line2', 'line3'];
        expect(this.testFn(errMsg)).to.have.string('<LI>line1</LI><LI>line2</LI><LI>line3</LI>');
      });

      it('format 1 line message as just text', function () {
        var errMsg = ['One line message.'];
        expect(this.testFn(errMsg)).to.be.equal(errMsg[0]);
      });
    });

    describe('function: translateErrorMessage', function () {
      before(function () {
        sinon.stub(ep.logger, 'warn');
        this.testFn = addressView.translateErrorMessage;
      });

      after(function () {
        delete(this.testFn);
        ep.logger.warn.restore();
      });

      it('translate recorded raw message to err message key', function () {
        var errMsg = 'family-name: must not be blank';
        // test doesn't load i18n locale list, thus return back the key
        expect(this.testFn(errMsg)).to
          .equal('addressForm.errorMsg.missingFamilyNameErrMsg');
      });

      it('does not produce duplicate err message keys', function () {
        var errMsg = 'family-name: may not be null; family-name: must not be blank';
        // test doesn't load i18n locale list, thus return back the key
        expect(this.testFn(errMsg)).to
          .eql('addressForm.errorMsg.missingFamilyNameErrMsg');
      });

      it('translate unrecorded raw message to generic error message key', function () {
        var errMsg = 'not a message recorded';
        // test doesn't load i18n locale list, thus return back the key
        expect(this.testFn(errMsg)).to
          .eql('addressForm.errorMsg.generalSaveAddressFailedErrMsg');
      });

      it('translate only recorded raw message, and log unrecorded error message', function () {
        var errMsg = 'family-name: must not be blank; not a message recorded';
        // test doesn't load i18n locale list, thus return back the key
        expect(this.testFn(errMsg)).to
          .eql('addressForm.errorMsg.missingFamilyNameErrMsg');
        expect(ep.logger.warn).to.be.calledWithMatch('not a message recorded');
      });

    });

    describe('helper function: getAddressFormValues', function () {
      before(function () {
        this.model = new StandardAddressModel();
        this.view = new addressView.DefaultAddressFormView({model: this.model});

        this.countryCollection = new Backbone.Collection([
          new CountryModel()
        ]);
        this.countryView = new addressView.DefaultCountriesView({collection: this.countryCollection});

        this.regionCollection = new Backbone.Collection([
          new RegionModel()
        ]);
        this.regionView = new addressView.DefaultRegionsView({collection: this.regionCollection});

        renderViewIntoFixture(this.view);
        $(this.view.regions.countriesRegion).append(this.countryView.render().$el);
        $(this.view.regions.regionsRegion).append(this.regionView.render().$el);

        this.form = addressView.getAddressFormValues();
      });

      after(function () {
        removeRenderedView();
        delete(this.model);
        delete(this.view);
        delete(this.form);
      });

      it('returns a Object', function () {
        expect(this.form).to.be.instanceOf(Object);
        expect(this.form).to.be.not.empty;
      });
      it('has address and name properties', function () {
        expect(this.form).to.have.property('address');
        expect(this.form).to.have.property('name');
      });
      it('saves address related form values into address property', function () {
        var addObj = this.form.address;
        expect(addObj).to.have.property('street-address', this.model.get('streetAddress'));
        expect(addObj).to.have.property('extended-address', this.model.get('extendedAddress'));
        expect(addObj).to.have.property('locality', this.model.get('city'));
        expect(addObj).to.have.property('region', this.regionCollection.at(0).get('name'));
        expect(addObj).to.have.property('country-name', this.countryCollection.at(0).get('name'));
        expect(addObj).to.have.property('postal-code', this.model.get('postalCode'));
      });
      it('saves name related form values into name property', function () {
        var nameObj = this.form.name;
        expect(nameObj).to.have.property('family-name', this.model.get('familyName'));
        expect(nameObj).to.have.property('given-name', this.model.get('givenName'));
      });
    });

    function renderViewIntoFixture(view) {
      view.render();
      $("#Fixtures").append('<div id="renderedView"></div>');
      $("#renderedView").append(view.$el);
    }

    function removeRenderedView() {
      $("#renderedView").remove();
    }
  });

});
