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

  describe('Address Component: Views', function () {
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

    var NoneOptionModel = Backbone.Model.extend({
      defaults: {
        displayName: '----',
        name: ''
      }
    });

    before(function () {
      // append templates
      $("#Fixtures").append(addressTemplate);
    });

    after(function () {
      $("#Fixtures").empty();
    });

    describe('DefaultAddressItemView', function () {

      describe('can render', function () {
        before(function () {
          this.view = new addressView.DefaultAddressItemView({model: this.model});
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

    describe('DefaultCreateAddressLayout', function () {
      before(function () {
        this.view = new addressView.DefaultCreateAddressLayout();
        this.view.render();
      });

      after(function () {
        delete(this.model);
        delete(this.view);
      });

      describe('should have valid regions', function () {
        it('addressFormRegion', function () {
          expect(this.view.addressFormRegion).to.exist;
          expect(this.view.$el.find('[data-region="componentAddressFormRegion"]')).to.be.length(1);
        });
        it('addressFeedbackMsgRegion', function () {
          expect(this.view.addressFeedbackMsgRegion).to.exist;
          expect(this.view.$el.find('[data-region="componentAddressFeedbackRegion"]')).to.be.length(1);
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

    describe('DefaultEditAddressLayout', function () {
      before(function () {
        this.model = new StandardAddressModel();
        this.view = new addressView.DefaultEditAddressLayout({model: this.model});
        this.view.render();
      });

      after(function () {
        delete(this.model);
        delete(this.view);
      });

      describe('should have valid regions', function () {
        it('addressFormRegion', function () {
          expect(this.view.addressFormRegion).to.exist;
          expect(this.view.$el.find('[data-region="componentAddressFormRegion"]')).to.be.length(1);
        });
        it('addressFeedbackMsgRegion', function () {
          expect(this.view.addressFeedbackMsgRegion).to.exist;
          expect(this.view.$el.find('[data-region="componentAddressFeedbackRegion"]')).to.be.length(1);
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
          expect(this.view.$el.find('button[data-el-label="addressForm.edit"]')).to.be.length(1);
        });
        it('the "cancel" button', function () {
          expect(this.view.$el.find('button[data-el-label="addressForm.cancel"]')).to.be.length(1);
        });
      });

      describe('edit address button clicked',
        EventTestFactory.simpleBtnClickTest('address.editAddressBtnClicked', '[data-el-label="addressForm.edit"]'));

      describe('cancel address form button clicked',
        EventTestFactory.simpleBtnClickTest('address.cancelBtnClicked', '[data-el-label="addressForm.cancel"]'));
    });

    describe('DefaultAddressFormView', function () {

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

    describe('DefaultCountriesView', function () {

      before(function () {
        this.model = new CountryModel();
        this.view = new addressView.__test_only__.defaultCountryItemView({model: this.model});
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
        var thisView = new addressView.__test_only__.defaultCountryItemView({model: thisModel});
        thisView.render();

        expect(thisView.$el.attr('selected')).to.be.undefined;
      });
    });

    describe('DefaultCountriesView', function () {

      before(function () {
        this.collection = new Backbone.Collection([
          new CountryModel(),
          new CountryModel()
        ]);
        this.view = new addressView.DefaultCountriesView({collection: this.collection});
        this.view.render();
      });

      after(function () {
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

    describe('DefaultRegionItemView', function () {

      before(function () {
        this.model = new RegionModel();
        this.view = new addressView.__test_only__.defaultRegionItemView({model: this.model});
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
      it('renders the display name', function () {
        expect(this.view.$el.text()).to.have.string(this.model.get('displayName'));
      });
      it('renders value attribute with region code', function () {
        expect(this.view.$el.attr('value')).to.be.equal(this.model.get('name'));
      });

      it('renders selected attribute when model has selected property', function () {
        expect(this.view.$el.attr('selected')).to.be.equal('selected');
      });
      it('does no render selected attribute when model has no selected property', function () {
        var thisModel = new RegionModel();
        thisModel.unset('selected');
        var thisView = new addressView.__test_only__.defaultRegionItemView({model: thisModel});
        thisView.render();

        expect(thisView.$el.attr('selected')).to.be.undefined;
      });
    });

    describe('DefaultSelectionNoneOptionView', function () {
      before(function () {
        this.view = new addressView.__test_only__.defaultSelectionNoneOptionView();
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

    describe('DefaultRegionsView', function () {

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
        it('and has an emptyView', function() {
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

        describe('region selection changed',
          EventTestFactory.simpleSelectionChangedTest('address.regionSelectionChanged', '#Region'));
      });

      describe('onRender', function () {
        beforeEach(function () {
          sinon.spy($.prototype, 'hide');
          sinon.spy($.prototype, 'show');
        });

        afterEach(function () {
          $.prototype.hide.restore();
          $.prototype.show.restore();
        });

        it('hides the regionsRegion when collection return empty from server', function () {
          var collection = new Backbone.Collection([
            // RegionCollection.parse will insert noneOption when collection return empty from server
            new NoneOptionModel()
          ]);

          var view = new addressView.DefaultRegionsView({collection: collection});
          view.render();

          expect($.prototype.hide).to.be.calledOnce;
        });

        it('does not hide regionsRegion when no country is selected', function () {
          //
          var collection = new Backbone.Collection([
            // when no country is selected, regionCollection will not fetch, and call parse, thus returns
            // completely empty collection
          ]);

          var view = new addressView.DefaultRegionsView({collection: collection});
          view.render();

          expect($.prototype.hide).to.be.not.called;
          expect($.prototype.show).to.be.called;
        });

      });

    });

    describe('helper function: displayAddressFormErrorMsg', function () {
      var errMsg = 'Address form error message to be displayed';
      before(function () {
        this.view = new addressView.DefaultCreateAddressLayout();
        renderViewIntoFixture(this.view);

        this.feedbackRegion = $('#renderedView [data-region="componentAddressFeedbackRegion"]');
        // check feedback region is empty, make sure previous results isn't interfering
        expect(this.feedbackRegion.text()).to.be.string('');
        addressView.displayAddressFormErrorMsg(errMsg);
      });

      after(function () {
        delete(this.feedbackRegion);
        delete(this.view);
        removeRenderedView();
      });

      it('displays error message in errorFeedbackRegion', function () {
        expect(this.feedbackRegion.text()).to.be.string(errMsg);
      });
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