/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 02/04/13
 * Time: 8:25 AM
 *
 */
define(['marionette','eventbus'],
  function(Marionette, EventBus) {

    var appRouterController = {
      index: function() {
        EventBus.trigger('layout.loadRegionContentRequest',{
          region:'appMainRegion',
          module:'home',
          view:'IndexLayout'
        });
      },
      item: function(id) {
        EventBus.trigger('layout.loadRegionContentRequest',{
          region:'appMainRegion',
          module:'item',
          view:'DefaultView',
          data:id
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
          module:'cart',
          view:'PurchaseConfirmationView',
          data:id
        });
      },

      category: function(category) {
        EventBus.trigger('layout.loadRegionContentRequest',{
          region:'appMainRegion',
          module:'ia',
          view:'BrowseCategoryView',
          data:category
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
      composer: function() {
        EventBus.trigger('layout.loadRegionContentRequest',{
          region:'appMainRegion',
          module:'composer',
          view:'ComposerLayout'
        });
      },
      moduleComposer: function(name, ext, fileName) {
        EventBus.trigger('layout.loadRegionContentRequest',{
          region:'appMainRegion',
          module:'composer',
          view:'ComposerLayout',
          data:{'entity':'module','name':name,'ext':ext,'fileName':fileName}
        });
      },
      styleComposer: function(fileName) {
        EventBus.trigger('layout.loadRegionContentRequest',{
          region:'appMainRegion',
          module:'composer',
          view:'ComposerLayout',
          data:{'entity':'style','fileName':fileName}
        });
      },
      themeComposer: function(name) {
        EventBus.trigger('layout.loadRegionContentRequest',{
          region:'appMainRegion',
          module:'composer',
          view:'ComposerLayout',
          data:{'entity':'theme','name':name}
        });
      },
      routeComposer: function(name) {
        EventBus.trigger('layout.loadRegionContentRequest',{
          region:'appMainRegion',
          module:'composer',
          view:'ComposerLayout',
          data:{'entity':'route','name':name}
        });
      },
      viewComposer: function(name) {
        EventBus.trigger('layout.loadRegionContentRequest',{
          region:'appMainRegion',
          module:'composer',
          view:'ComposerLayout',
          data:{'entity':'view','name':name}
        });
      },
      composer2: function() {
        EventBus.trigger('layout.loadRegionContentRequest',{
          region:'appMainRegion',
          module:'composer2',
          view:'MainView'
        });
      },
      theme: function() {
        EventBus.trigger('layout.loadRegionContentRequest',{
          region:'appMainRegion',
          module:'theme',
          view:'IndexView'
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
        'category/:name' : 'category',
        'search' : 'search',
        'search/:keywords' : 'search',
        'composer': 'composer',
        'composer/module/:module/:ext/:fileName': 'moduleComposer',
        'composer/style/:fileName': 'styleComposer',
        'composer/theme': 'themeComposer',
        'composer/theme/:themeName': 'themeComposer',
        'composer/route/:routeName': 'routeComposer',
        'composer/view/:viewName': 'viewComposer',
        'composer2': 'composer2',
        'theme': 'theme',
        'itemdetail/:id': 'item',
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
