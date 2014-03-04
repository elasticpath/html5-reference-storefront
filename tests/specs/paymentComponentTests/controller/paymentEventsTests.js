/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
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
    var paymentTemplate = require('text!modules/base/components/payment/base.component.payment.template.html');

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
        sinon.stub(ep.io, 'ajax');
        sinon.stub(ep.ui, 'disableButton');

        EventBus.trigger('payment.savePaymentMethodBtnClicked');
      });

      after(function() {
        EventBus.trigger.restore();
        ep.io.ajax.restore();
        ep.ui.disableButton.restore();
      });

      it("calls the disableButton function", function() {
        expect(ep.ui.disableButton).to.be.calledOnce;
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

    describe('submitForm function', function() {
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

          paymentController.__test_only__.submitForm(this.fakeData, this.fakeSubmitUrl);
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

          paymentController.__test_only__.submitForm(this.fakeData, this.fakeSubmitUrl);
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