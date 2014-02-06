/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 * Functional Storefront Unit Test - Address Component Controller
 */
define(function (require) {
  'use strict';

  var ep = require('ep');
  var EventBus = require('eventbus');
  var Mediator = require('mediator');
  var Backbone = require('backbone');

  var EventTestFactory = require('testfactory.event');
  var EventTestHelpers = require('testhelpers.event');
  var DefaultViewTestHelper = require('testhelpers.defaultview');
  var controllerTestFactory = require('testfactory.controller');

  describe('Address Component: Controller', function () {
    var controller = require('address');
    var addressView = require('address.views');
    var addressModel = require('address.models');
    var addressTemplate = require('text!modules/base/components/address/base.component.address.template.html');
    var dataJSON = require('text!/tests/data/address.json');

    describe('DefaultCreateAddressView', function () {
      describe('when a user is logged in', function () {
        before(function () {
          $("#Fixtures").append(addressTemplate); // append templates

          sinon.stub(ep.app, 'isUserLoggedIn', function () {
            return true;
          });
          sinon.stub(Backbone.Model.prototype, 'fetch');
          sinon.stub(Backbone.Collection.prototype, 'fetch');

          this.controller = controller.DefaultCreateAddressView();
        });

        after(function () {
          $("#Fixtures").empty();
          ep.app.isUserLoggedIn.restore();
          Backbone.Collection.prototype.fetch.restore();
          Backbone.Model.prototype.fetch.restore();
        });

        it('returns an instance of DefaultCreateAddressLayout', function () {
          expect(this.controller).to.be.instanceOf(addressView.DefaultCreateAddressLayout);
        });
      });

      describe('when a user is not logged in', function () {
        before(function () {
          $("#Fixtures").append(addressTemplate); // append templates

          sinon.stub(ep.app, 'isUserLoggedIn', function () {
            return false;
          });
          sinon.stub(Mediator, 'fire');

          this.controller = controller.DefaultCreateAddressView();
        });

        after(function () {
          $("#Fixtures").empty();
          ep.app.isUserLoggedIn.restore();
          Mediator.fire.restore();
        });

        it('triggers a request to load the login form', function () {
          expect(Mediator.fire).to.be.calledWith('mediator.loadRegionContent', 'loginModal');
        });
      });
    });

    describe('DefaultEditAddressView', function () {
      before(function (done) {
        // Append templates to the DOM
        $("#Fixtures").append(addressTemplate);
        $("#Fixtures").append('<div id="testingRegion"></div>'); // append an region to render tested view into

        sinon.stub(Backbone.Model.prototype, 'fetch');
        sinon.stub(Backbone.Collection.prototype, 'fetch');

        var fakeGetLink = "/integrator/address/fakeUrl";
        this.view = controller.DefaultEditAddressView(fakeGetLink);

        // Short delay to allow the fake AJAX request to complete
        setTimeout(done, 200);
      });

      after(function () {
        $("#Fixtures").empty();
        Backbone.Model.prototype.fetch.restore();
        Backbone.Collection.prototype.fetch.restore();
      });

      it('returns an instance of DefaultEditAddressLayout', function () {
        expect(this.view).to.be.instanceOf(addressView.DefaultEditAddressLayout);
      });

      it('Model should have fetched info from server once', function () {
        expect(Backbone.Model.prototype.fetch).to.be.calledOnce;
      });
    });

    describe('DefaultAddressFormController', function () {
      before(function () {
        $("#Fixtures").append(addressTemplate); // append templates

        // Create a sinon fakeServer object
        var parsedJSONData = JSON.parse(_.clone(dataJSON)).countries;
        var fakeUrl = addressModel.CountryCollection.prototype.url;
        var fakeAddressResponse = parsedJSONData.response;
        this.server = controllerTestFactory.getFakeServer(fakeUrl, '', fakeAddressResponse);
      });

      after(function () {
        $("#Fixtures").empty();
        this.server.restore();
      });

      describe('given no model', function () {
        before(function (done) {
          // mock country and region view
          this.realCountryView = addressView.DefaultCountriesView;
          this.countryDouble = DefaultViewTestHelper.TestDouble();
          addressView.DefaultCountriesView = this.countryDouble.View;

          this.realRegionView = addressView.DefaultRegionsView;
          this.regionDouble = DefaultViewTestHelper.TestDouble();
          addressView.DefaultRegionsView = this.regionDouble.View;

          this.controller = controller.__test_only__.defaultAddressFormController(undefined);
          this.controller.render();
          this.controller.regionsRegion.on('show', function () {
            done();
          });
        });

        after(function () {
          delete(this.countryDouble);
          delete(this.regionDouble);

          addressView.DefaultCountriesView = this.realCountryView;
          addressView.DefaultRegionsView = this.realRegionView;
        });

        it('returns an instance of DefaultAddressFormView', function () {
          expect(this.controller).to.be.instanceOf(addressView.DefaultAddressFormView);
        });

        it('renders childView: DefaultCountriesView', function () {
          expect(this.countryDouble.wasRendered()).to.be.true;
        });
        it('passes a collection to DefaultCountriesView', function () {
          expect(this.countryDouble.hasACollection()).to.be.true;
        });
        it('renders childView: DefaultRegionsView', function () {
          expect(this.regionDouble.wasRendered()).to.be.true;
        });
      });

      describe('given a model', function () {
        var triggeredEvent = 'address.updateChosenCountryRequest';
        before(function (done) {
          // mock country and region view
          this.countryDouble = DefaultViewTestHelper.TestDouble();
          addressView.DefaultCountriesView = this.countryDouble.View;
          this.regionDouble = DefaultViewTestHelper.TestDouble();
          addressView.DefaultRegionsView = this.regionDouble.View;

          // isolate Event chain
          EventTestHelpers.unbind(triggeredEvent);
          sinon.spy(EventBus, 'trigger');

          this.model = new Backbone.Model({
            country: 'CA' // this country code should match 1 of the countries in response
          });
          this.controller = controller.__test_only__.defaultAddressFormController(this.model);
          this.controller.render();
          this.controller.regionsRegion.on('show', function () {
            done();
          });
        });

        after(function () {
          delete(this.countryDouble);
          delete(this.regionDouble);
          EventTestHelpers.reset();
          EventBus.trigger.restore();
        });

        it('passes the model to DefaultAddressFormView', function () {
          expect(this.controller.model).to.be.ok;
        });
        it('triggers ' + triggeredEvent, function () {
          expect(EventBus.trigger).to.be.calledWith(triggeredEvent);
        });
      });
    });

    describe('responds to event: address.loadAddressesViewRequest', function () {
      before(function () {
        sinon.spy(EventBus, 'trigger');
      });

      after(function () {
        EventBus.trigger.restore();
      });

      it("registers correct event listener", function () {
        expect(EventBus._events['address.loadAddressesViewRequest']).to.be.length(1);
      });

      describe('handles valid data', function () {
        before(function () {
          $("#Fixtures").append(addressTemplate); // append templates
          $("#Fixtures").append('<div id="testingRegion"></div>'); // append an region to render tested view into

          EventBus.trigger('address.loadAddressesViewRequest', {
            region: new Marionette.Region({el: '#testingRegion'}),
            model: new Backbone.Model()
          });
        });

        after(function () {
          $('#Fixtures').empty();
        });

        it("by rendering DefaultAddressItemView into provided region", function () {
          expect($('#testingRegion ul[class="address-container"]')).to.be.length(1);
        });
      });

      describe('handles invalid data', function () {
        before(function () {
          this.errorlogger = sinon.stub(ep.logger, 'error');
          EventBus.trigger('address.loadAddressesViewRequest', undefined);
        });

        after(function () {
          ep.logger.error.restore();
        });

        it("by logging the error in console", function () {
          expect(this.errorlogger).to.be.calledWithMatch('failed to load Address View');
        });
      });
    });

    /* ==================== Create / Update Address ===================== */
    describe('responds to event: address.createAddressBtnClicked',
      simpleAddressBtnClickedEventTest('address.submitAddressRequest', 'address.createAddressBtnClicked', 'POST'));

    describe('responds to event: address.editAddressBtnClicked',
      simpleAddressBtnClickedEventTest('address.submitAddressRequest', 'address.editAddressBtnClicked', 'PUT'));

    describe('responds to event: address.submitAddressRequest', function () {
      var actionLink = 'linkToPostAddressForm';
      var method = 'POST';
      var fakeForm = {address: 'address properties'};

      before(function () {
        sinon.stub(addressView, 'getAddressFormValues', function () {
          return fakeForm;
        });
        sinon.stub(ep.io, 'ajax');
        sinon.stub(ep.logger, 'error');
        EventBus.trigger('address.submitAddressRequest', method, actionLink);

        // get first argument passed to ep.io.ajax,
        // args[0] gets arguments passed in the first time ep.io.ajax is called
        // args[0][0] gets the first argument of the first time arguments
        this.ajaxArgs = ep.io.ajax.args[0][0];
      });

      after(function () {
        addressView.getAddressFormValues.restore();
        ep.io.ajax.restore();
        ep.logger.error.restore();
      });

      it('registers correct event listener', function () {
        expect(EventBus._events['address.submitAddressRequest']).to.be.length(1);
      });
      it('should get an address form model', function () {
        expect(addressView.getAddressFormValues).to.be.calledOnce;
      });

      describe('should submit new address to Cortex', function () {
        it('exactly once', function () {
          expect(ep.io.ajax).to.be.calledOnce;
        });
        it('with a valid request', function () {
          expect(this.ajaxArgs.type).to.be.string('POST');
          expect(this.ajaxArgs.contentType).to.be.string('application/json');
          expect(this.ajaxArgs.data).to.be.equal(JSON.stringify(addressView.getAddressFormValues()));
          expect(this.ajaxArgs.url).to.be.equal(actionLink);
        });
        it('with required callback functions', function () {
          expect(this.ajaxArgs.success).to.exist;
          expect(this.ajaxArgs.error).to.exist;
        });
      });

      describe('and on success',
        EventTestFactory.simpleTriggerEventTest('address.submitAddressFormSuccess', function () {
          var testEventName = 'address.submitAddressFormSuccess';

          it('should trigger ' + testEventName + ' event', function () {
            this.ajaxArgs.success(); // trigger callback function on ajax call success
            expect(EventBus.trigger).to.be.calledWithExactly(testEventName);
          });
        }));

      describe('and on failure with 400 status code',
        EventTestFactory.simpleTriggerEventTest('address.submitAddressFormFailed.invalidFields', function () {
          var testEventName = 'address.submitAddressFormFailed.invalidFields';

          it('should trigger ' + testEventName + ' event', function () {
            ep.logger.error.reset();  // make sure other test's logger call doesn't interfere
            this.ajaxArgs.error({
              status: 400,
              responseText: 'some error message'
            });
            expect(EventBus.trigger).to.be.calledWithExactly(testEventName, 'some error message');
            expect(ep.logger.error).to.be.calledOnce
              .and.to.be.calledWithMatch('400');
          });
        }));

      describe('and on failure with any other status code',
        EventTestFactory.simpleTriggerEventTest('address.submitAddressFormFailed', function () {
          var testEventName = 'address.submitAddressFormFailed';

          it('should trigger ' + testEventName + ' event', function () {
            ep.logger.error.reset();  // make sure other test's logger call doesn't interfere
            this.ajaxArgs.error({
              status: 'any error code'
            });
            expect(EventBus.trigger).to.be.calledWithExactly(testEventName);
            expect(ep.logger.error).to.be.calledOnce
              .and.to.be.calledWithMatch('any error code');
          });
        }));
    });

    describe('responds to event: address.submitAddressFormFailed', function () {
      before(function () {
        sinon.stub(addressView, 'displayAddressFormErrorMsg');
        EventBus.trigger('address.submitAddressFormFailed');
      });

      after(function () {
        addressView.displayAddressFormErrorMsg.restore();
      });

      it('called method from view to display error message', function () {
        expect(addressView.displayAddressFormErrorMsg).to.be.calledOnce;
      });
    });

    describe('responds to event: address.submitAddressFormFailed.invalidFields', function () {
      var errMsg = 'some error message';
      before(function () {
        sinon.stub(addressView, 'translateErrorMessage');
        sinon.stub(addressView, 'displayAddressFormErrorMsg');
        EventBus.trigger('address.submitAddressFormFailed.invalidFields', errMsg);
      });

      after(function () {
        addressView.translateErrorMessage.restore();
        addressView.displayAddressFormErrorMsg.restore();
      });

      it('called methods from view to translate error message', function () {
        expect(addressView.translateErrorMessage).to.be.calledWith(errMsg);
      });
      it('called methods from view to display error message', function () {
        expect(addressView.displayAddressFormErrorMsg).to.be.calledWith(addressView.translateErrorMessage(errMsg));
      });
    });

    describe('responds to event: address.submitAddressFormSuccess', function () {
      before(function () {
        sinon.stub(Mediator, 'fire');
        EventBus.trigger('address.submitAddressFormSuccess');
      });

      after(function () {
        Mediator.fire.restore();
      });

      it('registers correct event listener', function () {
        expect(EventBus._events['address.submitAddressFormSuccess']).to.have.length(1);
      });
      it('calls correct mediator strategy to notify storefront address form module is complete', function () {
        expect(Mediator.fire).to.be.calledWithExactly('mediator.addressFormComplete');
      });
    });

    describe('responds to event: address.cancelBtnClicked', function () {
      before(function () {
        sinon.stub(Mediator, 'fire');
        EventBus.trigger('address.cancelBtnClicked');
      });

      after(function () {
        Mediator.fire.restore();
      });
      it('registers correct event listener', function () {
        expect(EventBus._events['address.cancelBtnClicked']).to.have.length(1);
      });
      it('calls correct mediator strategy to notify storefront address form module is complete: ', function () {
        expect(Mediator.fire).to.be.calledWithExactly('mediator.addressFormComplete');
      });
    });

    /* ==================== Select Country / Region ===================== */
    describe('responds to event: address.countrySelectionChanged',
      EventTestFactory.simpleEventTriggersEventTest('address.updateChosenCountryRequest', 'address.countrySelectionChanged'));

    describe('responds to event: address.regionSelectionChanged',
      EventTestFactory.simpleEventTriggersEventTest('address.updateChosenRegionRequest', 'address.regionSelectionChanged'));

    // FIXME address.updateChosenCountryRequest cannot test because cannot mock the collection
    // FIXME address.updateChosenRegionRequest cannot test because cannot mock the collection

    function simpleAddressBtnClickedEventTest(expected, listener, method) {
      return EventTestFactory.simpleTriggerEventTest(expected, function () {

        it("registers correct event listener", function () {
          expect(EventBus._events[listener]).to.have.length(1);
        });

        it('should trigger event: ' + expected, function () {
          var href = 'fakeAddressSubmitHref';
          EventBus.trigger(listener, href);

          expect(EventBus.trigger).to.be.calledWith(expected, method, href);
        });
      });
    }
  });

});