/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 *
 * Payment Method Component Views
 * The HTML5 Reference Storefront's MVC Views for a displaying payment.
 */
define(function (require) {
  var ep = require('ep');
  var Marionette = require('marionette');
  var EventBus = require('eventbus');
  var ViewHelpers = require('viewHelpers');

  function getPaymentFormValues() {
    return {
      "cardType": $("#CardType").val(),
      "name": $("#CardHolderName").val(),
      "cardNumber": $("#CardNumber").val(),
      "expiry": {
        "month": $("#ExpiryMonth").val(),
        "year": $("#ExpiryYear").val()
      },
      "securityCode": $("#SecurityCode").val()
    };
  }

  /**
   * Default Payment Method ItemView
   * Will render a default tokenized payment method
   * @type Marionette.ItemView
   */
  var defaultPaymentItemView = Marionette.ItemView.extend({
    template: '#DefaultTokenPaymentTemplate',
    tagName: 'span',
    className: 'payment-method-container',
    attributes: {
      'data-el-value': 'payment.token'
    }
  });

  var defaultPaymentFormView = Marionette.ItemView.extend({
    template: '#MockPaymentMethodFormTemplate',
    templateHelpers: ViewHelpers,
    className: 'container',
    ui: {
      'feedbackRegion': '[data-region="componentPaymentFeedbackRegion"]'
    },
    events: {
      'click [data-el-label="paymentForm.save"]': function (event) {
        event.preventDefault();
        var href = this.model.get('href');
        if (href) {
          EventBus.trigger('payment.savePaymentMethodBtnClicked', href);
        } else {
          ep.logger.warn('unable to retrieve url to post address form');
        }
      },
      'click [data-el-label="paymentForm.cancel"]': function (event) {
        event.preventDefault();
        EventBus.trigger('payment.cancelFormBtnClicked');
      }
    }
  });

  return {
    DefaultPaymentItemView: defaultPaymentItemView,
    DefaultPaymentFormView: defaultPaymentFormView,
    getPaymentFormValues: getPaymentFormValues
  };
});