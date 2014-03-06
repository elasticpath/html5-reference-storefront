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

  var Views = require('payment.views');
  var Model = require('payment.models');
  var template = require('text!modules/base/components/payment/base.component.payment.template.html');
  var utils = require('utils');

  $('#TemplateContainer').append(template);

  _.templateSettings.variable = 'E';

  // Defined here so event handlers have access to its regions
  var defaultView;

  var defaultCreatePaymentController = function () {
    // Attempt to retrieve an order link from session storage (set by the checkout module)
    var orderLink = ep.io.sessionStore.getItem('orderLink');

    // Trigger an error if we are unable to retrieve a Cortex order link
    if (orderLink) {
      var paymentFormModel = new Model.NewPaymentModel();
      defaultView = new Views.DefaultPaymentFormView({
        model: paymentFormModel
      });

      // Fetch the payment form model that contains the URL to which the form should be submitted
      paymentFormModel.fetch({
        url: paymentFormModel.getUrl(orderLink),
        success: function (response) {
          paymentFormModel = response;
        }
      });

      return defaultView;
    }
    else {
      ep.logger.error('unable to load new payment method form - missing order link data');
      ep.router.navigate(ep.app.config.routes.cart, true);
    }
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
   * Constructs and submits an AJAX request to Cortex with the parsed payment form data
   * and the URL retrieved from the payment method model.
   *
   * @param data {Object} Parsed data from the new payment method form
   * @param link {String} The URL to which the AJAX request should be sent
   */
  function submitForm(data, link) {
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
  }

  /* *************** Event Listeners: add new payment method *************** */
  /**
   * Fires a mediator strategy on click of the cancel button, that returns the user to the referring module.
   */
  EventBus.on('payment.cancelFormBtnClicked', function () {
    Mediator.fire('mediator.paymentFormComplete');
  });

  /**
   * On click of the save payment method button, this handler disables the form submit button, retrieves the parsed
   * form data and passes it to a function that builds and sends the AJAX request to Cortex.
   */
  EventBus.on('payment.savePaymentMethodBtnClicked', function (href) {
    ep.ui.disableButton(defaultView, 'saveButton');

    var formObj = Views.getPaymentFormValues();
    var formData = parsePaymentForm(formObj);

    submitForm(formData, href);
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

  /**
   * Listening to load default display payment view request,
   * will render a Default Address ItemView with regions and models passed in.
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

  return {
    /* test-code */
    __test_only__: {
      submitForm: submitForm
    },
    /* end-test-code */
    DefaultCreatePaymentController: defaultCreatePaymentController
  };
});