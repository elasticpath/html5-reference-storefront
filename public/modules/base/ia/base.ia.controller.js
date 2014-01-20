/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 *
 * 
 */
define(['ep', 'app', 'eventbus', 'ia.models', 'ia.views', 'text!modules/base/ia/base.ia.templates.html'],
  function(ep, App, EventBus, Model, View, template){

    var currentCategoryName;

    $('#TemplateContainer').append(template);

    _.templateSettings.variable = 'E';

    var mainNavInitialized = false;


    /*
    *
    *
    * MAIN NAV VIEW
    *
    *
    * */
    var MainNavView = function(){
      var mainNavCollection = new  Model.MainNavTopCategoryModel();
      var mainNavView =  new View.MainNavView({
        collection:mainNavCollection
      });

      mainNavCollection.fetch ({
        error: function(response){
          ep.logger.error('top level main navigation model load failed: ' + response);
        }
      });

      return mainNavView;
    };

    /*
     *
     *    BROWSE CATEGORY VIEW
     *
     *
     * */
//    var BrowseCategoryView = function(category){
//
//      var browseCategoryLayout = new View.BrowseCategoryLayout({
//        model: new Model.BrowseCategoryLayout({
//          title:category || ''
//        })
//      });
//
//      if (category){
//        // for access outside this method
//        currentCategoryName = category;
//
//        ep.logger.info('CATEGORY:  ' + currentCategoryName);
//        browseCategoryLayout.on('show',function(){
//          if (category){
//            // main nav may not be initialized yet so check and
//            // ensure it is kicked off before proceding since we need the
//            // top level node strcuture to render the child views
//            if (mainNavInitialized){
//              EventBus.trigger('ia.renderBrowseCategoryRequest');
//            }
//            else{
//              ep.logger.warn('tried to load sub category but Main Nav is not initialized');
//              EventBus.bind('ia.mainNavNodesLoadSuccess',function(){
//                EventBus.trigger('ia.renderBrowseCategoryRequest');
//              });
//            }
//            $('.main-nav-list li').removeClass('is-selected');
//            $('li[data-name="' + category + '"]').addClass('is-selected');
//          }
//        });
//
//
//      }
//      else{
//        ep.logger.warn('no category name supplied to BrowseCategoryView method');
//      }
//      return browseCategoryLayout;
//    };
    /*
     *
     * Functions
     *
     * */


    /*
    *
    *  Event Bindings
    *
    * */
    // Reload Main Nav Request
    EventBus.on('ia.reloadMainNavRequest',function(){
      // load main nav
      EventBus.trigger('layout.loadRegionContentRequest',{
        region:'mainNavRegion',
        module:'ia',
        view:'MainNavView'
      });
    });

    // clear selection when no category selected is out of focus
    EventBus.on('ia.clearSelectedNavRequest',function(){
      View.clearSelectedMainNav();
    });

    // Render Browse Category Request
    EventBus.on('ia.renderBrowseCategoryRequest',function renderBrowseCategory(){
      var subCategoryNavCollection = new Model.BrowseCategoryCollection();
      var itemListCollection = new Model.BrowseItemCollection();


      var mainNavNodes = Model.MainNavNodeCollection;

      // work around due to the fact there is no direct way to get
      // reference to category from nam via Cortex (yet)
      var targetParentNode;
      for (var i = 0;i < mainNavNodes.nodes.length;i++){
        if (mainNavNodes.nodes[i].name.toLowerCase() === currentCategoryName){
          targetParentNode = mainNavNodes.nodes[i];
          break;

        }
      }
      // Sub Category Navigation View
      subCategoryNavCollection.fetch({
        url:targetParentNode.href + '?zoom=child',
        success:function(response){
          ep.logger.info('sub cat response: ' + response);
          // declare view
          // assign collection
          // declare target child regions
          var subCategoryNavRegion = new Marionette.Region({
            el:'div[data-region="categoryRegion"]'
          });
          var subCatView = new View.BrowseCategoryList({
            collection:response
          });
          subCategoryNavRegion.show(subCatView);
        },
        error:function(response){
          EventBus.trigger('log.error','error getting sub category navigation collection: ' + response)
        }
      });

      // Product Item List View
      itemListCollection.fetch({
        //url:targetParentNode.itemsHref[0].href + '?zoom=element:price,element:availability,element:definition,element:definition:assets:element',
        url:targetParentNode.itemsHref[0].href + '?zoom=element,element:definition:item,element:price,element:definition',
        success:function(response){
          //ep.logger.info('ya hoo ' + response);


          // declare view
          // assign collection
          // declare target child regions
          var itemListRegion = new Marionette.Region({
            el:'[data-region="itemRegion"]'
          });
          var itemListView = new View.BrowseItemView({
            collection:response
          });
          itemListRegion.show(itemListView);

        },
        error:function(response){
          EventBus.trigger('log.error','error getting item browse collection: ' + response)

        }
      });
    });



    return {
      MainNavView:MainNavView
    };
  }
);


