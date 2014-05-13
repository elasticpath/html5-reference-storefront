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
  var Mediator = require('mediator');
  var ViewHelpers = require('viewHelpers');

  /**
   * Template helper functions
   */
  var viewHelpers = ViewHelpers.extend();

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

  function renderSecurePaymentForm(html) {
    $('[data-region="paymentFormContainer"]').append(html);
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
/*
      // disabled because using Form Posting method now
      'click @ui.saveButton': function (event) {
        event.preventDefault();

        // Test if the shopper is adding a one-time or permanent payment method.
        // If the saveToProfileFormGroup element is hidden (see onRender function below) or the saveToProfileCheckbox
        // element is checked, this is a permanent new payment method (to be added to the shopper's profile).
        if (this.ui.saveToProfileFormGroup.hasClass('hidden') || this.ui.saveToProfileCheckbox.prop('checked')) {
          // Triggers an event which goes on to request the payment form action URL from Cortex.
          // A boolean value is passed to indicate the permanence of the new payment method (true if permanent,
          // false or not present missing if one-time).
          EventBus.trigger('payment.savePaymentMethodBtnClicked', true);
        } else {
          EventBus.trigger('payment.savePaymentMethodBtnClicked');
        }
      },
 */
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

  /**
   * A layout for rendering billing address radio buttons and their labels.
   * Makes a mediator request to load an address view in region: billingAddressRegion.
   * @type Marionette.Layout
   */
  var billingAddressSelectorLayout = Marionette.Layout.extend({
    template: '#PaymentBillingAddressSelectorTemplate',
    templateHelpers: viewHelpers,
    regions: {
      billingAddressRegion: '[data-region="paymentBillingAddressRegion"]'
    },
    onRender: function () {
      // Fire event to load the address itemView from component
      Mediator.fire('mediator.loadAddressesViewRequest', {
        region: this.billingAddressRegion,
        model: this.model
      });
    }
  });

  /**
   * Rendered by BillingAddressesCompositeView when there are no billing addresses to be displayed.
   * @type Marionette.ItemView
   */
  var billingAddressesEmptyView = Marionette.ItemView.extend({
    template: '#PaymentEmptyBillingAddressesTemplate',
    templateHelpers: viewHelpers
  });

  /**
   * Renders a heading and a list of billing addresses.
   * @type Marionette.CompositeView
   */
  var selectBillingAddressView = Marionette.CompositeView.extend({
    templateHelpers: viewHelpers,
    className: 'container',
    template: '#PaymentBillingAddressesTemplate',
    itemView: billingAddressSelectorLayout,
    emptyView: billingAddressesEmptyView,
    ui: {
      // A jQuery selector for the DOM element to which an activity indicator should be applied.
      activityIndicatorEl: '[data-region="billingAddressSelectorsRegion"]',
      newBillingAddressBtn: '[data-el-label="payment.newBillingAddressBtn"]',
      nextButton: '[data-el-label="payment.nextBtn"]'
    },
    itemViewContainer: '[data-region="billingAddressSelectorsRegion"]',
    events: {
      'change input[type="radio"]': function () {
        // unset previous chosen choice from model
        var prevChosen = this.collection.get(this.collection.chosenCid);
        if (prevChosen) {
          prevChosen.unset('chosen');
        }

        // record the chosen address into model
        var selectedModelId = Number($(event.target).prop("id"));
        var currChosen = this.collection.where({idNum: selectedModelId});
        if (currChosen.length > 0) {
          this.collection.chosenCid = currChosen[0].cid;
          currChosen[0].set('chosen', true);
        }

        // enable the next button now an address is chosen
        $(this.ui.nextButton).prop("disabled", false);
      },

      'click @ui.newBillingAddressBtn': function (event) {
        event.preventDefault();
        EventBus.trigger('payment.addNewAddressBtnClicked');
      },

      'click @ui.nextButton': function(event) {
        event.preventDefault();
        EventBus.trigger('payment.proceedToNextBtnClicked', this.collection.chosenCid);
      }
    }
  });

  /**
   * This view is rendered in the modal region to obtain confirmation from the user before proceeding
   * with a request to delete an payment.
   */
  var defaultDeletePaymentConfirmationView = Marionette.ItemView.extend({
    className:'payment-delete-confirm-modal',
    template:'#DefaultDeletePaymentConfirmationModalTemplate',
    templateHelpers:viewHelpers,
    events:{
      'click .btn-yes': function(event) {
        event.preventDefault();
        EventBus.trigger('payment.deleteConfirmYesBtnClicked', this.options);
      },
      'click .btn-no': function(event) {
        event.preventDefault();
        $.modal.close();
      }
    }
  });

  return {
    DefaultPaymentItemView: defaultPaymentItemView,
    DefaultPaymentFormView: defaultPaymentFormView,
    SelectBillingAddressView: selectBillingAddressView,
    DefaultDeletePaymentConfirmationView: defaultDeletePaymentConfirmationView,

    getPaymentFormValues: getPaymentFormValues,
    renderSecurePaymentForm: renderSecurePaymentForm
  };
});