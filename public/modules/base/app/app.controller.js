/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 26/04/13
 * Time: 2:53 PM
 *
 */
define(['ep','eventbus','app.models','app.views','text!modules/base/app/app.templates.html','modalwin'],
  function(ep,EventBus,Model,View,template){

    _.templateSettings.variable = 'E';

    var anchorSelector = '#TemplateContainer';

    var baseMarkup = $(template);

    var displayModeFull = true;
    // attach the module template markup to the DOM
    $(anchorSelector).append(baseMarkup);

    Marionette.Region.prototype.open = function(view){
      this.$el.hide();
      this.$el.html(view.el);
   //  this.$el.removeAttr('style');
      //this.$el.show(ep.app.config.viewFadeInValue);
      this.$el.fadeIn(ep.app.config.viewFadeInValue);
    }

    /*
    * User Preferences
    * */
    ep.app.epUserPrefs = {};

    /*
    * Modal Region
    * */
    var modalRegion = Backbone.Marionette.Region.extend({
      el: '[data-region="modalRegion"]',

      constructor: function(){
        _.bindAll(this);
        Backbone.Marionette.Region.prototype.constructor.apply(this, arguments);
        this.on('show', this.showModal, this);
        this.on('hide', this.hideModal, this);
      },
      getEl:function(selector){
        var $el = $(selector);
        $el.on('hidden', this.close);
        return $el;
      },

      showModal: function(view){

        this.$el.modal({
          autoResize: true,
          minWidth: 700,
          modal: true,
          position:'auto',
          onShow: function(dialog){

          },
          onOpen:function(dialog){
            dialog.overlay.fadeIn('fast',function(){
              dialog.data.hide();
              dialog.container.fadeIn('fast',function(){
                dialog.data.slideDown('fast');
              });
            });
          },
          onClose:function(dialog){
            dialog.data.fadeOut('fast',function(){
              dialog.container.hide('fast',function(){
                dialog.overlay.slideUp('fast',function(){
                  $.modal.close();
                  EventBus.trigger('ui.modalWindowClosed');
                });
              });
            });
          }
        });

      },


      onShow:function(){
        //this.showModal(this);

      },


      hideModal: function(){
        this.$el.modal('hide');
      }
    });

    /*
    * Start App Listener
    * */
    ep.app.on('start',function(options){
      // base application layout
      var baseLayout = new View.BaseLayout();
      baseLayout.render();
      ep.app.addRegions({
        appHeaderRegion:'[data-region="appHeader"]',
        mainNavRegion:'[data-region="mainNavRegion"]',
        appMainRegion:'[data-region="appMain"]',
        appFooterRegion:'[data-region="appFooter"]',
        appModalRegion:modalRegion

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

/*

Old Instrumentation code - po

 var rem = function rem() {
 var html = document.getElementsByTagName('html')[0];

 return function () {
 return parseInt(window.getComputedStyle(html)['fontSize']);
 };
 }();
 // This function will convert pixel to rem
 function toRem(length) {
 return (parseInt(length) / rem());
 }
 EventBus.bind('appheader.resizeHeaderComponentsRequest',function(options){
 if ((options.totalHeaderWidth - options.mainNavWidth) < options.winRemWidth){
 // reset main nav
 ep.logger.info('RESIZE MAIN NAV COMPONENT!!!!!!!!!!!!!');
 // check the size of main nav
 // if it is big make it smaller
 // rerender it


 EventBus.trigger('ia.reloadMainNavRequest');

 }
 });
 var mainNavDirty = false;
 EventBus.bind('ia.MainNavViewRendered',function(){
 mainNavDirty = false;


 var instrumentationCollection = [
 {
 label:'Aggregate Comp. Width (REM)',
 ElId:'EPDevInstrumentationAggRemWidth'
 },
 {
 label:'Orig Logo Width (REM)',
 ElId:'EPDevInstrumentationOrigLogoRemWidth'
 },
 {
 label:'Logo Width (REM)',
 ElId:'EPDevInstrumentationLogoRemWidth'
 },
 {
 label:'Orig Main Nav Width (REM)',
 ElId:'EPDevInstrumentationOrigMainNavRemWidth'
 },
 {
 label:'Main Nav Width (REM)',
 ElId:'EPDevInstrumentationMainNavRemWidth'
 },
 {
 label:'Orig Global Nav Width (REM)',
 ElId:'EPDevInstrumentationOrigGlobalNavRemWidth'
 },
 {
 label:'Global Nav Width (REM)',
 ElId:'EPDevInstrumentationGlobalNavRemWidth'
 },
 {
 label:'Orig Search Width (REM)',
 ElId:'EPDevInstrumentationOrigSearchRemWidth'
 },
 {
 label:'Search Width (REM)',
 ElId:'EPDevInstrumentationSearchRemWidth'
 }
 ];

 // render instrumentation
 var instrumentationRegion = new Marionette.Region({
 el:'[data-region="EPDevAppHeaderInstrumentationContainer"]'
 });
 if (ep.app.config.debug.showInstrumentation){
 instrumentationRegion.show(new View.EPDevInstrumentationView({
 collection:new Backbone.Collection(instrumentationCollection)
 }));
 }
 $('#EPDevReloadHeaderBtn').unbind().click(function(event){
 EventBus.trigger('layout.loadRegionContentRequest',{
 region:'appHeaderRegion',
 module:'appheader',
 view:'AppHeaderView'
 });
 });
 instrumentHeaderComponents(ep.ui.remWidth());

 });
 function instrumentHeaderComponents(winRemWidth){



 var referenceOffset = globalNavContainer.offset().top;
 var logoOffset = logoContainer.offset().top;
 var mainNavOffset = mainNavContainer.offset().top;
 var searchOffset = searchContainer.offset().top;

 var logoContainerWidth = 0;
 var searchContainerWidth = 0;
 var mainNavContainerWidth = 0;
 var globalNavContainerWidth = 0;


 if (logoContainer.is(":visible")){
 logoContainerWidth = logoContainer.outerWidth();
 }

 if (searchContainer.is(":visible")){
 searchContainerWidth = searchContainer.outerWidth();
 }

 if (!mainNavDirty){
 mainNavContainerWidth = mainNavContainer.outerWidth();
 }
 globalNavContainerWidth = globalNavContainer.outerWidth();

 $('#EPDevInstrumentationLogoRemWidth').text(toRem(logoContainerWidth));
 $('#EPDevInstrumentationSearchRemWidth').text(toRem(searchContainerWidth));
 $('#EPDevInstrumentationMainNavRemWidth').text(toRem(mainNavContainerWidth));
 $('#EPDevInstrumentationGlobalNavRemWidth').text(toRem(globalNavContainerWidth));
 $('#EPDevInstrumentationOrigLogoRemWidth').text(initLogoWidth);
 $('#EPDevInstrumentationOrigSearchRemWidth').text(initSearchWidth);
 $('#EPDevInstrumentationOrigMainNavRemWidth').text(initMainNavWidth);
 $('#EPDevInstrumentationOrigGlobalNavRemWidth').text(initGlobalNavWidth);

 var logoRem = toRem(logoContainerWidth);
 var mainNavRem = toRem(mainNavContainerWidth);
 var searchRem = toRem(searchContainerWidth);
 var globalNavRem = toRem(globalNavContainerWidth);
 var totalHeaderRem = logoRem + mainNavRem + searchRem + globalNavRem;

 $('#EPDevInstrumentationAggRemWidth').text(totalHeaderRem);




 if(!searchContainer.is(":visible")){

 if ((winRemWidth - totalHeaderRem - initSearchWidth) > 0){


 //EventBus.trigger('appheader.loadLogoComponent');
 searchContainer.fadeIn(300);
 }

 }
 if(!logoContainer.is(":visible") && searchContainer.is(":visible")){

 if ((winRemWidth - totalHeaderRem - initLogoWidth - initSearchWidth) > 0){


 //EventBus.trigger('appheader.loadLogoComponent');
 logoContainer.fadeIn(300);
 }

 }


 // logo
 if (logoOffset > referenceOffset){
 // $('.logo-container').fadeOut(200);
 }

 // search
 if (searchOffset > referenceOffset){
 //$('.main-search-container').fadeOut(200);
 }
 }
 EventBus.bind('layout.windowResized',function(winRemWidth){

 if (ep.app.deployMode() === 'development'){
 instrumentHeaderComponents(winRemWidth);
 }

 });
 EventBus.bind('ia.MainNavViewRendered',function(){

 var logoWidth = $('.logo-container').outerWidth();
 var mainNavWidth = $('.main-nav').outerWidth();
 var searchWidth = $('.main-search-container').outerWidth();
 var globalNavWidth = $('.global-nav-container').outerWidth();
 var totalHeaderComponentWidth = logoWidth + mainNavWidth + searchWidth + globalNavWidth;
 var logoRem = toRem(logoWidth);
 var mainNavRem = toRem(mainNavWidth);
 var searchRem = toRem(searchWidth);
 var globalNavRem = toRem(globalNavWidth);
 var totalRem = toRem(totalHeaderComponentWidth);

 ep.logger.info('[appheader.controller] ia.MainNavViewRendered - logo:' + logoRem  + '  mainNav:' + mainNavRem + '  search:' + searchRem + '  globalNav:' + globalNavRem + ' total:' + totalRem);

 });


*/
    return{
      config:Model.config
    };

  }
);
