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
 * Payment Component Controller
 * The HTML5 Reference Storefront's MVC controller for displaying a payment method.
 */

define(function (require) {
  var ep = require('ep');
  var EventBus = require('eventbus');
  var Mediator = require('mediator');
  var i18n = require('i18n');

  var Views = require('payment.views');
  var Model = require('payment.models');
  var template = require('text!modules/base/components/payment/base.component.payment.template.html');
  var utils = require('utils');

  $('#TemplateContainer').append(template);

  _.templateSettings.variable = 'E';

  // Defined here so event handlers have access to its regions
  var defaultView;

  var defaultCreatePaymentController = function () {
    defaultView = new Views.DefaultPaymentFormView();
    return defaultView;
  };

  /**
   * Parses the object of field values retrieved from the new payment method form. The card number from the form
   * is converted into a string suitable for use as the display value of the payment token.
   *
   * This display value and the full card number are returned in an object with the property names
   * expected by Cortex in the data of the AJAX request.
   *
   * This functionality will eventually be provided by a payment gateway.
   *
   * @param {Object} values An object of values retrieved from the new payment method form
   * @returns {Object} an object that can be used as the data of an AJAX request to Cortex
   */
  function parsePaymentForm(values) {
    var displayValue;
    var value;

    if (values && values.cardNumber) {
      value = values.cardNumber;

      if (value.length > 3) {
        displayValue = "********" + value.substring(value.length - 4);
      }
    }

    return {
      "display-value": displayValue,
      "value": value
    };
  }

  /**
   * Renders a toast message to the centre of the viewport when an error is encountered retrieving a submit URL from
   * Cortex for the new payment method request from Cortex. We reload the page on close of the toast message.
   */
  function showMissingSubmitUrlToastMessage() {
    ep.logger.error('Unable to retrieve payment method submit URL');

    $().toastmessage('showToast', {
      text: i18n.t('paymentForm.errorMsg.generalSavePaymentFailedErrMsg'),
      sticky: true,
      position: 'middle-center',
      type: 'error',
      close: function() {
        Backbone.history.loadUrl();
      }
    });
  }

  /**
   * Constructs and submits an AJAX request to Cortex with the parsed payment form data
   * and the URL retrieved from the payment method model.
   *
   * @param data {Object} Parsed data from the new payment method form
   * @param link {String} The URL to which the AJAX request should be sent
   */
  EventBus.on('payment.submitPaymentMethodForm', function (data, link) {
    var ajaxModel = new ep.io.defaultAjaxModel({
      type: 'POST',
      url: link,
      data: JSON.stringify(data),
      success: function () {
        EventBus.trigger('payment.submitPaymentFormSuccess');
      },
      customErrorFn: function () {
        EventBus.trigger('payment.submitPaymentFormFailed');
      }
    });

    ep.io.ajax(ajaxModel.toJSON());
  });

  /* *************** Event Listeners: add new payment method *************** */
  /**
   * Fires a mediator strategy on click of the cancel button, that returns the user to the referring module.
   */
  EventBus.on('payment.cancelFormBtnClicked', function () {
    Mediator.fire('mediator.paymentFormComplete');
  });


  /**
   * Triggered when a shopper selects to create a new one-time payment method.
   * Makes a request to Cortex using the NewPaymentModel Backbone Model to obtain
   * the URL to which the new payment method request form data should be posted.
   *
   * When successful, triggers an EventBus signal that constructs and sends the actual AJAX request.
   * @param formData {Object} An object representing the data entered in the fields of the new payment method form.
   */
  EventBus.on('payment.getPaymentFormSubmitUrl', function (formData) {
    // Attempt to retrieve an order link from session storage (set by the checkout module)
    var orderLink = ep.io.sessionStore.getItem('orderLink');

    // Trigger an error if we are unable to retrieve a Cortex order link
    if (orderLink) {
      var paymentFormModel = new Model.NewPaymentModel();

      // Fetch the payment form model that contains the URL to which the form should be submitted
      paymentFormModel.fetch({
        url: paymentFormModel.getUrl(orderLink),
        success: function (response) {
          var submitUrl = response.get('href');
          if (submitUrl) {
            // Trigger the AJAX request with the entered form data and the URL retrieved
            EventBus.trigger('payment.submitPaymentMethodForm', formData, submitUrl);
          } else {
            showMissingSubmitUrlToastMessage();
          }
        }
      });
    }
    else {
      showMissingSubmitUrlToastMessage();
    }
  });

  /**
   * On click of the save payment method button, this handler disables the form submit button, retrieves the parsed
   * form data and passes it to a function that builds and sends the AJAX request to Cortex.
   * @param saveToProfile {Boolean} Indicates whether this payment method should be saved to the profile for future
   *                                use or if it is a one-time payment method.
   */
  EventBus.on('payment.savePaymentMethodBtnClicked', function (saveToProfile) {
    ep.ui.disableButton(defaultView, 'saveButton');

    var formObj = Views.getPaymentFormValues();
    var formData = parsePaymentForm(formObj);

    if (saveToProfile) {
      // FIXME This may be a misuse of the mediator pattern, creating a dependency of sorts between payment and profile
      // Fire a mediator strategy that will retrieve the URL to which the form should be submitted
      Mediator.fire('mediator.savePaymentMethodToProfileRequest', formData);
    } else {
      EventBus.trigger('payment.getPaymentFormSubmitUrl', formData);
    }
  });

  /**
   * If the AJAX request succeeds, fire a mediator strategy that returns the user to the referring module.
   */
  EventBus.on('payment.submitPaymentFormSuccess', function () {
    Mediator.fire('mediator.paymentFormComplete');
  });

  /**
   * If the AJAX request fails, re-enable the submit button and render a generic error to the page.
   */
  EventBus.on('payment.submitPaymentFormFailed', function () {
    ep.ui.enableButton(defaultView, 'saveButton');
    utils.renderMsgToPage('paymentForm.errorMsg.generalSavePaymentFailedErrMsg', defaultView.ui.feedbackRegion);
  });

  /* *************** Event Listeners: display a payment method *************** */
  /**
   * Listening to load default display payment view request,
   * will render a Default payment ItemView with regions and models passed in.
   * @param paymentMethod  contains region to render in and the model to render with
   */
  EventBus.on('payment.loadPaymentMethodViewRequest', function (region, paymentMethodModel) {
    try {
      var paymentView = new Views.DefaultPaymentItemView({
        model: paymentMethodModel
      });

      region.show(paymentView);
    } catch (error) {
      ep.logger.error('failed to load Payment Method Views: ' + error.message);
    }
  });

  /* *************** Event Listeners: delete payment method *************** */
  /**
   * Uses a modal window to confirm the delete action for an payment.
   * @param options Contains an href representing the payment to be deleted and an optional reference to a
   *                     Marionette.View to which an activity indicator should be applied.
   */
  EventBus.on('payment.deletePaymentConfirm', function (options) {
    EventBus.trigger('layout.loadRegionContentRequest', {
      region: 'appModalRegion',
      module: 'payment',
      view: 'DefaultDeletePaymentConfirmationView',
      data: options
    });
  });

  /**
   * Called when the yes button in the confirm deletion modal is clicked. This handler closes any open modal windows,
   * optionally applies an activity indicator to the Marionette.View represented by the opts.indicatorView
   * parameter and triggers the delete request to Cortex.
   */
  EventBus.on('payment.deleteConfirmYesBtnClicked', function(opts) {
    $.modal.close();
    // Apply an activity indicator to any view passed in the options
    if (opts.indicatorView) {
      ep.ui.startActivityIndicator(opts.indicatorView);
    }
    EventBus.trigger('payment.deletePaymentRequest', opts);
  });


  /**
   * Builds and submits an AJAX request to Cortex to delete an payment.
   * @param {Object} opts Contains the href used to identify the payment to be deleted in Cortex
   */
  EventBus.on('payment.deletePaymentRequest', function (opts) {
    if (_.isObject(opts)) {
      // Build AJAX request
      var ajaxModel = new ep.io.defaultAjaxModel({
        type: 'DELETE',
        url: opts.href,
        success: function () {
          EventBus.trigger('payment.deletePaymentSuccess', opts.indicatorView);
        },
        customErrorFn: function (response) {
          EventBus.trigger('payment.deletePaymentFailed', {
            status: response.status,
            responseText: response.responseText
          }, opts.indicatorView);
        }
      });

      // Send AJAX request to Cortex
      ep.io.ajax(ajaxModel.toJSON());
    } else {
      ep.logger.error('deletepaymentRequest event triggered without a valid options object');
    }
  });

  /**
   * Called when an payment has been successfully deleted from Cortex. Fires a mediator strategy to notify
   * the referring module.
   * @param indicatorView an optional reference to a Marionette.View used as the target for the activity indicator
   */
  EventBus.on('payment.deletePaymentSuccess', function (indicatorView) {
    Mediator.fire('mediator.deletePaymentComplete', indicatorView);
  });


  /**
   * Called when a request to delete an payment from Cortex has failed. Displays a toast message and stops
   * any activity indicator that has been applied to the Marionette.View referenced by the parameter.
   * On close of the toast message, we invoke a full page refresh.
   * @param indicatorView a reference to a Marionette.View to which an activity indicator has been applied
   */
  EventBus.on('payment.deletePaymentFailed', function (response, indicatorView) {
    var key = 'paymentForm.errorMsg.deleteErr';
    var onClose = function() {
      Backbone.history.loadUrl();
    };

    if (response && response.status === 403) {
      key = 'paymentForm.errorMsg.cannotDeleteSelectedErr';
      onClose = function() {
        // do nothing on close message
        return;
      };
    }

    $().toastmessage('showToast', {
      text: i18n.t(key),
      sticky: true,
      position: 'middle-center',
      type: 'error',
      close: onClose
    });

    // Stop any activity indicator
    if (indicatorView) {
      ep.ui.stopActivityIndicator(indicatorView);
    }
  });

  return {
    /* test-code */
    __test_only__: {
      showMissingSubmitUrlToastMessage: showMissingSubmitUrlToastMessage
    },
    /* end-test-code */

    DefaultCreatePaymentController: defaultCreatePaymentController,
    DefaultDeletePaymentConfirmationView: function(options) {
      return new Views.DefaultDeletePaymentConfirmationView(options);
    }
  };
});