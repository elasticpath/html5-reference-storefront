/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.

 * User: sbrookes
 * Date: 15/08/13
 * Time: 3:49 PM
 *
 */
define(['eventbus'],function(EventBus){

  var mediatorObj = {
    'mediator.loadLogoComponentRequest':function(){
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
