/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 */
define(['ep','eventbus', 'backbone', 'cortex'],
  function(ep, EventBus, Backbone, Cortex){



    var categoryNavTree = {};
    var mainNavInitialized = false;
    var mainNavLength = 0;
    var mainNavCurrentIndex = 0;

    categoryNavTree.nodes = [];

    var BrowseCategoryLayout = Backbone.Model.extend({});

    // Main Nav Item
    var MainNavItemModel = Backbone.Model.extend({});

    // Build Main Nav collection
    var MainNavCollection = Backbone.Collection.extend({
      model: MainNavItemModel,
      url: '/cortex/navigations/mobee?zoom=element',
      parse:function(response){
        // grab only the elements
        var mainNavCollection = _.first(jsonPath(response, "$.['_element']"));
        // generate the reference structure for category nav
        generateCategoryTreeTopLevel(mainNavCollection);

        return mainNavCollection;

      }
    });



    // generate the tree structure to drive the category browsing
    function generateCategoryTreeTopLevel(collection){

      var topLevelNavRootsCount = collection.length;
      // TOP LEVEL NAV LIST
      for (var i = 0;i < topLevelNavRootsCount;i++){
        var topLevelNavItem = collection[i];

        var nodeObj = {};
        nodeObj.nodes = [];
        nodeObj.name = topLevelNavItem.name;
        var navNode = {
          name:topLevelNavItem.name,
          displayName:topLevelNavItem['display-name'],
          href:topLevelNavItem.self.href,
          uri:topLevelNavItem.self.uri,
          itemsHref:jsonPath(topLevelNavItem, "$.links[?(@.rel=='items')]"),
          nodes:[]
        };
        categoryNavTree.nodes.push(navNode);
      }

      EventBus.trigger('ia.mainNavNodesLoadSuccess');

    }
    // CATEGORY
    var CategoryItemModel = Cortex.Model.extend({
      afterParse:function(response, retVal, xhr){
        ep.logger.info('|');
        ep.logger.info(' MODEL RESPONSE  ' + response.name);
        ep.logger.info('|');
        ep.logger.info('|');
        ep.logger.info('|');
        ep.logger.info(' MODEL retVal  ' + JSON.stringify(retVal));
        ep.logger.info('|');
        retVal = response;
        return response;
      }
    });

    // build the CATEGORIES data collection
    var BrowseCategoryCollection = Backbone.Collection.extend({
      model:CategoryItemModel,
      parse:function(response, model){
        response = _.first(jsonPath(response, "$..['_child']"));
        return response;
      }
    });

    // PRODUCT ITEM
    var ItemModel = Backbone.Model.extend({});

    // Build the PRODUCT ITMES collection
    var BrowseItemCollection = Cortex.Collection.extend({
      model:ItemModel,
      parse:function(response, model){
        var firstCutArray = jsonPath(response, "$..['_element']");

        retVal = [];

        if (firstCutArray){
          for (var i = 0;i < firstCutArray[0].length;i++){
            var retItem = {};
            var item = firstCutArray[0][i];
            if (item['_definition']){
              retItem.name = item['_definition'][0]['display-name'];
            }
            if (item['_price']){
              retItem.price = item['_price'][0]['purchase-price'][0].display;
            }
            retVal.push(retItem);
          }
        }


        return retVal;
      }
    });


    return {
      MainNavCollection:MainNavCollection,
      BrowseItemCollection:BrowseItemCollection,
      BrowseCategoryCollection:BrowseCategoryCollection,
      BrowseCategoryLayout:BrowseCategoryLayout,
      MainNavNodeCollection:categoryNavTree

    };
  }
);
