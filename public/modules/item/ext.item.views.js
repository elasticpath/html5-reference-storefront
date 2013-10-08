/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 */
define(['ep','marionette','i18n','eventbus','pace'],
  function(ep,Marionette,i18n,EventBus,pace){


    // Default Title View
    var defaultItemTitleView = Backbone.Marionette.ItemView.extend({
      template:'#DefaultItemTitleTemplate2',
      onShow:function(){

      }
    });





    return {
      DefaultItemTitleView:defaultItemTitleView



    };
  }
);
