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
 * Search function disabled because it's not functional with latest version of storefront.
 *
 */
/* jshint ignore: start */
define(['ep','app', 'eventbus','backbone','cortex','jsonpath'],
  function(ep, app, EventBus, Backbone,Cortex){

    var initCachedSearch = Backbone.Model.extend({
      // Please do not follow this example. This module is designated to be removed.
      // One should not construct urls, unless it's an API entry point
      // in this case ep.io.getApiContext() +'/searches/' + ep.app.config.cortexApi.scope is a entry point
      // the posting url for search form should be retrieved by follow link keywordsearchform and parse out
      // the action link to post the query to
      url: ep.io.getApiContext() +'/searches/' + ep.app.config.cortexApi.scope + '/keywords/form'
    });

    var searchResult = Backbone.Cortex.Model.extend({
      url: function () {
        // TODO: remove url function, replace with zoom and page params
        var suffix = '?zoom=element,element_price,element:definition,element:code';
        if (this.get('page')) {
          suffix = '/pages/' + this.get('page') + suffix;
        }
        return Backbone.Model.prototype.url.call(this) + suffix;
      },
      urlRoot: function () {
        return 'cortex/searches/' + ep.app.config.cortexApi.scope + '/keywords/items';
      },
      afterParse: function (response, model) {
        var element =  _.first(jsonPath(response, "$..['_element']"));

        if (element) {
//          model.results = new Item.ItemsModel(element, { parse: true });
        }
        return model;
      }
    });
    var expSearchResult = Backbone.Cortex.Model.extend({
      url: function () {
        // TODO: remove url function, replace with zoom and page params
        var suffix = '?zoom=element,element:price,element_definition,element:code';
        if (this.get('page')) {
          suffix = '/pages/' + this.get('page') + suffix;
        }
        return Backbone.Model.prototype.url.call(this) + suffix;
      },
      urlRoot: function () {
        return 'cortex/searches/' + app.config.store + '/keywords/items';
      },
      afterParse: function (response, model) {
        var element =  _.first(jsonPath(response, "$..['_element']"));

        if (element) {
//          model.results = new Item.ItemsModel(element, { parse: true });
        }
        return model;
      }
    });
    var getSearchResult = Backbone.Collection.extend({
      parse: function (response, model) {
        var element = _.first(jsonPath(response, "$..['_element']"));
        //var element = jsonPath(response, "$..['_element']");

        var retCollection = [];
        if (element){

          for (var i = 0;i < element.length;i++){
            var procItemObj = {};
            var item = element[i];
            var firstDefinitionArray = jsonPath(item, "$..['_definition']");

            var firstDefinition = firstDefinitionArray[0];


            var firstPriceArray = jsonPath(item, "$..['_price']");
            var firstPrice = firstPriceArray[0];
            var firstPurchasePriceArray = jsonPath(firstPrice, "$..['purchase-price']");
            var firstPurchasePrice;
            var displayPrice;
            if (firstPurchasePriceArray){
              firstPurchasePrice = firstPurchasePriceArray[0];
              displayPrice = jsonPath(firstPurchasePrice, "$..['display']");

            }

            // item thumbnail by sku
            var assetObj = {};
            var skuName = jsonPath(item, "$.['_code'][0]['code']")[0];
            console.log(skuName)
            assetObj.absolutePath = ep.app.config.skuImagesS3Url.replace("%sku%",skuName)
            assetObj.name = 'default-image'
            var absolutePath = assetObj;

            var displayName = jsonPath(firstDefinition, "$..['display-name']")[0];

            if (item['_definition']){
             // retItem.name = item['_definition'][0]['display-name'];
             // retItem.uri = item['_definition'][0].self.uri;
              // var itemUri = item['_definition'][0].self.uri;
              var itemUri = jsonPath(item, '$.self.href')[0];
              var uriCruft = '/itemdetail/' +ep.app.config.cortexApi.scope + '/';
              // var uriCruft = '/itemdefinitions/' +ep.app.config.cortexApi.scope + '/';
              if (itemUri.indexOf(uriCruft) > -1){
                var isoId = itemUri.substring(uriCruft.length,itemUri.length);
                procItemObj.isoId = isoId;
              }


            }


            procItemObj.name = displayName;
            procItemObj.price = displayPrice;
            procItemObj.uri = item.self.href;
            procItemObj.thumbnail = absolutePath;

            retCollection.push(procItemObj);
          }

//        if (element) {
//          EventBus.trigger('log.info','We have an element: ' + element[0]['_definition'][0]['display-name']);
//          model.results = new Item.ItemsModel(element, { parse: true });
        }
        return retCollection;
      }
    });


    var searchResultItemModel = Backbone.Model.extend({});
    var searchResultCollection = Backbone.Collection.extend({
      model:searchResultItemModel
    });
    return{
      SearchResult:searchResult,
      ExpSearchResult:expSearchResult,
      InitCachedSearch:initCachedSearch,
      GetSearchResult:getSearchResult,
      SearchResultCollection:searchResultCollection
    }
  }
);
/* jshint ignore: end */
