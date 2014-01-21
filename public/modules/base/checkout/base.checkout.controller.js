/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 * Default Checkout Controller
 * The MVC controller instantiates the checkout model and views, renders checkout views in destinated regions.
 * It also manages events and functions to
 *    - select different
 *        -- billing or shipping address,
 *        -- shipping options,
 *        -- and payment options;
 *    - add new billing address;
 *    - and submit purchase order.
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


    var checkoutModel = new Model.CheckoutModel();
    var checkoutSummaryModel;
    var paymentMethodCollection;
    var shippingOptionsCollection;

    var checkoutLayout = new View.DefaultLayout();

    /**
     * Instantiate an checkout DefaultLayout and load views into corresponding regions
     * @returns {View.DefaultLayout}  fully rendered checkout DefaultLayout
     */
    var defaultView = function () {
      var orderLink = getOrderLink();

      pace.start();

      checkoutModel.fetch({
        url: checkoutModel.getUrl(orderLink),
        success: function (response) {
          setAsChosen('billingAddresses', 'checkout.updateChosenBillingAddressRequest');
          setAsChosen('shippingAddresses', 'checkout.updateChosenShippingAddressRequest');
          setAsChosen('shippingOptions', 'checkout.updateChosenShippingOptionRequest');
          setAsChosen('paymentMethods', 'checkout.updateChosenPaymentMethodRequest');

          checkoutLayout.checkoutTitleRegion.show(new View.CheckoutTitleView());

          checkoutLayout.billingAddressesRegion.show(
            new View.BillingAddressesCompositeView({
              collection: new Backbone.Collection(checkoutModel.get('billingAddresses'))
            })
          );

          // Only show if the cart contains physical items requiring shipment
          if (checkoutModel.get('deliveryType') === "SHIPMENT") {
            checkoutLayout.shippingAddressesRegion.show(
              new View.ShippingAddressesCompositeView({
                collection: new Backbone.Collection(checkoutModel.get('shippingAddresses'))
              })
            );
            // Only populate the shipping options region if there is at least one shipping address
            if (checkoutModel.get('shippingAddresses').length > 0) {
              shippingOptionsCollection = new Model.CheckoutShippingOptionsCollection(response.get('shippingOptions'));
              checkoutLayout.shippingOptionsRegion.show(
                new View.ShippingOptionsCompositeView({
                  collection: shippingOptionsCollection
                })
              );
            }
          }

          if (checkoutModel.get('showPaymentMethods')) {
            paymentMethodCollection = new Model.CheckoutPaymentMethodsCollection(response.get('paymentMethods'));
            checkoutLayout.paymentMethodsRegion.show(
              new View.PaymentMethodsCompositeView({
                collection: paymentMethodCollection
              })
            );
          }

          checkoutSummaryModel = new Model.CheckoutSummaryModel(response.get('summary'));
          var checkoutSummaryView = new View.CheckoutSummaryView({
            model: checkoutSummaryModel
          });

          checkoutSummaryView.on('show', function() {
            // Only show taxes summary if tax amount is greater than zero
            if ( (checkoutModel.get('summary').taxes.length) &&
                 (checkoutModel.get('summary').taxes[0].amount > 0) ) {
              checkoutSummaryView.checkoutTaxTotalRegion.show(
                new View.CheckoutTaxTotalView({
                  model: new Backbone.Model(checkoutModel.get('summary').taxTotal)
                })
              );
              checkoutSummaryView.checkoutTaxBreakDownRegion.show(
                new View.CheckoutTaxesCollectionView({
                  collection: new Backbone.Collection(checkoutModel.get('summary').taxes)
                })
              );
            }
            // If there are shipping costs, show them in the checkout summary
            if (checkoutModel.get('summary').shippingTotal) {
                checkoutSummaryView.checkoutShippingTotalRegion.show(
                  new View.CheckoutShippingTotalView({
                    model: new Backbone.Model(checkoutModel.get('summary').shippingTotal)
                  })
                );
            }
          });

          checkoutLayout.checkoutOrderRegion.show(checkoutSummaryView);
        }
      });

      return checkoutLayout;
    };

    /**
     * Get a order link for model fetch url, or trigger checkout access error event
     * @returns String order link (href to access order resource on server)
     */
    function getOrderLink () {
      // Attempt to retrieve an order link from session storage (set by the checkout module)
      var orderLink = ep.io.sessionStore.getItem('orderLink');

      // Trigger an error if we are unable to retrieve a Cortex order link
      if (!orderLink) {
        EventBus.trigger('checkout.checkoutAccessError');
      }

      return orderLink;
    }

    /**
     * If the model suggests we need to set a chosen (billing/ shipping address, or shipping option),
     * trigger a call to Cortex to formerly set it to display correct summary information
     * @param arrayName name of array of the selectors
     * @param eventName name of event to update chosen selection.
     */
    function setAsChosen (arrayName, eventName) {
      if (checkoutModel.get(arrayName).length && checkoutModel.get(arrayName)[0].setAsDefaultChoice) {
        EventBus.trigger(
          eventName,
          checkoutModel.get(arrayName)[0].selectAction
        );
      }
    }

    /* ********** SUBMIT ORDER EVENT LISTENERS ************ */
    /**
     * Submit order to cortex.
     * @param submitOrderLink action-link to submit order to.
     */
    function submitOrder(submitOrderLink) {
      if (!submitOrderLink) {
        // FIXME [CU-92] user feedback??
        ep.logger.warn('checkout.submitOrderRequest called with no submitOrderLink');
        return;
      }

      var ajaxModel = new ep.io.defaultAjaxModel({
        type: 'POST',
        url: submitOrderLink,
        success: function (data, textStatus, XHR) {
          // Remove order link data from sessionStorage
          ep.io.sessionStore.removeItem('orderLink');

          var obj = {
            data: data,
            textStatus: textStatus,
            XHR: XHR
          };
          EventBus.trigger('checkout.submitOrderSuccess', obj);
        },
        customErrorFn: function (response) {
          EventBus.trigger('checkout.submitOrderFailed', response);
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
     * will show a toast error message and refresh the entire page.
     */
    EventBus.on('checkout.submitOrderFailed', function(response) {
      $().toastmessage('showToast', {
        text: i18n.t('checkout.submitOrderError'),
        sticky: true,
        position: 'middle-center',
        type: 'error',
        close: function() {
          Backbone.history.loadUrl();
        }
      });
    });

    /**
     * Listening to the event fired when we are unable to load the order data.
     * Routes the user to the cart.
     */
    EventBus.on('checkout.checkoutAccessError', function() {
      ep.logger.error('unable to load checkout - missing order link data');
      ep.router.navigate(ep.app.config.routes.cart, true);
    });

    /* ********** CHOOSE BILLING ADDRESS EVENT LISTENERS ************ */
    function displayStickyErrMsg (sectionName) {
      // Display sticky error message
      $().toastmessage('showToast', {
        text: i18n.t('checkout.updateChosenErrMsg.' + sectionName),
        sticky: true,
        position: 'middle-center',
        type: 'error'
      });
    }

    /**
     * Handler for the checkout.billingAddressRadioChanged event.
     */
    EventBus.on('checkout.billingAddressRadioChanged', function(actionLink) {
      EventBus.trigger('checkout.updateChosenBillingAddressRequest', actionLink);
    });

    /**
     * Listening to request to update the chosen billing address. Will request to the Cortex server.
     */
    EventBus.on('checkout.updateChosenBillingAddressRequest', updateChosenBillingAddress);

    /**
     * Listening to the event fired on successful update of the chosen billing address.
     * Reload regions so display in in-sync with server
     */
    EventBus.on('checkout.updateChosenBillingAddressSuccess', refreshBillingAddressViews);

    /**
     * Listening to the event fired when the update of a chosen billing address fails.
     * Displays a toast error message, and reload regions so display in in-sync with server.
     */
    EventBus.on('checkout.updateChosenBillingAddressFail', updateChosenBillingAddressFailed);

    /**
     * Make a ajax POST request to cortex server with given action links, and trigger corresponding events
     * in case of success or error. Start activity indicator in affected regions.
     *
     * @param actionLink url to post request to server with.
     */
    function updateChosenBillingAddress(actionLink) {
      if (actionLink) {
        var ajaxModel = new ep.io.defaultAjaxModel({
          type: 'POST',
          url: actionLink,
          success: function() {
            EventBus.trigger('checkout.updateChosenBillingAddressSuccess');
          },
          customErrorFn: function() {
            EventBus.trigger('checkout.updateChosenBillingAddressFail');
          }
        });

        ep.io.ajax(ajaxModel.toJSON());
      }
      else {
        ep.logger.error("Trying to update chosen billing address without action link");
      }
    }


    /**
     * Refresh views affected by changing billing address selector with data from Cortex.
     * Removes activity indicator on reload success.
     */
    function refreshBillingAddressViews() {
      Backbone.history.loadUrl();
    }

    /**
     * In case of billing address selection update failure, will notify user with toastmessage error, and reload regions
     * with date from Cortex server.
     */
    function updateChosenBillingAddressFailed() {
      displayStickyErrMsg('billingAddress');
      refreshBillingAddressViews();
    }


    /* ********** CHOOSE SHIPPING ADDRESS EVENT LISTENERS ************ */
    /**
     * Handler for the checkout.shippingAddressRadioChanged event.
     */
    EventBus.on('checkout.shippingAddressRadioChanged', function(actionLink) {
      EventBus.trigger('checkout.updateChosenShippingAddressRequest', actionLink);
    });

    /**
     * Listening to request to update the chosen shipping address. Will request to the Cortex server.
     */
    EventBus.on('checkout.updateChosenShippingAddressRequest', updateChosenShippingAddress);

    /**
     * Listening to the event fired on successful update of the chosen shipping address.
     * Reload regions so display in in-sync with server
     */
    EventBus.on('checkout.updateChosenShippingAddressSuccess', refreshShippingAddressViews);

    /**
     * Listening to the event fired when the update of a chosen shipping address fails.
     * Displays a toast error message, and reload regions so display in in-sync with server.
     */
    EventBus.on('checkout.updateChosenShippingAddressFail', updateChosenShippingAddressFailed);

    /**
     * Make a ajax POST request to cortex server with given action links, and trigger corresponding events
     * in case of success or error. Start activity indicator in affected regions.
     *
     * @param actionLink url to post request to server with.
     */
    function updateChosenShippingAddress(actionLink) {
      if (actionLink) {
        var ajaxModel = new ep.io.defaultAjaxModel({
          type: 'POST',
          url: actionLink,
          success: function() {
            EventBus.trigger('checkout.updateChosenShippingAddressSuccess');
          },
          customErrorFn: function() {
            EventBus.trigger('checkout.updateChosenShippingAddressFail');
          }
        });

        ep.io.ajax(ajaxModel.toJSON());
      }
      else {
        ep.logger.error("Trying to update chosen shipping address without action link");
      }
    }


    /**
     * Refresh views affected by changing shipping address selector with data from Cortex.
     * Removes activity indicator on reload success.
     */
    function refreshShippingAddressViews() {
      Backbone.history.loadUrl();
    }

    /* ********** SHIPPING OPTION EVENT LISTENERS ************ */
    /**
     * In case of shipping address selection update failure, will notify user with toastmessage error, and reload regions
     * with date from Cortex server.
     */
    function updateChosenShippingAddressFailed() {
      displayStickyErrMsg('shippingAddress');
      refreshShippingAddressViews();
    }


    /* ********** CHOOSE SHIPPING OPTION EVENT LISTENERS ************ */
    /**
     * Handler for the checkout.shippingOptionRadioChanged event.
     */
    EventBus.on('checkout.shippingOptionRadioChanged', function(actionLink) {
      EventBus.trigger('checkout.updateChosenShippingOptionRequest', actionLink);
    });

    /**
     * Listening to request to update the chosen shipping option. Will request to the Cortex server.
     */
    EventBus.on('checkout.updateChosenShippingOptionRequest', updateChosenShippingOption);

    /**
     * Listening to the event fired on successful update of the chosen shipping option.
     * Reload regions so display in in-sync with server
     */
    EventBus.on('checkout.updateChosenShippingOptionSuccess', refreshShippingOptionViews);

    /**
     * Listening to the event fired when the update of a chosen shipping option fails.
     * Displays a toast error message, and reload regions so display in in-sync with server.
     */
    EventBus.on('checkout.updateChosenShippingOptionFailed', updateChosenShippingOptionFailed);

    /**
     * Make a ajax POST request to cortex server with given action links, and trigger corresponding events
     * in case of success or error. Start activity indicator in affected regions.
     *
     * @param actionLink url to post request to server with.
     */
    function updateChosenShippingOption(actionLink) {
      if (actionLink) {
        var ajaxModel = new ep.io.defaultAjaxModel({
          type: 'POST',
          url: actionLink,
          success: function() {
            EventBus.trigger('checkout.updateChosenShippingOptionSuccess');
          },
          customErrorFn: function() {
            EventBus.trigger('checkout.updateChosenShippingOptionFailed');
          }
        });

        ep.io.ajax(ajaxModel.toJSON());
      }
      else {
        ep.logger.error("Trying to update chosen shipping option without action link");
      }
    }


    /**
     * Refresh views affected by changing shipping option selector with data from Cortex.
     * Removes activity indicator on reload success.
     */
    function refreshShippingOptionViews() {
      Backbone.history.loadUrl();
    }

    /**
     * In case of shipping option selection update failure, will notify user with toastmessage error, and reload regions
     * with date from Cortex server.
     */
    function updateChosenShippingOptionFailed() {
      displayStickyErrMsg('shippingOption');
      refreshShippingOptionViews();
    }


    /* ********** CHOOSE PAYMENT METHOD EVENT LISTENERS ************ */
    /**
     * Handler for the checkout.paymentMethodRadioChanged event.
     */
    EventBus.on('checkout.paymentMethodRadioChanged', function(actionLink) {
      EventBus.trigger('checkout.updateChosenPaymentMethodRequest', actionLink);
    });

    /**
     * Listening to request to update the chosen payment method. Will request to the Cortex server.
     */
    EventBus.on('checkout.updateChosenPaymentMethodRequest', updateChosenPaymentMethod);

    /**
     * Listening to the event fired on successful update of the chosen payment method.
     * Reload regions so display in in-sync with server
     */
    EventBus.on('checkout.updateChosenPaymentMethodSuccess', refreshPaymentMethodViews);

    /**
     * Listening to the event fired when the update of a chosen payment method fails.
     * Displays a toast error message, and reload regions so display in in-sync with server.
     */
    EventBus.on('checkout.updateChosenPaymentMethodFailed', updateChosenPaymentMethodFailed);

    /**
     * Make a ajax POST request to cortex server with given action links, and trigger corresponding events
     * in case of success or error. Start activity indicator in affected regions.
     *
     * @param actionLink url to post request to server with.
     */
    function updateChosenPaymentMethod(actionLink) {
      if (actionLink) {
        var ajaxModel = new ep.io.defaultAjaxModel({
          type: 'POST',
          url: actionLink,
          success: function() {
            EventBus.trigger('checkout.updateChosenPaymentMethodSuccess');
          },
          customErrorFn: function() {
            EventBus.trigger('checkout.updateChosenPaymentMethodFailed');
          }
        });

        ep.io.ajax(ajaxModel.toJSON());

        ep.ui.startActivityIndicator(checkoutLayout.paymentMethodsRegion.currentView);
        ep.ui.startActivityIndicator(checkoutLayout.checkoutOrderRegion.currentView);
      }
      else {
        ep.logger.error("Trying to update chosen payment method without action link");
      }
    }

    /**
     * Refresh views affected by changing payment method selector with data from Cortex.
     * Removes activity indicator on reload success.
     */
    function refreshPaymentMethodViews() {
      var orderLink = getOrderLink();

      checkoutModel.fetch({
        url: checkoutModel.getUrl(orderLink),
        success: function(response) {
          // FIXME summary view needs to setup modelEvent to reload on change.
          // however, this cannot be done. onShow function is inside DefaultView function,
          // need to move it into view so display logic isn't lost on this fetch
//          checkoutSummaryModel.set(response.get('summary'));
          paymentMethodCollection.update(response.get('paymentMethods'));

          ep.ui.stopActivityIndicator(checkoutLayout.paymentMethodsRegion.currentView);
          ep.ui.stopActivityIndicator(checkoutLayout.checkoutOrderRegion.currentView);
        }
      });
    }

    /**
     * In case of payment method selection update failure, will notify user with toastmessage error, and reload regions
     * with date from Cortex server.
     */
    function updateChosenPaymentMethodFailed() {
      displayStickyErrMsg('paymentMethod');
      refreshPaymentMethodViews();
    }


    /* ********** ADD NEW ADDRESS EVENT LISTENERS ************ */
    /**
     * Listen to add new address button clicked signal
     * will load address form
     */
    EventBus.on('checkout.addNewAddressBtnClicked', function () {
      Mediator.fire('mediator.addNewAddressRequest', 'checkout');
    });

    return {
      DefaultView: defaultView
    };
  }
);
