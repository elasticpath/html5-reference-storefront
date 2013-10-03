/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 26/04/13
 * Time: 3:08 PM
 *
 */
define(['backbone','eventbus'],
  function(Backbone,EventBus){

    var ProfileView = Backbone.Marionette.ItemView.extend({
      template:'#UserModuleDefaultTemplate'
    });
    return{
      ProfileView:ProfileView
    }
  }
);
