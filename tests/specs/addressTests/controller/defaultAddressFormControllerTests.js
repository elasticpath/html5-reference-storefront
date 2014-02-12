/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 * Functional Storefront Unit Test - Address Component
 */
define(function(require) {
  var ep = require('ep');
  var Backbone = require('backbone');
  var EventBus = require('eventbus');

  var EventTestHelpers = require('testhelpers.event');
  var ControllerTestHelper = require('testhelpers.defaultview');
  var controllerTestFactory = require('testfactory.controller');

  var controller = require('address');
  var view = require('address.views');
  var model = require('address.models');
  var template = require('text!modules/base/components/address/base.component.address.template.html');
  var dataJSON = require('text!../../../../tests/data/address.json');

  describe('DefaultAddressFormController', function () {
    before(function () {
      $("#Fixtures").append(template); // append templates

      // Create a sinon fakeServer object
      var parsedJSONData = JSON.parse(_.clone(dataJSON)).countries;
      var fakeUrl = model.CountryCollection.prototype.url;
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
        this.realCountryView = view.DefaultCountriesView;
        this.countryDouble = ControllerTestHelper.TestDouble();
        view.DefaultCountriesView = this.countryDouble.View;

        this.realRegionView = view.DefaultRegionsView;
        this.regionDouble = ControllerTestHelper.TestDouble();
        view.DefaultRegionsView = this.regionDouble.View;

        this.controller = controller.__test_only__.defaultAddressFormController(undefined);
        this.controller.render();
        this.controller.regionsRegion.on('show', function () {
          done();
        });
      });

      after(function () {
        delete(this.countryDouble);
        delete(this.regionDouble);

        view.DefaultCountriesView = this.realCountryView;
        view.DefaultRegionsView = this.realRegionView;
      });

      it('returns an instance of DefaultAddressFormView', function () {
        expect(this.controller).to.be.instanceOf(view.DefaultAddressFormView);
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
        this.countryDouble = ControllerTestHelper.TestDouble();
        view.DefaultCountriesView = this.countryDouble.View;
        this.regionDouble = ControllerTestHelper.TestDouble();
        view.DefaultRegionsView = this.regionDouble.View;

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

});