/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * Functional Storefront Unit Test - Address Component Controller
 */
define(function (require) {
  'use strict';

  var ep = require('ep');
  var EventBus = require('eventbus');
  var Backbone = require('backbone');
  var Mediator = require('mediator');

  var EventTestHelpers = require('testhelpers.event');
  var EventTestFactory = require('testfactory.event');
  var controllerTestFactory = require('testfactory.controller');

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

    describe('Responds to event: address.deleteConfirmYesBtnClicked', function () {
      before(function () {
        this.fakeOpts = {
          indicatorView: 'someValue'
        };
        sinon.stub(ep.ui, 'startActivityIndicator');
        sinon.spy(EventBus, 'trigger');
        sinon.spy($.modal, 'close');
        EventTestHelpers.unbind('address.deleteAddressRequest');

        EventBus.trigger('address.deleteConfirmYesBtnClicked', this.fakeOpts);
      });

      after(function () {
        ep.ui.startActivityIndicator.restore();
        EventBus.trigger.restore();
        EventTestHelpers.reset();
        $.modal.close.restore();
        delete(this.fakeOpts);
      });

      it('starts the activity indicator and triggers a delete address request', function () {
        expect($.modal.close).to.be.called;
        expect(ep.ui.startActivityIndicator).to.be.called;
        expect(EventBus.trigger).to.be.calledWithExactly('address.deleteConfirmYesBtnClicked', this.fakeOpts);
      });
    });

    describe('Responds to event: address.deleteAddressRequest', function () {
      describe('when AJAX request returns a 200 code', function() {
        before(function (done) {
          this.fakeUrl = '/fakeAddressUrl';
          sinon.spy(EventBus, 'trigger');
          this.server = controllerTestFactory.getFakeServer({
            method: 'DELETE',
            responseCode: 200,
            requestUrl: this.fakeUrl
          });

          EventTestHelpers.unbind('address.deleteAddressSuccess');
          EventBus.on('address.deleteAddressSuccess', function() {
            done();
          });

          EventBus.trigger('address.deleteAddressRequest', {
            href: this.fakeUrl,
            indicatorView: 'fakeView'
          });
        });

        after(function () {
          delete(this.fakeUrl);
          delete(this.server);
          EventBus.trigger.restore();
          EventTestHelpers.reset();
        });

        it('triggers the "address.deleteAddressSuccess" event', function() {
          expect(EventBus.trigger).to.be.calledWith('address.deleteAddressSuccess');
        });

      });
      describe('when AJAX request returns a 400 code', function() {
        before(function (done) {
          this.fakeUrl = '/fakeAddressUrl';
          sinon.spy(EventBus, 'trigger');
          sinon.stub(ep.logger, 'error');
          this.server = controllerTestFactory.getFakeServer({
            method: 'DELETE',
            responseCode: 400,
            requestUrl: this.fakeUrl
          });

          EventTestHelpers.unbind('address.deleteAddressFailed');
          EventBus.on('address.deleteAddressFailed', function() {
            done();
          });

          EventBus.trigger('address.deleteAddressRequest', {
            href: this.fakeUrl,
            indicatorView: 'fakeView'
          });
        });

        after(function () {
          delete(this.fakeUrl);
          delete(this.server);
          EventBus.trigger.restore();
          ep.logger.error.restore();
          EventTestHelpers.reset();
        });

        it('triggers the "address.deleteAddressFailed" event', function() {
          expect(EventBus.trigger).to.be.calledWith('address.deleteAddressFailed');
        });

      });
    });

    describe('Responds to event: address.deleteAddressConfirm', function () {
      before(function () {
        this.fakeObj = {
          someFakeProp: 'someFakeValue'
        };
        sinon.spy(EventBus, 'trigger');
        EventTestHelpers.unbind('layout.loadRegionContentRequest');

        EventBus.trigger('address.deleteAddressConfirm', this.fakeObj);
      });

      after(function () {
        EventBus.trigger.restore();
        EventTestHelpers.reset();
        delete(this.fakeObj);
      });

      it('triggers a loadRegionContentRequest for the delete confirmation model', function () {
        expect(EventBus.trigger).to.be.calledWithExactly('layout.loadRegionContentRequest',{
          region: 'appModalRegion',
          module: 'address',
          view: 'DefaultDeleteAddressConfirmationView',
          data: this.fakeObj
        });
      });
    });

    describe('Responds to event: address.deleteAddressFailed', function () {
      describe('when called with a reference to a view', function () {
        before(function () {
          sinon.stub(ep.ui, 'stopActivityIndicator');
          sinon.stub($.fn, 'toastmessage');
          this.indicatorView = 'someFakeValue';
          EventBus.trigger('address.deleteAddressFailed', this.indicatorView);
        });

        after(function () {
          ep.ui.stopActivityIndicator.restore();
          $().toastmessage.restore();
          delete(this.indicatorView);
        });

        it('displays a toast message and attempts to stop any activity indicator in that view', function () {
          expect($().toastmessage).to.be.called;
          expect(ep.ui.stopActivityIndicator).to.be.calledWithExactly(this.indicatorView);
        });
      });

      describe('when called without any parameter', function () {
        before(function () {
          sinon.stub(ep.ui, 'stopActivityIndicator');
          sinon.stub($.fn, 'toastmessage');
          EventBus.trigger('address.deleteAddressFailed');
        });

        after(function () {
          ep.ui.stopActivityIndicator.restore();
          $().toastmessage.restore();
        });

        it('displays a toast message but does not attempt to stop activity indicator', function () {
          expect($().toastmessage).to.be.called;
          expect(ep.ui.stopActivityIndicator).to.not.be.called;
        });
      });
    });

    describe('Responds to event: address.deleteAddressSuccess', function () {
      before(function () {
        sinon.stub(Mediator,'fire');
        EventBus.trigger('address.deleteAddressSuccess', 'fakeIndicator');
      });

      after(function () {
        Mediator.fire.restore();
      });

      it('fires the "deleteAddressComplete" mediator strategy', function () {
        expect(Mediator.fire).to.be.calledWithExactly('mediator.deleteAddressComplete', 'fakeIndicator');
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