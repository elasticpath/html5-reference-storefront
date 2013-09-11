/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.

 * User: sbrookes
 * Date: 15/08/13
 * Time: 3:49 PM
 *
 */
define(['ep','eventbus','router'],function(ep, EventBus, Router){

  var mediatorObj = {
    'mediator.loadLogoComponentRequest':function(reqEventData){
      require(['appheader'],function(mod){
        EventBus.trigger('appheader.loadLogoComponent',reqEventData);
      });
    },
    'mediator.globalNavRendered':function(){
        EventBus.trigger('layout.loadRegionContentRequest',{
          region:'authMenuItemRegion',
          module:'auth',
          view:'DefaultView'
        });
      /*require(['cart'],function(mod){
        EventBus.trigger('cart.loadGlobalNavAuthMenuRequest');
      });*/
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

          document.location.href = '#confirmation/' + ep.ui.encodeUri(uri);
        });

//        EventBus.trigger('layout.loadRegionContentRequest',{
//          region:'appMainRegion',
//          module:'cart',
//          view:'PurchaseConfirmationView',
//          data:uri
//        });
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

      mediatorObj[reqEventName](reqEventData);







    }



  }


  return {
    fire:fire
  };
});
