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
        'composer': 'composer',
        'composer/module/:module/:ext/:fileName': 'moduleComposer',
        'composer/style/:fileName': 'styleComposer',
        'composer/theme': 'themeComposer',
        'composer/theme/:themeName': 'themeComposer',
        'composer/route/:routeName': 'routeComposer',
        'composer/view/:viewName': 'viewComposer',
        'composer2': 'composer2',
        'theme': 'theme',
        'settings': 'settings'
      },
      controller:appRouterController
    });

    return {
      AppRouter:router
    };
  }
);
