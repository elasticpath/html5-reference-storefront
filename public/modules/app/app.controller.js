/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 26/04/13
 * Time: 2:53 PM
 *
 */
define(['ep','eventbus','modules/app/app.models','modules/app/app.views','text!modules/app/app.templates.html'],
  function(ep,EventBus,Model,View,template){

    _.templateSettings.variable = 'E';

    var anchorSelector = '#TemplateContainer';

    var baseMarkup = $(template);

    var displayModeFull = true;
    // attach the module template markup to the DOM
    $(anchorSelector).append(baseMarkup);

    ep.app.epUserPrefs = {};

    ep.app.on('start',function(){
      // base application layout
      var baseLayout = new View.BaseLayout();
      baseLayout.render();
      ep.app.addRegions({
        appHeaderRegion:'[data-region="appHeader"]',
        mainNavRegion:'[data-region="mainNavRegion"]',
        appMainRegion:'[data-region="appMain"]',
        appFooterRegion:'[data-region="appFooter"]'
      });

      // test forlocalStorage
      // if exists pull userprefs obj
      // assign to ep.app.userPrefs

      ep.app.viewPortRegion.show(baseLayout);
      EventBus.bind('app.baseLayoutRenderSuccess',function(){
        EventBus.trigger('layout.loadRegionContentRequest',{
          region:'appHeaderRegion',
          module:'appheader',
          view:'AppHeaderView'
        });
      });
      ep.app.getUserPref = function(prop){
        // test if user pref exists
        var retVal = false;
        if (ep.ui.localStorage()){
          if (localStorage.getItem('epUserPrefs')){
            ep.app.epUserPrefs = localStorage.getItem('epUserPrefs');
            if (ep.app.epUserPrefs[prop]){
              return ep.app.epUserPrefs[prop];
            }
          }
        }
        // if not return false
        // if so then return value

        return retVal;
      };

      // set window resize event to detect when the view should change
      EventBus.bind('layout.windowResized',function(event){
        if (ep.ui.width < 700){
          if (displayModeFull){
            displayModeFull = false;
            ep.logger.info('|-------------------   resize app down');
          }
        }
        if (ep.ui.width > 700){
          if (!displayModeFull){
            displayModeFull = true;
            ep.logger.info('|-------------------   resize app up');
          }
        }
      });
      EventBus.trigger('app.baseLayoutRenderSuccess');
    });
    EventBus.bind('app.baseLayoutRenderSuccess',function(){
      if (ep.app.deployMode() === 'development' && ep.app.config.debug.showInstrumentation){
        //if (ep.app.getUserPref('displayDevInstrumentaion')){
        ep.logger.info('RENDER INSTRUMENTATION');

          // create a dom element
        var instrumentPanelContainer = document.createElement('div');
        instrumentPanelContainer.setAttribute('id','EPDevInstrumentationContainer');
        instrumentPanelContainer.setAttribute('draggable','true');
        document.getElementsByTagName('body')[0].appendChild(instrumentPanelContainer);
          // append it to the body
          // assign a region
        var instrumentationContainerRegion = new Marionette.Region({
          el:'#EPDevInstrumentationContainer'
        });
        instrumentationContainerRegion.show(new View.DevInstrumentation());
          // render instrumentation view into it

       // }
       // else{
       //   EventBus.trigger('log.info','DO NOT RENDER INSTRUMENTAION')
       // }

      }
    });



    return{
      config:Model.config
    };

  }
);
