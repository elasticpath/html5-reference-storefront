/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.

 * User: sbrookes
 * Date: 15/08/13
 * Time: 3:49 PM
 *
 */
define(['eventbus'],function(EventBus){

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
    }

  };


  function fire(){

    var args = arguments;
    if (args.length > 0){
      var reqEventName  = args[0];
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
