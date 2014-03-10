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

  describe('Payment Controller: Events Tests', function () {
    var paymentController = require('payment');
    var paymentModel = require('payment.models');
    var paymentTemplate = require('text!modules/base/components/payment/base.component.payment.template.html');
    var paymentView = require('payment.views');

    describe('responds to event: payment.getPaymentFormSubmitUrl', function () {
      describe('when a valid Cortex order URL is retrieved from sessionStorage', function () {
        before(function () {
          sinon.stub(ep.io.sessionStore, 'getItem', function() {
            return 'someURLString';
          });
          sinon.stub(Backbone.Model.prototype, 'fetch');
          sinon.spy(paymentModel, 'NewPaymentModel');
          EventBus.trigger('payment.getPaymentFormSubmitUrl');
        });

        after(function () {
          ep.io.sessionStore.getItem.restore();
          Backbone.Model.prototype.fetch.restore();
          paymentModel.NewPaymentModel.restore();
        });

        it('instantiates a NewPaymentModel Backbone model' ,function () {
          expect(paymentModel.NewPaymentModel).to.be.called;
        });
        it('calls Backbone.Model fetch' ,function () {
          expect(Backbone.Model.prototype.fetch).to.be.called;
        });
      });

      describe('when a valid Cortex order URL cannot be retrieved from sessionStorage', function () {
        before(function () {
          // Unable to test showMissingSubmitUrlToastMessage(), so testing $.fn.toastmessage instead
          sinon.stub($.fn, 'toastmessage');
          sinon.stub(ep.logger, 'error');
          sinon.stub(ep.io.sessionStore, 'getItem', function() {
            return false;
          });
          EventBus.trigger('payment.getPaymentFormSubmitUrl');
        });

        after(function () {
          $.fn.toastmessage.restore();
          ep.logger.error.restore();
          ep.io.sessionStore.getItem.restore();
        });

        it('shows a toast message to report the error to the shopper' ,function () {
          expect($.fn.toastmessage).to.be.calledWith('showToast');
        });
      });
    });

    describe('responds to event: payment.loadPaymentMethodViewRequest', function () {
      before(function () {
        sinon.spy(EventBus, 'trigger');
      });

      after(function () {
        EventBus.trigger.restore();
      });

      it("registers correct event listener", function () {
        expect(EventBus._events['payment.loadPaymentMethodViewRequest']).to.be.length(1);
      });

      describe('handles valid data', function () {
        before(function () {
          $("#Fixtures").append(paymentTemplate); // append templates
          $("#Fixtures").append('<div id="testingRegion"></div>'); // append an region to render tested view into

          EventBus.trigger(
            'payment.loadPaymentMethodViewRequest',
            new Marionette.Region({el: '#testingRegion'}),
            new Backbone.Model()
          );
        });

        after(function () {
          $('#Fixtures').empty();
        });

        it("by rendering DefaultPaymentItemView into provided region", function () {
          expect($('#testingRegion .payment-method-container')).to.be.length(1);
        });
      });

      describe('handles invalid data', function () {
        before(function () {
          this.errorlogger = sinon.stub(ep.logger, 'error');
          EventBus.trigger('payment.loadPaymentMethodViewRequest', undefined);
        });

        after(function () {
          ep.logger.error.restore();
        });

        it("by logging the error in console", function () {
          expect(this.errorlogger).to.be.calledWithMatch('failed to load Payment Method View');
        });
      });
    });

    describe('responds to event: payment.savePaymentMethodBtnClicked', function() {
      before(function() {
        sinon.spy(EventBus, 'trigger');
        sinon.spy(paymentView, 'getPaymentFormValues');
        sinon.stub(ep.ui, 'disableButton');
        sinon.stub(Mediator, 'fire');
        EventTestHelpers.unbind('payment.getPaymentFormSubmitUrl');
      });

      after(function() {
        EventBus.trigger.restore();
        paymentView.getPaymentFormValues.restore();
        ep.ui.disableButton.restore();
        Mediator.fire.restore();
        EventTestHelpers.reset();
      });

      describe('when the "save to profile" checkbox is checked', function() {
        before(function() {
          EventBus.trigger('payment.savePaymentMethodBtnClicked', true);
        });
        it('calls the disableButton function', function() {
          expect(ep.ui.disableButton).to.be.called;
        });
        it('calls the getPaymentFormValues function from the view', function() {
          expect(paymentView.getPaymentFormValues).to.be.calledOnce;
        });
        it('fires the correct mediator strategy' ,function () {
          expect(Mediator.fire).to.be.called;
        });
      });

      describe('when the saveToProfile checkbox is NOT checked', function() {
        before(function() {
          EventBus.trigger('payment.savePaymentMethodBtnClicked');
        });
        it('calls the disableButton function', function() {
          expect(ep.ui.disableButton).to.be.called;
        });
        it('calls the getPaymentFormValues function from the view', function() {
          expect(paymentView.getPaymentFormValues).to.be.called;
        });
        it('triggers the correct EventBus signal' ,function () {
          expect(EventBus.trigger).to.be.calledWith('payment.getPaymentFormSubmitUrl');
        });
      });
    });

    describe('responds to event: payment.cancelFormBtnClicked', function() {
      before(function() {
        sinon.stub(Mediator, 'fire');
        EventBus.trigger('payment.cancelFormBtnClicked');
      });

      after(function() {
        Mediator.fire.restore();
      });

      it("fires the relevant mediator strategy", function() {
        expect(Mediator.fire).to.be.calledWithExactly('mediator.paymentFormComplete');
      });
    });

    describe('submitPaymentMethodForm event', function() {
      // Common before() and after() sections for the AJAX form submit tests
      before(function() {
        // Some settings for our fakeServer
        this.fakeSubmitUrl = "/fakeSubmitUrl";
        this.response = {responseText: "some response text"};
        this.fakeData = {
          "display-value": undefined,
          "value": undefined
        };

        sinon.spy(EventBus, 'trigger');
        sinon.stub(ep.logger, 'error');
      });
      after(function() {
        EventBus.trigger.restore();
        ep.logger.error.restore();

        delete(this.fakeSubmitUrl);
        delete(this.response);
        delete(this.fakePaymentControllerServer);
      });

      describe('when the server returns a 400 error', function() {
        var submitPaymentFormFailedEvent = 'payment.submitPaymentFormFailed';

        before(function(done) {
          this.fakePaymentControllerServer = controllerTestFactory.getFakeServer({
            method: 'POST',
            response: this.response,
            responseCode: 400,
            requestUrl: this.fakeSubmitUrl
          });

          EventTestHelpers.unbind(submitPaymentFormFailedEvent);

          EventBus.on(submitPaymentFormFailedEvent, function() {
            done();
          });

          EventBus.trigger('payment.submitPaymentMethodForm', this.fakeData, this.fakeSubmitUrl);
        });

        after(function() {
          EventTestHelpers.reset();
        });

        it("triggers the " + submitPaymentFormFailedEvent + " event", function() {
          expect(EventBus.trigger).to.be.calledWith(submitPaymentFormFailedEvent);
        });
      });

      describe('when the server returns a 200 response', function() {
        var submitPaymentFormSuccessEvent = 'payment.submitPaymentFormSuccess';

        before(function(done) {
          this.fakePaymentControllerServer = controllerTestFactory.getFakeServer({
            method: 'POST',
            response: this.response,
            responseCode: 200,
            requestUrl: this.fakeSubmitUrl
          });

          EventTestHelpers.unbind(submitPaymentFormSuccessEvent);

          EventBus.on(submitPaymentFormSuccessEvent, function() {
            done();
          });

          EventBus.trigger('payment.submitPaymentMethodForm', this.fakeData, this.fakeSubmitUrl);
        });

        after(function() {
          EventTestHelpers.reset();
        });

        it("triggers the " + submitPaymentFormSuccessEvent + " event", function() {
          expect(EventBus.trigger).to.be.calledWith(submitPaymentFormSuccessEvent);
        });
      });
    });

  });

});