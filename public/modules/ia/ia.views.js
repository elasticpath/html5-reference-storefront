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
      generateCategoryHref:function(uri) {
        var retVal;

        if (uri) {
          retVal = ep.app.config.routes.category + ep.app.config.cortexApi.path + ep.ui.encodeUri(uri);
        }
        else {
          retVal = '';
          ep.logger.warn('main nav category loaded without uri');
        }

        return retVal;
      }
    };


    // Nav Item View
    var NavItemView = Backbone.Marionette.ItemView.extend({
      template:'#NavItemTemplate',
      tagName: 'li',
      templateHelpers: viewHelpers
    });

    // Main Nav View
    var MainNavView = Backbone.Marionette.CompositeView.extend({
      template:'#MainNavTemplate',
      itemViewContainer: 'ul[data-region="mainNavList"]',
      itemView: NavItemView,
      templateHelper:viewHelpers,
      onShow:function(){
        $('.btn-main-nav-toggle').hide();
        ep.logger.info('main nav on show, toggle btn hidden.');
      }
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
      className:'browse-items-container',
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

    function clearSelectedMainNav(){
      $('.main-nav-list li').removeClass('is-selected');
    }



    return {
      MainNavView:MainNavView,
      NavItemView:NavItemView,
      BrowseCategoryLayout:BrowseCategoryLayout,
      BrowseCategoryList:BrowseCategoryView,
      BrowseItemView:BrowseItemView,
      CatagoryNodeView:CatagoryNodeView,
      clearSelectedMainNav:clearSelectedMainNav

    };
  }
);
