/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.
 *
 * Functional Storefront Unit Test - Address Component Views
 */
define(function (require) {
  var ep = require('ep');
  var Backbone = require('backbone');
  var EventTestFactory = require('EventTestFactory');

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
        postalCode: "v8v8v8"
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
          this.model.destroy();
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
        it('should render country', function () {
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
          this.model.destroy();
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


    describe('DefaultAddressFormView', function () {

      describe('renders', function () {
        before(function () {
          this.view = new addressView.DefaultAddressFormView();
          this.view.render();
        });

        it('as an instance of ItemView object', function () {
          expect(this.view).to.be.an.instanceOf(Marionette.ItemView);
        });
        it('as ul (unordered list) element', function () {
          expect(this.view.el.nodeName).to.equal('DIV');
        });
        it('8 child DOM elements (view content rendered)', function () {
          expect(this.view.el.childElementCount).to.equal(8);
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
          this.model.destroy();
        });

        it('renders all fields correctly', function () {
          this.validationFn('#FirstName', 'givenName');
          this.validationFn('#LastName', 'familyName');
          this.validationFn('#StreetAddress', 'streetAddress');
          this.validationFn('#ExtendedAddress', 'extendedAddress');
          this.validationFn('#City', 'city');
          this.validationFn('#Region', 'region');
          this.validationFn('#Country', 'country');
          this.validationFn('#PostalCode', 'postalCode');
        });
      });
    });

    describe('DefaultCreateAddressLayout', function () {
      before(function () {
        this.view = new addressView.DefaultCreateAddressLayout();
        this.view.render();
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
        removeRenderedView();
      });

      it('displays error message in errorFeedbackRegion', function () {
        expect(this.feedbackRegion.text()).to.be.string(errMsg);
      });
    });

    describe('function: formatMsgAsList', function() {
      before(function() {
        this.testFn = addressView.testVariables.formatMsgAsList;
      });

      after(function() {});

      it('format list into unordered list (ul)', function() {
        var errMsg = ['line1', 'line2', 'line3'];
        expect(this.testFn(errMsg)).to.have.string('<LI>line1</LI><LI>line2</LI><LI>line3</LI>');
      });

      it('format 1 line message as just text', function() {
        var errMsg = ['One line message.'];
        expect(this.testFn(errMsg)).to.be.equal(errMsg[0]);
      });
    });

    describe('function: translateErrorMessage', function() {
      before(function() {
        sinon.stub(ep.logger, 'warn');
        this.testFn = addressView.translateErrorMessage;
      });

      after(function() {
        ep.logger.warn.restore();
      });

      it('translate recorded raw message to err message key', function() {
        var errMsg = 'family-name: must not be blank';
        // test doesn't load i18n locale list, thus return back the key
        expect(this.testFn(errMsg)).to
          .equal('addressForm.errorMsg.missingFamilyNameErrMsg');
      });

      it('does not produce duplicate err message keys', function() {
        var errMsg = 'family-name: may not be null; given-name: may not be null';
        // test doesn't load i18n locale list, thus return back the key
        expect(this.testFn(errMsg)).to
          .eql('addressForm.errorMsg.generalSaveAddressFailedErrMsg');
      });

      it('translate unrecorded raw message to generic error message key', function() {
        var errMsg = 'not a message recorded';
        // test doesn't load i18n locale list, thus return back the key
        expect(this.testFn(errMsg)).to
          .eql('addressForm.errorMsg.generalSaveAddressFailedErrMsg');
      });

      it('translate only recorded raw message, and log unrecorded error message', function() {
        var errMsg = 'family-name: must not be blank; not a message recorded';
        // test doesn't load i18n locale list, thus return back the key
        expect(this.testFn(errMsg)).to
          .eql('addressForm.errorMsg.missingFamilyNameErrMsg');
        expect(ep.logger.warn).to.be.calledWithMatch('not a message recorded');
      });

    });

    describe('helper function: getAddressForm', function() {
      before(function() {
        this.model = new StandardAddressModel();
        this.view = new addressView.DefaultAddressFormView({model: this.model});
        renderViewIntoFixture(this.view);

        this.form = addressView.getAddressForm();
      });

      after(function() {
        removeRenderedView();
        this.model.destroy();
      });

      it('returns a Object', function() {
        expect(this.form).to.be.instanceOf(Object);
      });
      it('has address and name properties', function() {
        expect(this.form).to.have.property('address');
        expect(this.form).to.have.property('name');
      });
      it('saves address related form values into address property', function() {
        var addObj = this.form.address;
        expect(addObj).to.have.property('street-address', this.model.get('streetAddress'));
        expect(addObj).to.have.property('extended-address', this.model.get('extendedAddress'));
        expect(addObj).to.have.property('locality', this.model.get('city'));
        expect(addObj).to.have.property('region', this.model.get('region'));
        expect(addObj).to.have.property('country-name', this.model.get('country'));
        expect(addObj).to.have.property('postal-code', this.model.get('postalCode'));
      });
      it('saves name related form values into name property', function() {
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