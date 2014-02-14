/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 * Functional Storefront Unit Test - Payment Component Controller
 */
define(function (require) {
  var EventBus = require('eventbus');
  var Backbone = require('backbone');
  var ep = require('ep');

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
  });

});