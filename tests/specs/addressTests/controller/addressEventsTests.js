/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 * Functional Storefront Unit Test - Address Component Controller
 */
define(function (require) {
  'use strict';

  var ep = require('ep');
  var EventBus = require('eventbus');
  var Backbone = require('backbone');

  var EventTestFactory = require('testfactory.event');

  describe('Address Module General Events Tests', function () {
    require('address'); // load controller file
    var addressTemplate = require('text!modules/base/components/address/base.component.address.template.html');

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

    /* ==================== Select Country / Region ===================== */
    describe('responds to event: address.countrySelectionChanged',
      EventTestFactory.simpleEventTriggersEventTest('address.updateChosenCountryRequest', 'address.countrySelectionChanged'));

    describe('responds to event: address.regionSelectionChanged',
      EventTestFactory.simpleEventTriggersEventTest('address.updateChosenRegionRequest', 'address.regionSelectionChanged'));

    // FIXME address.updateChosenCountryRequest cannot test because cannot mock the collection
    // FIXME address.updateChosenRegionRequest cannot test because cannot mock the collection

  });

});