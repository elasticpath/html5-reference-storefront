/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 02/04/13
 * Time: 8:25 AM
 *
 */
define(['marionette','eventbus','pace'],
  function(Marionette, EventBus,pace) {

    var appRouterController = {
      index: function() {
        EventBus.trigger('layout.loadRegionContentRequest',{
          region:'appMainRegion',
          module:'home',
          view:'IndexLayout'
        });
      },
      item: function(uri) {
        EventBus.trigger('layout.loadRegionContentRequest',{
          region:'appMainRegion',
          module:'item',
          view:'DefaultView',
          data:uri
        });
      },
      cart: function(){
        EventBus.trigger('layout.loadRegionContentRequest',{
          region:'appMainRegion',
          module:'cart',
          view:'DefaultView'
        });
      },
      checkout: function() {
        EventBus.trigger('layout.loadRegionContentRequest', {
          region:'appMainRegion',
          module:'cart',
          view:'CheckoutView'
        });
      },
      confirmation: function(id){
        EventBus.trigger('layout.loadRegionContentRequest',{
          region:'appMainRegion',
          module:'receipt',
          view:'DefaultView',
          data:id
        });
      },
      category: function(uri, pageuri) {
        pace.start();
        EventBus.trigger('layout.loadRegionContentRequest',{
          region:'appMainRegion',
          module:'category',
          view:'DefaultView',
          data: {
            uri: uri,
            pageUri: pageuri
          }
        });
      },
      search: function(keywords) {
        EventBus.trigger('layout.loadRegionContentRequest',{
          region:'appMainRegion',
          module:'search',
          view:'SearchResultsView',
          data:keywords
        });
      },
      profile: function(){
        EventBus.trigger('layout.loadRegionContentRequest',{
          region:'appMainRegion',
          module:'profile',
          view:'DefaultView'
        });
      },
      newaddressform: function() {
        EventBus.trigger('layout.loadRegionContentRequest',{
          region: 'appMainRegion',
          module: 'address',
          view: 'DefaultCreateAddressView'
        });
      }
    };

    var router = Backbone.Marionette.AppRouter.extend({
      appRoutes:{
        '': 'index',
        'home': 'index',
        'category' : 'category',
        'category/:uri' : 'category',
        'category/:uri/:pageuri' : 'category',
        'search' : 'search',
        'search/:keywords' : 'search',
        'itemdetail/:uri': 'item',
        'profile': 'profile',
        'mycart': 'cart',
        'checkout': 'checkout',
        'confirmation/:id': 'confirmation',
        'newaddressform' : 'newaddressform'
      },
      controller:appRouterController
    });

    return {
      AppRouter:router
    };
  }
);
