/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 26/04/13
 * Time: 3:08 PM
 *
 */
define(['ep','app', 'eventbus','backbone','cortex','item','jsonpath'],
  function(ep, app, EventBus, Backbone,Cortex,Item){

    var initCachedSearch = Backbone.Model.extend({
      url:'cortex/searches/' + ep.app.config.store + '/keywords/items'
    });

    var searchResult = Backbone.Cortex.Model.extend({
      url: function () {
        // TODO: remove url function, replace with zoom and page params
        var suffix = '?zoom=element,element:price,element:definition';
        if (this.get('page')) {
          suffix = '/pages/' + this.get('page') + suffix;
        }
        return Backbone.Model.prototype.url.call(this) + suffix;
      },
      urlRoot: function () {
        return 'cortex/searches/' + app.config.cortexApi.store + '/keywords/items';
      },
      afterParse: function (response, model) {
        var element =  _.first(jsonPath(response, "$..[':element']"));

        if (element) {
          model.results = new Item.ItemsModel(element, { parse: true });
        }
        return model;
      }
    });
    var expSearchResult = Backbone.Cortex.Model.extend({
      url: function () {
        // TODO: remove url function, replace with zoom and page params
        var suffix = '?zoom=element,element:price,element:definition';
        if (this.get('page')) {
          suffix = '/pages/' + this.get('page') + suffix;
        }
        return Backbone.Model.prototype.url.call(this) + suffix;
      },
      urlRoot: function () {
        return 'cortex/searches/' + app.config.store + '/keywords/items';
      },
      afterParse: function (response, model) {
        var element =  _.first(jsonPath(response, "$..[':element']"));

        if (element) {
          model.results = new Item.ItemsModel(element, { parse: true });
        }
        return model;
      }
    });
    var getSearchResult = Backbone.Collection.extend({
      parse: function (response, model) {
        var element = _.first(jsonPath(response, "$..[':element']"));
        //var element = jsonPath(response, "$..[':element']");

        var retCollection = [];
        if (element){

          for (var i = 0;i < element.length;i++){
            var procItemObj = {};
            var item = element[i];
            var firstDefinitionArray = jsonPath(item, "$..[':definition']");

            var firstDefinition = firstDefinitionArray[0];


            var firstPriceArray = jsonPath(item, "$..[':price']");
            var firstPrice = firstPriceArray[0];
            var firstPurchasePriceArray = jsonPath(firstPrice, "$..['purchase-price']");
            var firstPurchasePrice = firstPurchasePriceArray[0];

            var displayPrice = jsonPath(firstPurchasePrice, "$..['display']");
            var displayName = jsonPath(firstDefinition, "$..['display-name']");


            procItemObj.name = displayName;
            procItemObj.price = displayPrice;

            retCollection.push(procItemObj);
          }

//        if (element) {
//          EventBus.trigger('log.info','We have an element: ' + element[0][':definition'][0]['display-name']);
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
