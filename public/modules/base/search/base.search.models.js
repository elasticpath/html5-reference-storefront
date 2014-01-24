/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 *
 */
define(['ep','app', 'eventbus','backbone','cortex','jsonpath'],
  function(ep, app, EventBus, Backbone,Cortex){

    var initCachedSearch = Backbone.Model.extend({
      url: ep.io.getApiContext() +'/searches/' + ep.app.config.cortexApi.scope + '/keywords/items'
    });

    var searchResult = Backbone.Cortex.Model.extend({
      url: function () {
        // TODO: remove url function, replace with zoom and page params
        var suffix = '?zoom=element,element_price,element:definition';
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
        var suffix = '?zoom=element,element:price,element_definition';
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

            var displayName = jsonPath(firstDefinition, "$..['display-name']")[0];

            if (item['_definition']){
             // retItem.name = item['_definition'][0]['display-name'];
             // retItem.uri = item['_definition'][0].self.uri;
              var itemUri = item['_definition'][0].self.uri;
              var uriCruft = '/itemdefinitions/' +ep.app.config.cortexApi.scope + '/';
              if (itemUri.indexOf(uriCruft) > -1){
                var isoId = itemUri.substring(uriCruft.length,itemUri.length);
                procItemObj.isoId = isoId;
              }


            }


            procItemObj.name = displayName;
            procItemObj.price = displayPrice;
            procItemObj.uri = item.self.uri;

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
