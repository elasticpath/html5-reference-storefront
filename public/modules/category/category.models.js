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

        var categoryItems = jsonPath(response, '$.[_items]')[0];
        var itemArray = [];
        var itemArrayLen;

        if (categoryItems) {
          var pageObj = jsonPath(categoryItems, '$.[pagination]')[0];
          categoryObj.pagination = {
            currentPage: pageObj['current'],
            numOfPages: pageObj['pages'],
            resultsOnPage: pageObj['results-on-page'],
            pageSize: pageObj['page-size'],
            totalResults: pageObj['results']
          };

          itemArray = jsonPath(categoryItems, '$.[_element]')[0];
          itemArrayLen = itemArray.length;
        }

        for (var i = 0; i < itemArrayLen; i++) {

          var itemObj = itemArray[i];
          categoryObj.itemCollection.push(itemObj);
        }

        return categoryObj;
      }
    });


    var itemModel = Backbone.Model.extend({});
    var categoryItemCollectionModel = Backbone.Collection.extend({
      model:itemModel,
      parse:function(collection) {
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
      CategoryItemCollectionModel:categoryItemCollectionModel
    };
  }
);
