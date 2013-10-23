/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 */
define(['ep','eventbus', 'backbone'],
  function(ep, EventBus, Backbone){



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

        var topLevelCatArray = jsonPath(response, '$.._element')[0];
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


    return {
      MainNavTopCategoryModel:mainNavTopCategoryModel
    };
  }
);
