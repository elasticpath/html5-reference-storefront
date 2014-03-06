/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
