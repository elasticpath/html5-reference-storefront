/**
 * Copyright Elastic Path Software 2013.
 *
 * Storefront - Checkout Controller
 */

define(function (require) {
    var ep = require('ep');
    var EventBus = require('eventbus');
    var Mediator = require('mediator');
    var Backbone = require('backbone');
    var pace = require('pace');

    var Model = require('checkout.models');
    var View = require('checkout.views');
    var template = require('text!modules/base/checkout/base.checkout.templates.html');

    $('#TemplateContainer').append(template);
    _.templateSettings.variable = 'E';

    /**
     * Instantiate an checkout DefaultLayout and load views into corresponding regions
     * @returns {View.DefaultLayout}  fully rendered checkout DefaultLayout
     */
    var defaultView = function (link) {
      pace.start();
      var checkoutLayout = new View.DefaultLayout();
      var checkoutModel = new Model.CheckoutModel();

      checkoutModel.fetch({
        url: checkoutModel.getUrl(link),
        success: function (response) {
          checkoutLayout.checkoutTitleRegion.show(new View.CheckoutTitleView());

          checkoutLayout.chosenBillingAddressRegion.show(new View.BillingAddressLayout({
            model: new Backbone.Model(checkoutModel.get('billingAddresses').chosenBillingAddress)
          }));

          checkoutLayout.cancelCheckoutActionRegion.show(new View.CancelCheckoutActionView());

          var checkoutSummaryLayout = new View.CheckoutSummaryLayout();
          checkoutSummaryLayout.on('show', function () {
            checkoutSummaryLayout.checkoutSummaryRegion.show(
              new View.CheckoutSummaryView({
                model: new Backbone.Model(checkoutModel.get('summary'))
              })
            );
            checkoutSummaryLayout.submitOrderRegion.show(
              new View.submitOrderActionView({
                model: checkoutModel
              })
            );
          });
          checkoutLayout.checkoutOrderRegion.show(checkoutSummaryLayout);
        }
      });

      return checkoutLayout;
    };

    /* ************** EVENT LISTENER FUNCTIONS ***************** */
    /**
     * Submit order to cortex.
     * @param submitOrderLink action-link to submit order to.
     */
    function submitOrder(submitOrderLink) {
      if (!submitOrderLink) {
        // FIXME user feedback
        ep.logger.warn('checkout.submitOrderRequest called with no submitOrderLink');
        return;
      }

      var ajaxModel = new ep.io.defaultAjaxModel({
        type: 'POST',
        url: submitOrderLink,
        success: function (data, textStatus, XHR) {
          var obj = {
            data: data,
            textStatus: textStatus,
            XHR: XHR
          };
          EventBus.trigger('checkout.submitOrderSuccess', obj);
        },
        customErrorFn: function (response) {
          EventBus.trigger('checkout.submitOrderFailed');
        }
      });

      ep.io.ajax(ajaxModel.toJSON());
    }

    /**
     * Fire mediator event to handle subsequent actions.
     * @param response  submit order success response
     */
    function submitOrderSuccess(response) {

      var orderSummaryLink = response.XHR.getResponseHeader('Location');
      if (orderSummaryLink) {
        Mediator.fire('mediator.orderProcessSuccess', orderSummaryLink);
        pace.stop();
      }
    }

    /* ********** SUBMIT ORDER EVENT LISTENERS ************ */
    /**
     * Listening to cancel checkout button clicked signal,
     * will navigate back to cart
     */
    EventBus.on('checkout.cancelOrderBtnClicked', function () {
      // Route to the default cart view
      ep.router.navigate(ep.app.config.routes.cart, true);
    });

    /**
     * Listening to submit order button clicked signal,
     * will trigger event to submit order to cortex
     */
    EventBus.on('checkout.submitOrderBtnClicked', function (submitOrderActionLink) {
      View.setCheckoutButtonProcessing();
      // if cortex says it's ok
      if (submitOrderActionLink) {
        EventBus.trigger('checkout.submitOrderRequest', submitOrderActionLink);
      }
    });

    /**
     * Listening to submit order request,
     * will submit purchase order to cortex.
     */
    EventBus.on('checkout.submitOrderRequest', submitOrder);

    /**
     * Listening to submit order success signal,
     * will fire mediator event to handle subsequent actions.
     */
    EventBus.on('checkout.submitOrderSuccess', submitOrderSuccess);

    /**
     * Listening to submit order failed signal,
     * will reset checkout button back from activity indicator to
     */
    EventBus.on('checkout.submitOrderFailed', function() {
      // FIXME should also notify user if submit fails
      View.resetCheckoutButtonText();
    });

    return {
      DefaultView: defaultView
    };
  }
);
