/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 05/04/13
 * Time: 1:54 PM
 *
 */
define(['ep', 'mediator', 'app', 'eventbus', 'modules/appheader/appheader.models', 'modules/appheader/appheader.views',  'text!modules/appheader/appheader.templates.html'],
  function(ep, Mediator, App, EventBus, Model, View, template){

    $('#TemplateContainer').append(template);

    _.templateSettings.variable = 'E';

    var renderMainNavCompact = false;
    var showLogo = true;
    var showSearch = true;

    var mainNavContainer;
    var globalNavContainer;
    var logoContainer;
    var searchContainer;

    var initLogoWidth = 0;
    var initMainNavWidth = 0;
    var initSearchWidth = 0;
    var initGlobalNavWidth = 0;





    var appHeaderView = function(){
      ep.app.addRegions({
        headerSearchRegion:'.main-search-container',
        mainNavRegion:'.main-nav-container',
        logoRegion:'.logo-container'
      });
      var headerView = new View.PageHeaderView();
//      var logoRegion = new Marionette.Region({
//        el:'.logo-container'
//      });
//      var searchRegion = new Marionette.Region({
//        el:'.main-search-container'
//      });
      headerView.on('show',function(layout){



        // load search


        // load main nav
        EventBus.trigger('layout.loadRegionContentRequest',{
          region:'mainNavRegion',
          module:'ia',
          view:'MainNavView',
          callback:function(){
            initMainNavWidth = toRem(mainNavContainer.outerWidth());
          }
        });
        logoContainer = $('.logo-container');

        EventBus.trigger('appheader.loadLogoComponentRequest');
       // Mediator.fire('mediator.loadLogoComponentRequest');
        EventBus.trigger('appheader.loadSearchComponent');



        mainNavContainer = $('.main-nav-container');
        globalNavContainer = $('.global-nav-container');

        searchContainer = $('.main-search-container');



        initGlobalNavWidth = toRem(globalNavContainer.outerWidth());



      });




      return headerView;
    };
    EventBus.bind('appheader.loadSearchComponent',function(){
      EventBus.trigger('layout.loadRegionContentRequest',{
        region:'headerSearchRegion',
        module:'search',
        view:'DefaultSearchView',
        callback:function(){

          initSearchWidth = toRem(searchContainer.outerWidth());
          initLogoWidth = toRem(logoContainer.outerWidth());
          $('#EPDevInstrumentationOrigLogoRemWidth').text(initLogoWidth);
        }

      });
    });
    EventBus.on('appheader.loadLogoComponentRequest',function(){
      var logoView = new View.HeaderLogoView({
        model:new Model.LogoModel({
          homeUri: '/',
          logoImgPath: 'images/elastic-path-logo.png'
        })
      });
      ep.app.logoRegion.show(logoView);
//      logoView.on('show',function(){
//        EventBus.trigger('log.info','SHOW LOGO');
//      });
    });
//    var headerLogoView = function(){
//      var logoView = new View.HeaderLogoView();
//      return logoView;
//    }
    //App.headerRegion.show(pageHeader);
    //  Model.initMainNavModel();
    //EventBus.trigger('appheader.initComplete');
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
//      var mainNavContainerWidth;
//      if (logoContainer.is(":visible")){
//        logoContainerWidth = logoContainer.outerWidth();
//      }
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

//      EventBus.trigger('log.info','logo width[' + logoContainerWidth  + '] rem[' + toRem(logoContainerWidth) + ']');
//      EventBus.trigger('log.info','main nav width[' + mainNavContainerWidth  + '] rem[' + toRem(mainNavContainerWidth) + ']');
//      EventBus.trigger('log.info','search width[' + searchContainerWidth  + '] rem[' + toRem(searchContainerWidth) + ']');
//      EventBus.trigger('log.info','globalnav width[' + globalNavContainerWidth  + '] rem[' + toRem(globalNavContainerWidth) + ']');

      var logoRem = toRem(logoContainerWidth);
      var mainNavRem = toRem(mainNavContainerWidth);
      var searchRem = toRem(searchContainerWidth);
      var globalNavRem = toRem(globalNavContainerWidth);
      var totalHeaderRem = logoRem + mainNavRem + searchRem + globalNavRem;

      $('#EPDevInstrumentationAggRemWidth').text(totalHeaderRem);


    //  EventBus.trigger('log.info','viewport width[' + winRemWidth + '] total header comp width[' + totalHeaderRem + ']');


      // main nav
//      if (mainNavContainer.offset().top > referenceOffset){
//        if (!renderMainNavCompact){
//          renderMainNavCompact = true;
//          var epUserPrefs;
//          if (localStorage.getItem('epUserPrefs')){
//            epUserPrefs = JSON.parse(localStorage.getItem('epUserPrefs'));
//          }
//          else{
//            epUserPrefs = {};
//          }
//          epUserPrefs.prefMainNavDisplayCompact = true;
//          localStorage.setItem('epUserPrefs',JSON.stringify(epUserPrefs));
//          EventBus.trigger('ia.reloadMainNavRequest');
//
//          mainNavDirty = true;
//        }
//
//
//      }

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

//      if (!mainNavDirty){
//        if (mainNavContainer.offset().top > referenceOffset){
//          if (renderMainNavCompact){
//            if (logoContainer.is(":visible")){
//             // logoContainer.fadeOut(300);
//
//            }
//            else if (searchContainer.is(":visible")){
//              ep.logger.info('log.info','hide search');
//             // searchContainer.fadeOut(300);
//
//            }
////            var searchContainer = $('.main-search-container');
//          }
//        }
//      }
//      if (mainNavOffset === referenceOffset){
//        if (renderMainNavCompact){
//          renderMainNavCompact = false;
//          EventBus.trigger('ia.reloadMainNavRequest');
//        }
//      }
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
    // authenticate
    EventBus.on('profile.authButtonClicked',function(event){
      ep.logger.info('FIRE AUTH REQUEST');
    });


    // temporary test function
    EventBus.on('auth.loginFormSubmitButtonClicked',function(event){
      var requestModel = View.getLoginRequestModel();
      if (requestModel.get('userName') && requestModel.get('password') && requestModel.get('role') && requestModel.get('scope') ){

        var authString = 'grant_type=password&username=' + requestModel.get('userName') + '&password=' + requestModel.get('password') + '&scope=' + requestModel.get('scope') + '&role=' + requestModel.get('role');
        ep.logger.info('login form submit clicked tring: ' + authString);

        // make sure the values are valid
        $.ajax({
          type:'POST',
          url:'/' + ep.app.config.cortexApi.path + '/oauth2/tokens',

          contentType: 'application/x-www-form-urlencoded',
          data:authString,
          success:function(json, responseStatus, xhr){
            // $('#authHeader').val("Bearer " + json.access_token);
            //cortex.ui.saveField('authHeader');
            window.localStorage.setItem('oAuthRole', 'REGISTERED');
            window.localStorage.setItem('oAuthScope', ep.app.config.cortexApi.store);
            window.localStorage.setItem('oAuthToken', 'Bearer ' + json.access_token);

            //if (authRole === 'PUBLIC') {
            window.localStorage.setItem('oAuthUserName', requestModel.userName);
            // } else {
            //  window.localStorage.setItem('oAuthUserName', userName);
            //}
            EventBus.trigger('app.authInit');
          },
          error:function(response){

            ep.logger.error('ERROR generating public auth token: ' + response);
          }
        });

      }
      else{
        Mediator.fire('auth.loginFormValidationFailed');
        ep.logger.warn('Warning - attempt to login with insufficient values');
      }
    });

    return {
      AppHeaderView:appHeaderView,
      HeaderLogoView:function(){
        return new View.HeaderLogoView();
      }
    };
  }
);
