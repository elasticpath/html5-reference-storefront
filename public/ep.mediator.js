/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.

 * User: sbrookes
 * Date: 15/08/13
 * Time: 3:49 PM
 *
 */
define(['ep','eventbus','router'],function(ep, EventBus, Router){

  var mediatorObj = {
    // FIXME add loadRegionContentEvents to base.denpendency.config
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
        EventBus.trigger('app.authInit'); // FIXME for reload page
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
          var link = ep.app.config.routes.receipt + '/' + ep.ui.encodeUri(uri);
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
    'mediator.setReturnUrlInAddressForm' : function(url) {
      require(['address'],function(mod){
        EventBus.trigger('address.setReturnUrl', url);
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
    }
  };


  function fire(){

    var args = arguments;
    if (args.length > 0){
      var reqEventName  = args[0];
      //ep.logger.info('Mediator: ' + reqEventName);
      var reqEventData;
      if (args.length > 1){
        reqEventData = args[1];
      }

      // FIXME allow multiple arguments!
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
