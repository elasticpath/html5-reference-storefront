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
      'saveToProfileCheckbox': '[data-el-label="payment.saveToProfile"]',
      'saveToProfileFormGroup': '[data-el-label="payment.saveToProfileFormGroup"]',
      'saveButton': '[data-el-label="paymentForm.save"]'
    },
    events: {
      'click @ui.saveButton': function (event) {
        event.preventDefault();
        /**
         * Test if the shopper is adding a one-time or permanent payment method.
         * If the saveToProfileFormGroup element is hidden (see onRender function below) or the saveToProfileCheckbox
         * element is checked, this is a permanent new payment method (to be added to the shopper's profile).
         */
        if ( this.ui.saveToProfileFormGroup.hasClass('hidden') || this.ui.saveToProfileCheckbox.prop('checked') ) {
          /**
           * Triggers an event which goes on to request the payment form action URL from Cortex.
           * A boolean value is passed to indicate the permanence of the new payment method (true if permanent,
           * false or not present missing if one-time).
           */
          EventBus.trigger('payment.savePaymentMethodBtnClicked', true);
        } else {
          EventBus.trigger('payment.savePaymentMethodBtnClicked');
        }
      },
      'click @ui.cancelButton': function (event) {
        event.preventDefault();
        EventBus.trigger('payment.cancelFormBtnClicked');
      }
    },
    onRender: function () {
      // Hide the 'save to profile' checkbox if the shopper has accessed the new payment method form from profile
      if ( ep.io.sessionStore.getItem('paymentFormReturnTo') === 'profile' ) {
        this.ui.saveToProfileFormGroup.addClass('hidden');
      }
    }
  });

  return {
    DefaultPaymentItemView: defaultPaymentItemView,
    DefaultPaymentFormView: defaultPaymentFormView,
    getPaymentFormValues: getPaymentFormValues
  };
});