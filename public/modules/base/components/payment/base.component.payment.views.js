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

  /**
   * Simple function to build a payment method object from the values supplied in the form.
   * It is expected that this form will be provided by a payment gateway in future.
   *
   * @returns {Object} An object containing all of the values entered on the form.
   */
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

  /**
   * Payment form item view
   * Will render the new payment method form (form element, form fields, buttons and error feedback container)
   * @type Marionette.ItemView
   */
  var defaultPaymentFormView = Marionette.ItemView.extend({
    template: '#MockPaymentMethodFormTemplate',
    templateHelpers: ViewHelpers,
    className: 'container',
    ui: {
      'cancelButton': '[data-el-label="paymentForm.cancel"]',
      'feedbackRegion': '[data-region="componentPaymentFeedbackRegion"]',
      'saveButton': '[data-el-label="paymentForm.save"]'
    },
    events: {
      'click @ui.saveButton': function (event) {
        event.preventDefault();
        var href = this.model.get('href');
        if (href) {
          EventBus.trigger('payment.savePaymentMethodBtnClicked', href);
        } else {
          ep.logger.warn('unable to retrieve url to post address form');
        }
      },
      'click @ui.cancelButton': function (event) {
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