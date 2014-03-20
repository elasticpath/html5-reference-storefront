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
    var checkoutSummaryModel = new Model.CheckoutSummaryModel();
    var billingAddressCollection = new Backbone.Collection();
    var shippingAddressCollection = new Backbone.Collection();
    var shippingOptionsCollection = new Model.CheckoutShippingOptionsCollection();
    var paymentMethodCollection = new Model.CheckoutPaymentMethodsCollection();

    var checkoutLayout = new View.DefaultLayout();


    /**
     * Controller logic to render billing address views in designated region
     * @param region  region to render the view into
     */
    var showBillingAddressesView = function(region) {
      var profileBillingAddressesView =  new View.BillingAddressesCompositeView({
        collection: billingAddressCollection
      });

      region.show(profileBillingAddressesView);
    };

    /**
     * Controller logic to render shipping address views in designated region (and calls showShippingOptionView function
     * to render shipping option views into shippingOptionsRegion
     * @param region  region to render the view into
     */
    var showShippingAddressesView = function(region) {
      var profileShippingAddressesView = new View.ShippingAddressesCompositeView({
        collection: shippingAddressCollection
      });

      // Only populate the shipping options region if there is at least one shipping address
      if (shippingAddressCollection.length > 0) {
        setAsChosen('shippingOptions', 'checkout.updateChosenShippingOptionRequest');
        shippingOptionsCollection.update(checkoutModel.get('shippingOptions'));
        showSippingOptionsView(checkoutLayout.shippingOptionsRegion);
      }

      region.show(profileShippingAddressesView);
    };

    /**
     * Controller logic to render shipping option views in designated region
     * @param region  region to render the view into
     */
    var showSippingOptionsView = function(region) {
      var profileShippingOptionsView = new View.ShippingOptionsCompositeView({
        collection: shippingOptionsCollection
      });
      region.show(profileShippingOptionsView);
    };

    /**
     * Controller logic to render payment method views in designated region
     * @param region  region to render the view into
     */
    var showPaymentMethodsView = function (region) {
      var profilePaymentMethodsView = new View.PaymentMethodsCompositeView({
        collection: paymentMethodCollection
      });
      region.show(profilePaymentMethodsView);
    };

    /**
     * Controller logic to render checkout summary views in designated region
     * @param region  region to render the summary view into
     */
    var showCheckoutSummaryView = function (region) {
      var checkoutSummaryView = new View.CheckoutSummaryView({
        model: checkoutSummaryModel
      });

      checkoutSummaryView.on('show', function() {
        // Only show taxes summary if tax amount is greater than zero
        var taxes = checkoutSummaryModel.get('taxes');
        if ( taxes && taxes.length && taxes[0].amount > 0 ) {
          checkoutSummaryView.checkoutTaxTotalRegion.show(
            new View.CheckoutTaxTotalView({
              model: new Backbone.Model(checkoutSummaryModel.get('taxTotal'))
            })
          );
          checkoutSummaryView.checkoutTaxBreakDownRegion.show(
            new View.CheckoutTaxesCollectionView({
              collection: new Backbone.Collection(taxes)
            })
          );
        }
        // If there are shipping costs, show them in the checkout summary
        var shippingTotal = checkoutSummaryModel.get('shippingTotal');
        if (shippingTotal) {
          checkoutSummaryView.checkoutShippingTotalRegion.show(
            new View.CheckoutShippingTotalView({
              model: new Backbone.Model(shippingTotal)
            })
          );
        }
      });

      region.show(checkoutSummaryView);
    };


    /**
     * Instantiate an checkout DefaultLayout and load views into corresponding regions
     * @returns {View.DefaultLayout}  fully rendered checkout DefaultLayout
     */
    var defaultController = function () {
      var orderLink = getOrderLink();

      checkoutModel.fetch({
        url: checkoutModel.getUrl(orderLink),
        success: function (response) {
          checkoutLayout.checkoutTitleRegion.show(new View.CheckoutTitleView());

          setAsChosen('billingAddresses', 'checkout.updateChosenBillingAddressRequest');
          billingAddressCollection.update(checkoutModel.get('billingAddresses'));
          showBillingAddressesView(checkoutLayout.billingAddressesRegion);

          // Only show if the cart contains physical items requiring shipment
          if (checkoutModel.get('deliveryType') === "SHIPMENT") {
            setAsChosen('shippingAddresses', 'checkout.updateChosenShippingAddressRequest');
            shippingAddressCollection.update(checkoutModel.get('shippingAddresses'));
            // shipping Options views' rendering logic is included inside showShippingAddressView
            // as shipping options view will change when shipping address changes
            showShippingAddressesView(checkoutLayout.shippingAddressesRegion);
          }

          setAsChosen('paymentMethods', 'checkout.updateChosenPaymentMethodRequest');
          if (checkoutModel.get('showPaymentMethods')) {
            paymentMethodCollection.update(response.get('paymentMethods'));
            showPaymentMethodsView(checkoutLayout.paymentMethodsRegion);
          }

          checkoutSummaryModel.clear();
          checkoutSummaryModel.set(response.get('summary'));
          showCheckoutSummaryView(checkoutLayout.checkoutOrderRegion);
        }
      });

      return checkoutLayout;
    };

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
      ep.ui.disableButton(checkoutLayout.checkoutOrderRegion.currentView, 'submitOrderButton');

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

        ep.ui.startActivityIndicator(checkoutLayout.billingAddressesRegion.currentView);
        ep.ui.startActivityIndicator(checkoutLayout.checkoutOrderRegion.currentView);
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
      var orderLink = getOrderLink();

      checkoutModel.fetch({
        url: checkoutModel.getUrl(orderLink),
        success: function(response) {
          billingAddressCollection.update(response.get('billingAddresses'));
          showBillingAddressesView(checkoutLayout.billingAddressesRegion);

          checkoutSummaryModel.clear();
          checkoutSummaryModel.set(response.get('summary'));
          showCheckoutSummaryView(checkoutLayout.checkoutOrderRegion);

          ep.ui.stopActivityIndicator(checkoutLayout.billingAddressesRegion.currentView);
          ep.ui.stopActivityIndicator(checkoutLayout.checkoutOrderRegion.currentView);
        }
      });
    }

    /**
     * In case of billing address selection update failure, will notify user with toastmessage error, and reload regions
     * with date from Cortex server.
     */
    function updateChosenBillingAddressFailed() {
      displayStickyErrMsg('billingAddress');
      refreshBillingAddressViews();
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


    /* ********** CHOOSE SHIPPING ADDRESS EVENT LISTENERS ************ */
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

        ep.ui.startActivityIndicator(checkoutLayout.shippingAddressesRegion.currentView);
        ep.ui.startActivityIndicator(checkoutLayout.shippingOptionsRegion.currentView);
        ep.ui.startActivityIndicator(checkoutLayout.checkoutOrderRegion.currentView);
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
      var orderLink = getOrderLink();

      checkoutModel.fetch({
        url: checkoutModel.getUrl(orderLink),
        success: function(response) {
          shippingAddressCollection.update(checkoutModel.get('shippingAddresses'));
          showShippingAddressesView(checkoutLayout.shippingAddressesRegion);

          checkoutSummaryModel.clear();
          checkoutSummaryModel.set(response.get('summary'));
          showCheckoutSummaryView(checkoutLayout.checkoutOrderRegion);

          ep.ui.stopActivityIndicator(checkoutLayout.shippingAddressesRegion.currentView);
          ep.ui.stopActivityIndicator(checkoutLayout.shippingOptionsRegion.currentView);
          ep.ui.stopActivityIndicator(checkoutLayout.checkoutOrderRegion.currentView);
        }
      });
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


    /* ********** CHOOSE SHIPPING OPTION EVENT LISTENERS ************ */
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

        ep.ui.startActivityIndicator(checkoutLayout.shippingOptionsRegion.currentView);
        ep.ui.startActivityIndicator(checkoutLayout.checkoutOrderRegion.currentView);
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
      var orderLink = getOrderLink();

      checkoutModel.fetch({
        url: checkoutModel.getUrl(orderLink),
        success: function(response) {
          shippingOptionsCollection.update(response.get('shippingOptions'));
          showSippingOptionsView(checkoutLayout.shippingOptionsRegion);

          checkoutSummaryModel.clear();
          checkoutSummaryModel.set(response.get('summary'));
          showCheckoutSummaryView(checkoutLayout.checkoutOrderRegion);

          ep.ui.stopActivityIndicator(checkoutLayout.shippingOptionsRegion.currentView);
          ep.ui.stopActivityIndicator(checkoutLayout.checkoutOrderRegion.currentView);
        }
      });
    }

    /**
     * In case of shipping option selection update failure, will notify user with toastmessage error, and reload regions
     * with date from Cortex server.
     */
    function updateChosenShippingOptionFailed() {
      displayStickyErrMsg('shippingOption');
      refreshShippingOptionViews();
    }

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


    /* ********** CHOOSE PAYMENT METHOD EVENT LISTENERS ************ */
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
     * Refresh views affected by changing payment mthod selector with data from Cortex.
     * Removes activity indicator on reload success.
     */
    function refreshPaymentMethodViews() {
      var orderLink = getOrderLink();

      checkoutModel.fetch({
        url: checkoutModel.getUrl(orderLink),
        success: function(response) {
          paymentMethodCollection.update(response.get('paymentMethods'));
          showPaymentMethodsView(checkoutLayout.paymentMethodsRegion);

          checkoutSummaryModel.clear();
          checkoutSummaryModel.set(response.get('summary'));
          showCheckoutSummaryView(checkoutLayout.checkoutOrderRegion);

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


    /* ********** ADD / DELETE NEW ADDRESS EVENT LISTENERS ************ */
    /**
     * Listen to add new address button clicked signal
     * will load address form
     */
    EventBus.on('checkout.addNewAddressBtnClicked', function () {
      Mediator.fire('mediator.addNewAddressRequest', 'checkout');
    });

    /**
     * Listens to the delete address button clicked signal, fires a mediator strategy to communicate with
     * the address module to render the delete confirmation modal.
     */
    EventBus.on('checkout.deleteAddressBtnClicked', function (href) {
      Mediator.fire('mediator.deleteAddressRequest', {
        href: href,
        indicatorView: checkoutLayout,
        returnModule: 'checkout'
      });
    });

    /**
     * Listens to the edit address button clicked signal, fires a mediator strategy to communicate with
     * the address module to render the edit address form.
     */
    EventBus.on('checkout.editAddressBtnClicked', function (href) {
      Mediator.fire('mediator.editAddressRequest', {
        returnModule: 'checkout',
        href: href
      });
    });

    /**
     * Called when an address has been successfully deleted from Cortex. Performs a fetch of the profile
     * model and updates the collection of addresses with the updated array from Cortex.
     */
    EventBus.on('checkout.updateAddresses', function (indicatorView) {
      ep.ui.stopActivityIndicator(indicatorView);
      /**
       * Many areas of the page need to be updated when an address is deleted, so we perform
       * a full page refresh here instead of opting for a more granular approach
       */
      Backbone.history.loadUrl();
    });

    /* ********** ADD / DELETE NEW PAYMENT EVENT LISTENERS ************ */
    /**
     * Listen to add new payment method button clicked signal
     * will load add new payment method form
     */
    EventBus.on('checkout.addNewPaymentMethodBtnClicked', function () {
      Mediator.fire('mediator.addNewPaymentMethodRequest', 'checkout');
    });

    /**
     * Handler for the delete payment button clicked signal, which triggers a mediator strategy
     * to communicate the request to the payment module.
     */
    EventBus.on('checkout.deletePaymentBtnClicked', function (href) {
      Mediator.fire('mediator.deletePaymentRequest', {
        href: href,
        indicatorView: checkoutLayout.paymentMethodsRegion.currentView,
        returnModule: 'checkout'
      });
    });

    /**
     * Called when an payment method has been successfully deleted from Cortex. Performs a fetch of the profile
     * model and updates the collection of payment methods with the updated array from Cortex.
     */
    EventBus.on('checkout.updatePaymentMethods', function (indicatorView) {
      if (indicatorView) {
        // Stop the activity indicators on the cart regions that are being updated
        ep.ui.stopActivityIndicator(indicatorView);
      }
      ep.ui.startActivityIndicator(checkoutLayout.paymentMethodsRegion.currentView);
      ep.ui.startActivityIndicator(checkoutLayout.checkoutOrderRegion.currentView);

      refreshPaymentMethodViews();
    });

    return {
      DefaultController: defaultController
    };
  }
);