/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 */
define(['ep','eventbus','marionette'],
  function(ep,EventBus,Marionette){

    var viewHelpers = {
      getDisplayType:function(bHasChildren){
        if (bHasChildren){
          return 'inline-block';
        }
        return 'none';
      }
    };


    // Nav Item View
    var NavItemView = Backbone.Marionette.ItemView.extend({
      template:'#NavItemTemplateContainer',
      tagName: 'li',
      templateHelpers: viewHelpers
    });
    // Main Nav View
    var MainNavView = Backbone.Marionette.CompositeView.extend({
      template:'#MainNavTemplateContainer',
      itemViewContainer: 'ul[data-region="mainNavList"]',
      itemView: NavItemView,
      onShow:function(){
        ep.logger.info('main nav test');
//        $('.btn-main-nav-toggle').click(function(event){
//          $('.main-nav-list').fadeToggle(400);
//        });
        //function(){
        //var epUserPrefs = {};
        var currentMainNavDisplayCompactSetting = true;
        if (this.model.attributes && (this.model.attributes.compactDisplay !== undefined)) {
          currentMainNavDisplayCompactSetting = this.model.attributes.compactDisplay;
        }

//        if (this.model.displayCompactMode !== 'undefined'){
//          currentMainNavDisplayCompactSetting = this.model.displayCompactMode;
//        }
//        else{
        if (localStorage.getItem('epUserPrefs')){
          ep.app.epUserPrefs = JSON.parse(localStorage.getItem('epUserPrefs'));
          if (typeof ep.app.epUserPrefs.prefMainNavDisplayCompact !== 'undefined'){
            //if (epUserPrefs.prefMainNavDisplayCompact){
            currentMainNavDisplayCompactSetting = ep.app.epUserPrefs.prefMainNavDisplayCompact;
            //}
          }
        }
        // }

        if (currentMainNavDisplayCompactSetting){
          $('.main-nav-list').hide();
          $('.btn-main-nav-toggle').click(function(event){
            $('.main-nav-list').fadeToggle(400).css('position','absolute');

            //$('.main-nav-container nav').removeClass('nav-h').addClass('.nav-v');
          });
        }
        else{
          $('.btn-main-nav-toggle').hide();
          $('.main-nav-list').show();
          $('.main-nav-container nav').removeClass('nav-v').addClass('.nav-h');
          // $('.main-nav-container').css('width','100%');
          $('.main-nav-container .nav-h ul li').css('display','inline');

          EventBus.bind('ia.compactMainNav',function(){

          });
        }
        //}

        EventBus.trigger('ia.MainNavViewRendered');
      }
    });



    // Main Nav Preferences View
    var MainNavPreferencesView = Backbone.Marionette.ItemView.extend({
      template:'#MainNavPreferences',
      onShow:function(){


        // set the preference
        //var epUserPrefs;
        if (localStorage.getItem('epUserPrefs')){
          ep.app.epUserPrefs = JSON.parse(localStorage.getItem('epUserPrefs'));
        }
        if (ep.app.epUserPrefs.prefMainNavDisplayCompact !== undefined){
          if(ep.app.epUserPrefs.prefMainNavDisplayCompact){
            $('#PrefMainNavDisplayType').prop('checked',true);
          }
          else{
            $('#PrefMainNavDisplayType').prop('checked',false);
          }
        }
        else{
          $('#PrefMainNavDisplayType').prop('checked',false);
        }



        // event handler for button
        ep.logger.info('SHOW THE DIALOG MODAL VIEW FOR NAV PREF');

        $('#PrefMainNavDisplayTypeSave').click(function(event){
          event.preventDefault();
          // save the preference
          var preCompactDisplay = $('#PrefMainNavDisplayType').is(':checked');

          //var epUserPrefs;
          if (localStorage.getItem('epUserPrefs')){
            ep.app.epUserPrefs = JSON.parse(localStorage.getItem('epUserPrefs'));
          }
          ep.app.epUserPrefs.prefMainNavDisplayCompact = preCompactDisplay;
          localStorage.setItem('epUserPrefs',JSON.stringify(ep.app.epUserPrefs));



          //localStorage.setItem('prefMainNavDisplayCompact',preCompactDisplay);








          // close the window
          // repaint the nav component
          EventBus.trigger('ia.reloadMainNavRequest');
        });


      }
    });


    /*
    *
    * Loading View
    *
    * */
    var loadingIndicatorTemplate = Backbone.Marionette.ItemView.extend({
      template:'#LoadingIndicatorTemplate'
    });


    /*
    *
    *
    *   Category Item List Views
    *
    *
    * */
    // Category Node View
    var CatagoryNodeView = Backbone.Marionette.CompositeView.extend({
      template:'[data-view="IACategoryNodeView"]'
    });

    // Browse Category Layout
    var BrowseCategoryLayout = Backbone.Marionette.Layout.extend({
      template:'#BrowseCategoryLayoutContainer',
      regions:{
        categoryRegion:'.categoryRegion',
        itemRegion:'.itemRegion'
      }
    });

    // Category Item View
    var CategoryItemView = Backbone.Marionette.ItemView.extend({
      template:'#BrowseCategoryItemTemplate',
      tagName: 'li',
      templateHelpers: viewHelpers
    });

    // No Sub Category View
    var noSubCatsView = Backbone.Marionette.ItemView.extend({
      template:'#NoSubCatsView'
    });

    // Browse Category View
    var BrowseCategoryView = Backbone.Marionette.CompositeView.extend({
      template:'#BrowseCategoryListTemplate',
      itemViewContainer: 'ul',
      itemView: CategoryItemView,
      emptyView: noSubCatsView
    });

    // Item View
    var ItemView = Backbone.Marionette.ItemView.extend({
      template:'#BrowseItemTemplate',
      tagName: 'li',
      templateHelpers: viewHelpers
    });

    // Browse Item View
    var BrowseItemView = Backbone.Marionette.CompositeView.extend({
      template:'#BrowseItemListTemplate',
      itemViewContainer: 'ul',
      itemView: ItemView
    });



    return {
      MainNavView:MainNavView,
      NavItemView:NavItemView,
      BrowseCategoryLayout:BrowseCategoryLayout,
      BrowseCategoryList:BrowseCategoryView,
      BrowseItemView:BrowseItemView,
      CatagoryNodeView:CatagoryNodeView,
      MainNavPreferencesView:MainNavPreferencesView

    };
  }
);
