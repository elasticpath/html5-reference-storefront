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
 * Functional Storefront Unit Test - Payment Component Controller
 */
define(function (require) {
  var EventBus = require('eventbus');
  var Backbone = require('backbone');
  var Mediator = require('mediator');
  var ep = require('ep');
  var utils = require('utils');
  var controllerTestFactory = require('testfactory.controller');
  var EventTestHelpers = require('testhelpers.event');

  describe('Payment Controller:', function () {
    describe('Delete Payment Events Tests', function () {
      require('payment');

      var fakeOptions = {
        href: 'fakeActionLink',
        indicatorView: 'fakeIndicator'
      };

      describe("Responds to event: payment.deletePaymentConfirm", function() {
        before(function () {
          sinon.spy(EventBus, 'trigger');
          EventTestHelpers.unbind('layout.loadRegionContentRequest');

          EventBus.trigger('payment.deletePaymentConfirm', fakeOptions);
        });

        after(function () {
          EventBus.trigger.restore();
          EventTestHelpers.reset();
        });

        it('triggers a loadRegionContentRequest for the delete confirmation model', function () {
          expect(EventBus.trigger).to.be.calledWithExactly('layout.loadRegionContentRequest',{
            region: 'appModalRegion',
            module: 'payment',
            view: 'DefaultDeletePaymentConfirmationView',
            data: fakeOptions
          });
        });
      });

      describe('Responds to event: payment.deleteConfirmYesBtnClicked', function () {
        before(function () {
          sinon.stub(ep.ui, 'startActivityIndicator');
          sinon.spy(EventBus, 'trigger');
          sinon.spy($.modal, 'close');
          EventTestHelpers.unbind('payment.deletePaymentRequest');

          EventBus.trigger('payment.deleteConfirmYesBtnClicked', fakeOptions);
        });

        after(function () {
          ep.ui.startActivityIndicator.restore();
          EventBus.trigger.restore();
          EventTestHelpers.reset();
          $.modal.close.restore();
        });

        it('starts the activity indicator', function() {
          expect(ep.ui.startActivityIndicator).to.be.called;
        });

        it('and closes the confirmation modal window', function() {
          expect($.modal.close).to.be.called;
        });

        it('and triggers a delete payment request', function () {
          expect(EventBus.trigger).to.be.calledWithExactly('payment.deletePaymentRequest', fakeOptions);
        });
      });

      describe('Responds to event: payment.deletePaymentRequest', function () {
        describe('when AJAX request returns a 200 code', function() {
          var triggeredEvent = 'payment.deletePaymentSuccess';
          before(function (done) {
            sinon.spy(EventBus, 'trigger');
            this.server = controllerTestFactory.getFakeServer({
              method: 'DELETE',
              responseCode: 200,
              requestUrl: fakeOptions.href
            });

            EventTestHelpers.unbind(triggeredEvent);
            EventBus.on(triggeredEvent, function() {
              done();
            });

            EventBus.trigger('payment.deletePaymentRequest', fakeOptions);
          });

          after(function () {
            delete(this.server);
            EventBus.trigger.restore();
            EventTestHelpers.reset();
          });

          it('triggers the ' + triggeredEvent + ' event', function() {
            expect(EventBus.trigger).to.be.calledWith(triggeredEvent);
          });

        });

        // any error code will do, not just 403
        describe('when AJAX request returns a 403 code', function() {
          var triggeredEvent = 'address.deleteAddressFailed';
          before(function (done) {
            sinon.spy(EventBus, 'trigger');
            sinon.stub(ep.logger, 'error');
            this.server = controllerTestFactory.getFakeServer({
              method: 'DELETE',
              responseCode: 403,
              requestUrl: fakeOptions.href
            });

            EventTestHelpers.unbind(triggeredEvent);
            EventBus.on(triggeredEvent, function() {
              done();
            });

            EventBus.trigger('address.deleteAddressRequest', fakeOptions);
          });

          after(function () {
            delete(this.server);
            EventBus.trigger.restore();
            ep.logger.error.restore();
            EventTestHelpers.reset();
          });

          it('triggers the ' + triggeredEvent + ' event', function() {
            expect(EventBus.trigger).to.be.calledWith(triggeredEvent);
          });

        });
      });

      describe('Responds to event: payment.deletePaymentSuccess', function () {
        before(function () {
          sinon.stub(Mediator,'fire');
          EventBus.trigger('payment.deletePaymentSuccess', fakeOptions.indicatorView);
        });

        after(function () {
          Mediator.fire.restore();
        });

        it('fires the "mediator.deletePaymentComplete" mediator strategy', function () {
          expect(Mediator.fire).to.be.calledWithExactly('mediator.deletePaymentComplete', fakeOptions.indicatorView);
        });
      });

      describe('Responds to event: payment.deletePaymentFailed', function () {
        var response = {status: 'any code'};

        before(function () {
          sinon.stub(ep.ui, 'stopActivityIndicator');
          sinon.stub($.fn, 'toastmessage');
          EventBus.trigger('payment.deletePaymentFailed', response, fakeOptions.indicatorView);
        });

        after(function () {
          ep.ui.stopActivityIndicator.restore();
          $().toastmessage.restore();
        });

        it('displays a toast message', function () {
          expect($().toastmessage).to.be.called;
        });

        it('attempts to stop any activity indicator in that view', function () {
          expect(ep.ui.stopActivityIndicator).to.be.calledWithExactly(fakeOptions.indicatorView);
        });
      });
    });
  });

});