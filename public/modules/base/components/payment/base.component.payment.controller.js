/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 *
 * Payment Component Controller
 * The HTML5 Reference Storefront's MVC controller for displaying an payment method.
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

  /* *************** Event Listeners: add new payment method *************** */
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

  function submitForm(data, link) {
    var ajaxModel = new ep.io.defaultAjaxModel({
      type: 'POST',
      url: link,
      data: JSON.stringify(data),
      success: function () {
        EventBus.trigger('payment.submitPaymentFormSuccess');
      },
      customErrorFn: function (response) {
        EventBus.trigger('payment.submitPaymentFormFailed');
      }
    });

    ep.io.ajax(ajaxModel.toJSON());
  }

  EventBus.on('payment.cancelFormBtnClicked', function () {
    Mediator.fire('mediator.paymentFormComplete');
  });

  EventBus.on('payment.savePaymentMethodBtnClicked', function (href) {
    var formObj = Views.getPaymentFormValues();
    var formData = parsePaymentForm(formObj);

    submitForm(formData, href);
  });

  EventBus.on('payment.submitPaymentFormSuccess', function () {
    Mediator.fire('mediator.paymentFormComplete');
  });

  EventBus.on('payment.submitPaymentFormFailed', function () {
    utils.renderMsgToPage('paymentForm.errorMsg.generalSavePaymentFailedErrMsg', defaultView.ui.feedbackRegion);
  });

  /* *********** Event Listeners: load display address view  *********** */
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
    DefaultCreatePaymentController: defaultCreatePaymentController
  };
});