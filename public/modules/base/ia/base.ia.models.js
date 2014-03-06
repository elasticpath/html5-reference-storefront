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
          };

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
