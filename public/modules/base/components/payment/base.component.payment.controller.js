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

  var View = require('payment.views');
  var template = require('text!modules/base/components/payment/base.component.payment.template.html');

  $('#TemplateContainer').append(template);

  _.templateSettings.variable = 'E';

  /* *************** Event Listeners Functions *************** */
  /**
   * Renders a Default Address ItemView with regions and models passed in
   * @param paymentMethod  contains region to render in and the model to render with
   */
  function loadPaymentView(region, paymentMethodModel) {
    try {
      var paymentView = new View.DefaultPaymentItemView({
        model: paymentMethodModel
      });

      region.show(paymentView);
    } catch (error) {
      ep.logger.error('failed to load Payment Method View: ' + error.message);
    }
  }

  /* *********** Event Listeners: load display address view  *********** */
  /**
   * Listening to load default display payment view request,
   * will load the default view in specified region.
   */
  EventBus.on('payment.loadPaymentMethodViewRequest', loadPaymentView);

  return { };
});