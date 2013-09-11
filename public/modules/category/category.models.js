/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 05/04/13
 * Time: 1:32 PM
 *
 */
define(['ep', 'eventbus', 'backbone'],
  function (ep, EventBus, Backbone) {

    /*
     * Category Model (main model fetching info from server)
     */
    var categoryModel = Backbone.Model.extend({
      parse: function (response) {
        var categoryObj = {};

        /*
         * category title
         */
        categoryObj.title = response['display-name'];

        /*
         * category pagination
         */
        categoryObj.pagination = {};
        var pageObj = jsonPath(response, '$._items..pagination')[0];
        categoryObj.pagination = {
          currentPage: pageObj['current'],
          numOfPages: pageObj['pages'],
          resultsOnPage: pageObj['results-on-page'],
          pageSize: pageObj['page-size'],
          totalResults: pageObj['results']
        };

        /*
         * category item browse
         */
        categoryObj.itemCollection = [];
        var itemArray = jsonPath(response, '$._items.._element')[0];
        var itemArrayLen;

        if (itemArray) {
          itemArrayLen = itemArray.length;
        }

        for (var i = 0; i < itemArrayLen; i++) {

          var itemObj = {};

          // item thumbnail
          itemObj.thumbnail = {};
          var thumbnail = jsonPath(itemArray[i], '$._definition.._assets.._element[?(@.name="default-image")]')[0];
          if (thumbnail) {
            itemObj.thumbnail = {
              absolutePath: thumbnail['content-location'],
              relativePath: thumbnail['relative-location'],
              name: thumbnail['name']
            };
          }

          // item name
          itemObj.name = jsonPath(itemArray[i], '$._definition..display-name')[0];

          // item uri
          itemObj.uri = jsonPath(itemArray[i], '$.self.uri')[0];

          // item availability
          itemObj.availability = {}
          itemObj.availability.state = jsonPath(itemArray[i], '$._availability..state')[0];
          var releaseDate = jsonPath(itemArray[i], '$._availability..release-date')[0];
          if (releaseDate) {
            itemObj.availability.releaseDate = {
              displayValue: releaseDate['display-value'],
              value: releaseDate['value']
            };
          }

          // item prices
          itemObj.price = {};
          itemObj.price.listed = {};
          itemObj.price.purchase = {};

          var listPrice = jsonPath(itemArray[i], '$._price..list-price')[0];
          var purchasePrice = jsonPath(itemArray[i], '$._price..purchase-price')[0];

          if (listPrice) {
            itemObj.price.listed = {
              currency: listPrice[0].currency,
              amount: listPrice[0].amount,
              display: listPrice[0].display
            }
          }

          if (purchasePrice) {
            itemObj.price.purchase = {
              currency: purchasePrice[0].currency,
              amount: purchasePrice[0].amount,
              display: purchasePrice[0].display
            }
          }

          // item rate
          itemObj.rate = {};

          categoryObj.itemCollection.push(itemObj);
        }

        return categoryObj;
      }
    });


    /*
     * Category Item Collection Model
     */
    var itemModel = Backbone.Model.extend({});
    var categoryItemCollectionModel = Backbone.Collection.extend({
      model: itemModel,
      parse: function (collection) {
        return collection;
      }
    });

    /*
     * Category Pagination Model
     */
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
