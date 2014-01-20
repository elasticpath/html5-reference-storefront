/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 *
 */
define(['ep', 'mediator', 'app', 'eventbus', 'appheader.models', 'appheader.views',  'text!modules/base/appheader/base.appheader.templates.html'],
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
        logoRegion:'.logo-container',
        authMenuItemRegion:'[data-region="authMenuItemRegion"]'
      });
      var headerView = new View.PageHeaderView();

      headerView.on('show',function(layout){



        // load search


        // load main nav
        EventBus.trigger('layout.loadRegionContentRequest',{
          region:'mainNavRegion',
          module:'ia',
          view:'MainNavView'
        });
        logoContainer = $('.logo-container');

        EventBus.trigger('appheader.loadLogoComponentRequest');
       // Mediator.fire('mediator.loadLogoComponentRequest');
        EventBus.trigger('appheader.loadSearchComponent');



        mainNavContainer = $('.main-nav-container');
        globalNavContainer = $('.global-nav-container');

        searchContainer = $('.main-search-container');



        //initGlobalNavWidth = toRem(globalNavContainer.outerWidth());



      });




      return headerView;
    };

    /*
    *
    * Event Listeners
    *
    * */
    EventBus.bind('appheader.loadSearchComponent',function(){
      EventBus.trigger('layout.loadRegionContentRequest',{
        region:'headerSearchRegion',
        module:'search',
        view:'DefaultSearchView'
      });
    });
    EventBus.on('appheader.loadLogoComponentRequest',function(){
      var logoView = new View.HeaderLogoView({
        model:new Model.LogoModel({
          homeUri: '',
          logoImgPath: 'images/elastic-path-logo.png'
        })
      });
      ep.app.logoRegion.show(logoView);

    });


    // authenticate
    EventBus.on('profile.authButtonClicked',function(event){
      ep.logger.info('FIRE AUTH REQUEST');
    });

    return {
      AppHeaderView:appHeaderView,
      HeaderLogoView:function(){
        return new View.HeaderLogoView();
      }
    };
  }
);
