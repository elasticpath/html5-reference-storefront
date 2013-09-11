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
      zoom: '?zoom=items, items:element, items:element:price, items:element:rate, items:element:definition, items:element:definition:assets:element, items:element:availability',
      parse: function (response) {
        var categoryObj = {};

        // category title
        categoryObj.title = response['display-name'];

        // category pagination
        categoryObj.pagination = {};
        categoryObj.pagination.stats = jsonPath(response, '$._items..pagination')[0];
        categoryObj.pagination.links = jsonPath(response, '$._items..links')[0];

        // category item browse
        categoryObj.itemCollection = jsonPath(response, '$._items.._element')[0];

        return categoryObj;
      }
    });

    /*
     * Category Reload Model (model used for reloading category browse views after pagination btn clicked)
     */
    var categoryReloadModel = Backbone.Model.extend({
      zoom: '?zoom=element,element:availability,element:definition,element:definition:assets:element,element:price,element:rate',
      parse: function (response) {
        var categoryObj = {};

        // category pagination
        categoryObj.pagination = {};
        categoryObj.pagination.stats = jsonPath(response, '$.pagination')[0];
        categoryObj.pagination.links = jsonPath(response, '$.links')[0];

        // category item browse
        categoryObj.itemCollection = jsonPath(response, '$._element')[0];

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
        var itemCollection= [];

        if (collection) {
          var collectionLen = collection.length;
        }
        for (var i = 0; i < collectionLen; i++) {

          var itemObj = {};

          // item thumbnail
          itemObj.thumbnail = {};
          var thumbnail = jsonPath(collection[i], '$._definition.._assets.._element[?(@.name="default-image")]')[0];
          if (thumbnail) {
            itemObj.thumbnail = {
              absolutePath: thumbnail['content-location'],
              relativePath: thumbnail['relative-location'],
              name: thumbnail['name']
            };
          }

          // item name
          itemObj.name = jsonPath(collection[i], '$._definition..display-name')[0];

          // item uri
          itemObj.uri = jsonPath(collection[i], '$.self.uri')[0];

          // item availability
          itemObj.availability = {}
          itemObj.availability.state = jsonPath(collection[i], '$._availability..state')[0];
          var releaseDate = jsonPath(collection[i], '$._availability..release-date')[0];
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

          var listPrice = jsonPath(collection[i], '$._price..list-price')[0];
          var purchasePrice = jsonPath(collection[i], '$._price..purchase-price')[0];

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

          itemCollection.push(itemObj);
        }

        return itemCollection;
      }
    });

    /*
     * Category Pagination Model
     */
    var categoryPaginationModel = Backbone.Model.extend({
      parse: function (response) {
        var model = {};
        model.stats = {};
        model.links = {};

        var stats = response.stats;
        model.stats = {
          currentPage: stats['current'],
          numOfPages: stats['pages'],
          resultsOnPage: stats['results-on-page'],
          pageSize: stats['page-size'],
          totalResults: stats['results']
        };

        var links = response.links;
        for (var i = 0; i < links.length; i++) {
          if (links[i].rel === 'prev' || links[i].rel === 'previous') {
//          if (links[i].rel.contains('prev')) {
            model.links.prev = links[i].uri;
          }
          if (links[i].rel === 'next') {
            model.links.next = links[i].uri;
          }
        }
        /*        var prevLink = jsonPath(response, '$._items..links[?(@.rel="prev")]')[0];
         if (prevLink) {
         categoryObj.pagination.prev = prevLink.uri;
         }*/
        return model;
      }
    });

    return{
      CategoryModel: categoryModel,
      CategoryReloadModel: categoryReloadModel,
      CategoryPaginationModel: categoryPaginationModel,
      CategoryItemCollectionModel: categoryItemCollectionModel
    };
  }
);
