/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
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
      url: ep.io.getApiContext() + '/navigations/' + ep.app.config.cortexApi.scope + '?zoom=element',
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
            displayName:jsonPath(arrayObj, '$.display-name')[0],
            name:jsonPath(arrayObj, '$.name')[0],
            href:jsonPath(arrayObj, '$.self..href')[0],
            details:jsonPath(arrayObj, '$.details')[0]
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
