/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 05/04/13
 * Time: 1:32 PM
 *
 */
define(['ep', 'eventbus', 'backbone'],
  function (ep, EventBus, Backbone) {

    var categoryModel = Backbone.Model.extend({
      parse: function (response) {
        var categoryObj = {};

        categoryObj.title = response['display-name'];
        categoryObj.pagination = {};
        categoryObj.itemCollection = [];

        var pageObj = jsonPath(response, '$._items..pagination')[0];
        categoryObj.pagination = {
          currentPage: pageObj['current'],
          numOfPages: pageObj['pages'],
          resultsOnPage: pageObj['results-on-page'],
          pageSize: pageObj['page-size'],
          totalResults: pageObj['results']
        };

        var itemArray = jsonPath(response, '$._items.._element')[0];
        var itemArrayLen;

        if (itemArray) {
          itemArrayLen = itemArray.length;
        }

        for (var i = 0; i < itemArrayLen; i++) {

          var itemObj = {};

          itemObj.thumbnail = {};
          var thumbnail = jsonPath(itemArray[i], '$._definition.._assets.._element[?(@.name="default-image")]')[0];
          if (thumbnail) {
            itemObj.thumbnail = {
              absolutePath: thumbnail['content-location'],
              relativePath: thumbnail['relative-location'],
              name: thumbnail['name']
            }
          }
          itemObj.name = jsonPath(itemArray[i], '$._definition..display-name')[0];
          itemObj.uri = jsonPath(itemArray[i], '$.self.uri')[0];
          itemObj.availability = jsonPath(itemArray[i], '$._availability..state')[0];
          itemObj.price = {};
          itemObj.rate = {};

          categoryObj.itemCollection.push(itemObj);
        }

        return categoryObj;
      }
    });


    var itemModel = Backbone.Model.extend({});
    var categoryItemCollectionModel = Backbone.Collection.extend({
      model: itemModel,
      parse: function (collection) {
        return collection;
      }
    });
    var categoryPaginationModel = Backbone.Model.extend({
      parse: function (collection) {
        return collection;
      }
    });

    return{
      CategoryModel: categoryModel,
      CategoryPaginationModel: categoryPaginationModel,
      CategoryItemCollectionModel: categoryItemCollectionModel
    };
  }
);
