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
    var i18n = require('i18n');

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

          checkoutLayout.billingAddressesRegion.show(
            new View.BillingAddressesCompositeView({
              collection: new Backbone.Collection(checkoutModel.get('billingAddresses'))
            })
          );

          checkoutLayout.cancelCheckoutActionRegion.show(new View.CancelCheckoutActionView());

          var checkoutSummaryView = new View.CheckoutSummaryView({
            model: new Backbone.Model(checkoutModel.get('summary'))
          });
          checkoutSummaryView.on('show', function() {
            if (checkoutModel.get('summary').taxes.length > 0) {
              checkoutSummaryView.checkoutTaxBreakDownRegion.show(
                new View.CheckoutTaxesCollectionView({
                  collection: new Backbone.Collection(checkoutModel.get('summary').taxes)
                })
              );
            }
          });

          checkoutLayout.checkoutOrderRegion.show(checkoutSummaryView);
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


    /**
     * Handler for the checkout.billingAddressRadioChanged event.
     *
     */
    EventBus.on('checkout.billingAddressRadioChanged', function(actionLink) {
      EventBus.trigger('checkout.updateChosenBillingAddressRequest', actionLink);
    });

    EventBus.on('checkout.updateChosenBillingAddressRequest', function(actionLink) {
      if (actionLink) {
        var ajaxModel = new ep.io.defaultAjaxModel({
          type: 'POST',
          url: actionLink,
          success: function() {
            EventBus.trigger('checkout.updateChosenBillingAddressSuccess');
          },
          customErrorFn: function() {
            EventBus.trigger('checkout.updateChosenBillingAddressFailed');
          }
        });

        ep.io.ajax(ajaxModel.toJSON());
      }
    });

    EventBus.on('checkout.updateChosenBillingAddressFailed', function(response) {
      ep.logger.error('error updating billing address: ' + response);

      // Display sticky error message
      $().toastmessage('showToast', {
        text: i18n.t('checkout.updateChosenBillingAddressErrMsg'),
        sticky: true,
        position: 'middle-center',
        type: 'error'
      });
    });

    EventBus.on('checkout.updateChosenBillingAddressSuccess', function(response) {
      Backbone.history.loadUrl();
    });

    return {
      DefaultView: defaultView
    };
  }
);
