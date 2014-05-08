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
 */
define(function(require){
  var EventBus = require('eventbus');

  var helpers = {
    returnAfterFormDone: function (defaultReturn, returnTo) {
      require(['ep'], function (ep) {
        var moduleName = ep.io.sessionStore.getItem(returnTo);

        // FIXME Change to use Router.getCurrentRoute() and Router.rebuildUrlFragment()
        if (!moduleName) {
          ep.router.navigate(defaultReturn, true);  // if no return module specified, then return to profile
        }
        else {
          var url = ep.app.config.routes[moduleName] || defaultReturn;
          ep.router.navigate(url, true);
          ep.io.sessionStore.removeItem(returnTo);   // clear sessionStorage
        }
      });
    }
  };

  var mediatorObj = {
    'mediator.loadRegionContent': function(controllerName) {
      require(['loadRegionContentEvents'], function(loadRegionContent) {
        loadRegionContent[controllerName]();
      });
    },
    'mediator.loadLogoComponentRequest':function(reqEventData){
      require(['appheader'],function(mod){
        EventBus.trigger('appheader.loadLogoComponent',reqEventData);
      });
    },
    //FIXME include into loadRegionEvents
    'mediator.appHeaderRendered':function(){
        EventBus.trigger('layout.loadRegionContentRequest',{
          region:'authMenuItemRegion',
          module:'auth',
          view:'DefaultView'
        });
        EventBus.trigger('layout.loadRegionContentRequest',{
          region:'mainNavRegion',
          module:'ia',
          view:'MainNavView'
        });
      /*require(['cart'],function(mod){
        EventBus.trigger('cart.loadGlobalNavAuthMenuRequest');
      });*/
    },
    'mediator.getAuthentication':function() {
      require(['auth'],function(){
        EventBus.trigger('auth.btnAuthGlobalMenuItemClicked');
      });
    },
    'mediator.getPublicAuthTokenRequest':function(){
      require(['auth'],function(mod){
        EventBus.trigger('auth.generatePublicAuthTokenRequest');
      });
    },
    'mediator.authenticationSuccess':function(redirect){
      require(['ep'], function(ep) {
        if (redirect) {
          // Navigate to the route fragment _without_ calling its associated function
          ep.router.navigate(redirect);
          /**
           * Trigger a page reload at the new route to ensure all auth-related
           * elements of the page are refreshed e.g. login/user menu in header
           */
          window.location.reload();
        }
        // else this should be a registered login authentication request
        else {
          EventBus.trigger('app.authInit');  // FIXME [CU-89] granular page reload
        }
      });
    },
    'mediator.authenticateForCheckout': function(link) {
      require(['ep'], function(ep) {
        // The order link from the cart model is stored in session for anonymous checkout
        // can be overwritten later
        ep.io.sessionStore.setItem('orderLink', link);

        ep.router.navigate(ep.app.config.routes.checkoutAuth, true);
      });
    },
    'mediator.cart.DefaultViewRendered':function(){
      require(['ia'],function(mod){
        EventBus.trigger('ia.clearSelectedNavRequest');
      });
    },
    'mediator.orderProcessSuccess':function(uri){
      if (uri){
        require(['ep'], function(ep){
          var link = ep.app.config.routes.purchaseReceipt + '/' + ep.ui.encodeUri(uri);
          ep.router.navigate(link, true);
        });
      }
    },
    'mediator.logoutSuccess':function(){
      require(['auth'],function(mod){
        EventBus.trigger('auth.generatePublicAuthTokenRequest');
        document.location.href = '';
      });
    },
    'mediator.loadAddressesViewRequest':function(addressObj){
      require(['address'],function(mod){
        EventBus.trigger('address.loadAddressesViewRequest', addressObj);
      });
    },
    'mediator.loadPaymentMethodViewRequest':function(paymentObj) {
      require(['payment'], function(mod) {
        EventBus.trigger('payment.loadPaymentMethodViewRequest', paymentObj.region, paymentObj.model);
      });
    },
    'mediator.navigateToCheckoutRequest' : function(link) {
      if (link){
        require(['ep'], function(ep){
          // The order link from the cart model is stored in session for use during checkout
          ep.io.sessionStore.setItem('orderLink', link);

          ep.router.navigate(ep.app.config.routes.checkout, true);
        });
      }
    },
    // FIXME [CU-234] could this and the addNewAddressRequest be consolidated?
    'mediator.addNewPaymentMethodRequest': function (options) {
      require(['ep'], function (ep) {
        if (options) {
          ep.io.sessionStore.setItem('paymentFormReturnTo', options.returnModule);
          delete options.returnModule;

          // TODO gather other payment form information
          var formInfo = {
            // retrieve from config (hard coded, RE script change)
            access_key: ep.app.config.paymentGateway.access_key,
            profile_id: ep.app.config.paymentGateway.profile_id,
            locale: ep.app.config.localization.locale,
            currency: ep.app.config.localization.currency,
            // hard-coded
            transaction_type: 'create_payment_token',
            payment_method: 'card',
            signed_field_names: "access_key,profile_id,transaction_uuid,signed_field_names,unsigned_field_names,signed_date_time,locale,transaction_type,reference_number,currency,payment_method,bill_to_forename,bill_to_surname,bill_to_address_line1,bill_to_address_city,bill_to_address_state,bill_to_address_country,bill_to_address_postal_code",
            unsigned_field_names: "card_type,card_number,card_expiry_date,card_cvn,bill_to_email"
        };

          // TODO this number should be unique
          formInfo.reference_number = 123456789;


            // combine billing + payment form info into signed info
          var data = _.extend(options, formInfo);

          ep.router.navigate(ep.app.config.routes.newPayment);
          EventBus.trigger('layout.loadRegionContentRequest', {
            region: 'appMainRegion',
            module: 'payment',
            view: 'DefaultCreatePaymentController',
            data: data
          });
        }
        else {
          ep.logger.error('mediator.addNewPaymentMethodRequest was called with invalid moduleName: ' + options);
        }
      });
    },
    /**
     * Strategy fired by the payment module to notify the profile module of a request
     * to save a new payment method to a shopper's profile.
     *
     * @param formData {Object} Data retrieved from the fields of the new payment method form
     */
    'mediator.savePaymentMethodToProfileRequest': function (formData) {
      require(['profile'], function (profile) {
        EventBus.trigger('profile.getSavePaymentMethodToProfileUrl', formData);
      });
    },
    /**
     * Strategy to notify the payment module that a new payment method request is ready to be sent to Cortex.
     * This strategy is fired after the action URL for the new payment method request has been retrieved.
     *
     * @param requestObj {Object} Contains the action URL and new payment method form data for the Cortex request.
     */
    'mediator.submitPaymentMethodForm': function (requestObj) {
      require(['payment'], function (payment) {
        EventBus.trigger('payment.submitPaymentMethodForm', requestObj.data, requestObj.url);
      });
    },
    'mediator.addNewAddressRequest': function (moduleName) {
      require(['ep'], function (ep) {
        if (moduleName) {
          ep.io.sessionStore.setItem('addressFormReturnTo', moduleName);
          ep.router.navigate(ep.app.config.routes.newAddress, true);
        }
        else {
          ep.logger.error('mediator.addNewAddressRequest was called with invalid moduleName: ' + moduleName);
        }
      });
    },
    /**
     * Communicates back to the referring module that a delete address request has succeeded.
     * @param indicatorView An optional reference to a Marionette.View to which an activity indicator has been applied.
     */
    'mediator.deleteAddressComplete': function (indicatorView) {
      require(['ep'], function (ep) {
        var moduleName = ep.io.sessionStore.getItem('deleteAddressReturnTo');
        ep.io.sessionStore.removeItem('deleteAddressReturnTo');
        switch (moduleName) {
          case 'profile':
            require(['profile'], function (profile) {
              EventBus.trigger('profile.updateAddresses', indicatorView);
            });
            break;
          case 'checkout':
            require(['checkout'], function (checkout) {
              EventBus.trigger('checkout.updateAddresses', indicatorView);
            });
            break;
          default:
            // Navigate to the home page route as a default and log an error message
            ep.router.navigate('', true);
            ep.logger.error('mediator.deleteAddressComplete: unable to retrieve return module from session storage');
        }
      });
    },
    /**
     * Communicates delete address requests to the address module.
     * @param {Object} args Can contain:
     *                      - href The href of the address to be deleted
     *                      - indicatorView (optional) Marionette.View to which an activity indicator can be applied
     *                      - returnModule The module to which control should be returned upon completion
     */
    'mediator.deleteAddressRequest': function (args) {
      require(['ep', 'address'], function (ep, address) {
        // Store a return module so control can be returned to the correct module
        // (e.g. profile or checkout) upon completion of the delete operation
        if (args.returnModule) {
          ep.io.sessionStore.setItem('deleteAddressReturnTo', args.returnModule);
        }
        // Triggers the delete confirmation event from the address module (the first step in the delete address process)
        EventBus.trigger('address.deleteAddressConfirm', args);
      });
    },
    'mediator.editAddressRequest':function(arg){
      require(['ep'],function(ep){
        if (arg.returnModule) {
          ep.io.sessionStore.setItem('addressFormReturnTo', arg.returnModule);

          var editAddressLink = ep.app.config.routes.editAddress + '/' + ep.ui.encodeUri(arg.href);
          ep.router.navigate(editAddressLink, true);
        }
        else {
          ep.logger.error('mediator.editAddressRequest was called with invalid arguments: ' + JSON.stringify(arg));
        }
      });
    },
    /**
     * Communicates delete address requests to the address module.
     * @param {Object} args Can contain:
     *                      - href The href of the address to be deleted
     *                      - indicatorView (optional) Marionette.View to which an activity indicator can be applied
     *                      - returnModule The module to which control should be returned upon completion
     */
    'mediator.deletePaymentRequest': function (args) {
      require(['ep', 'payment'], function (ep, address) {
        // Store a return module so control can be returned to the correct module
        // (e.g. profile or checkout) upon completion of the delete operation
        if (args.returnModule) {
          ep.io.sessionStore.setItem('deletePaymentReturnTo', args.returnModule);
        }
        EventBus.trigger('payment.deletePaymentConfirm', args);
      });
    },
    /**
     * Communicates back to the referring module that a delete payment request has succeeded.
     * @param indicatorView An optional reference to a Marionette.View to which an activity indicator has been applied.
     */
    'mediator.deletePaymentComplete': function (indicatorView) {
      require(['ep'], function (ep) {
        var moduleName = ep.io.sessionStore.getItem('deletePaymentReturnTo');
        ep.io.sessionStore.removeItem('deletePaymentReturnTo');
        switch (moduleName) {
          case 'profile':
            require(['profile'], function (profile) {
              EventBus.trigger('profile.updatePaymentMethods', indicatorView);
            });
            break;
          case 'checkout':
            require(['checkout'], function (checkout) {
              EventBus.trigger('checkout.updatePaymentMethods', indicatorView);
            });
            break;
          default:
            // Navigate to the home page route as a default and log an error message
            ep.router.navigate('', true);
            ep.logger.error('mediator.deletePaymentComplete: unable to retrieve return module from session storage');
        }
      });
    },
    'mediator.paymentFormComplete': function () {
      helpers.returnAfterFormDone('#profile', 'paymentFormReturnTo');
    },
    'mediator.addressFormComplete': function () {
      helpers.returnAfterFormDone('#profile', 'addressFormReturnTo');
    },
    'mediator.registrationRequest': function(redirect) {
      require(['ep'], function (ep) {
        // Get the current route as an object
        var currentRoute = ep.router.getCurrentRoute();

        // if redirect location is specified, store it as well so can be redirected on registration success,
        if (redirect) {
          currentRoute.redirect = redirect;
        }

        // Stringify the return route object so it can be stored in sessionStorage
        var routeForStorage = JSON.stringify(currentRoute);
        ep.io.sessionStore.setItem('registrationFormReturnTo', routeForStorage);

        // Navigate to the registration route
        ep.router.navigate(ep.app.config.routes.registration, true);

      });
    }
  };


  function fire(){

    var args = arguments;
    if (args.length > 0){
      // FIXME [CU-197] check the validity of args[0] as strategy name
      var reqEventName  = args[0];
      //ep.logger.info('Mediator: ' + reqEventName);
      var reqEventData;
      if (args.length > 1){
        reqEventData = args[1];
      }

      // FIXME [CU-197] allow multiple arguments!
      mediatorObj[reqEventName](reqEventData);
    }
  }


  return {
    fire:fire,
    testVariable: {
      MediatorStrategies: mediatorObj
    }
  };
});
