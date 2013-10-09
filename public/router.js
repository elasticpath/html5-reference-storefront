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
          module:'extItem',
          view:'customerView',
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
          module:'extCategory',
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
      settings: function() {
        EventBus.trigger('layout.loadRegionContentRequest',{
          region:'appMainRegion',
          module:'settings',
          view:'IndexLayout'
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
        'settings': 'settings',
        'profile': 'profile',
        'mycart': 'cart',
        'confirmation/:id': 'confirmation'
      },
      controller:appRouterController
    });

    return {
      AppRouter:router
    };
  }
);
