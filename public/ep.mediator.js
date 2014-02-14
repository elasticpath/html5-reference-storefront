/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 */
define(function(require){
  var EventBus = require('eventbus');

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
    'mediator.authenticationSuccess':function(role){
      // check if this is an anonymous authentication request
      if (role === 'PUBLIC') {
        EventBus.trigger('app.authInit'); // FIXME [CU-89] granular page reload
      }
      // else this should be a registered login authentication request
      else {
        EventBus.trigger('app.authInit');
      }
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
    'mediator.addressFormComplete': function () {
      require(['ep'], function (ep) {
        var moduleName = ep.io.sessionStore.getItem('addressFormReturnTo');

        // FIXME Change to use Router.getCurrentRoute() and Router.rebuildUrlFragment()
        if (!moduleName) {
          ep.router.navigate('#profile', true);  // if no return module specified, then return to profile
        }
        else {
//          require([moduleName], function() {
//            EventBus.trigger(moduleName + '.addressFormComplete');
//          });

          var url = ep.app.config.routes[moduleName] || '#profile';
          ep.router.navigate(url, true);
          ep.io.sessionStore.removeItem('addressFormReturnTo');   // clear sessionStorage
        }
      });
    },
    'mediator.registrationRequest': function() {
      require(['ep'], function (ep) {
        // Get the current route as an object
        var currentRoute = ep.router.getCurrentRoute();

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
