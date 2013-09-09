/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 */
define(['ep','eventbus', 'backbone', 'cortex'],
  function(ep, EventBus, Backbone, Cortex){



    var mainNavInitialized = false;
    var mainNavLength = 0;
    var mainNavCurrentIndex = 0;


    // Main Nav Item
    var MainNavItemModel = Backbone.Model.extend({});

    // Build Main Nav collection
    var mainNavTopCategoryModel = Backbone.Collection.extend({
      model: MainNavItemModel,
      url: '/' + ep.app.config.cortexApi.path + '/navigations/' + ep.app.config.cortexApi.scope + '?zoom=element',
      parse:function(response){
        var mainNavCollection = [];
        var mainNavItem = {};

        var topLevelCatArray = response._element;
        var arrayLen;
        if (topLevelCatArray) {
          arrayLen = topLevelCatArray.length;
        }

        for (var x = 0; x < arrayLen; x++) {
          var arrayObj = topLevelCatArray[x];
          mainNavItem = {
            displayName:arrayObj['display-name'],
            name:arrayObj['name'],
            uri:arrayObj['self']['uri'],
            details:arrayObj['details']
          }

          mainNavCollection.push(mainNavItem);
        }

        return mainNavCollection;
      }
    });

    var BrowseCategoryLayout = Backbone.Model.extend({});
    // generate the tree structure to drive the category browsing



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


        //encodeURIComponent / decodeURIComponent
        if (firstCutArray){
          for (var i = 0;i < firstCutArray[0].length;i++){
            var retItem = {};
            var item = firstCutArray[0][i];
            if (item['_definition']){
              retItem.name = item['_definition'][0]['display-name'];
              retItem.uri = item['_definition'][0].self.uri;
              var itemUri = item['_definition'][0].self.uri;
              var uriCruft = '/itemdefinitions/' +ep.app.config.cortexApi.scope + '/';
              if (itemUri.indexOf(uriCruft) > -1){
                var isoId = itemUri.substring(uriCruft.length,itemUri.length);
                retItem.isoId = isoId;
              }


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
      MainNavTopCategoryModel:mainNavTopCategoryModel,
      BrowseItemCollection:BrowseItemCollection,
      BrowseCategoryCollection:BrowseCategoryCollection,
      BrowseCategoryLayout:BrowseCategoryLayout

    };
  }
);
