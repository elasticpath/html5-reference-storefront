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
     * Category Model (fetching category info from server)
     */
    var categoryModel = Backbone.Model.extend({
      uri:'', // will be set in parse method
      getUrl: function (uri) {
        this.uri = ep.ui.decodeUri(uri);
        return ep.ui.decodeUri(uri) + '?zoom=items';
      },
      parse: function (response) {
        var categoryObj = {};
        // category title
        categoryObj.title = response['display-name'];
        categoryObj.itemUri = jsonPath(response, '$._items..self.uri')[0];
        categoryObj.uri = this.uri;

        return categoryObj;
      }
    });

    /*
     * Category Item Page Model (fetching category item list & pagination info from server)
     */
    var categoryItemPageModel = Backbone.Model.extend({
      getUrl: function (uri) {
        return ep.app.config.cortexApi.path + ep.ui.decodeUri(uri) + '?zoom=element, element:availability,element:definition,element:definition:assets:element,element:price,element:rate';
      },
      parse: function (response) {
        var categoryObj = {};

        /*
         * category pagination
         */
        categoryObj.pagination = {};
        categoryObj.pagination.stats = {};
        categoryObj.pagination.links = {};

        var pageStats = jsonPath(response, '$..pagination')[0];
        var pageLinks = jsonPath(response, '$.links')[0]; // comment about paging specific

        categoryObj.pagination.stats = {
          currentPage: pageStats['current'],
          numOfPages: pageStats['pages'],
          resultsOnPage: pageStats['results-on-page'],
          pageSize: pageStats['page-size'],
          totalResults: pageStats['results']
        };

        categoryObj.pagination.links.next = jsonPath(pageLinks, "$.[?(@.rel=='next')].uri")[0];
        categoryObj.pagination.links.prev = jsonPath(pageLinks, "$.[?(@.rel=='previous')].uri")[0];

        /*
         * category item browse
         */
        categoryObj.itemCollection = [];
        var itemArray = jsonPath(response, '$.._element')[0];
        if (itemArray) {
          var itemArrayLen = itemArray.length;
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

          // item rate collection
          itemObj.rateCollection = [];
          var rates = jsonPath(itemArray[i], '$._rate..rate')[0];
          var ratesArrayLen = 0;

          if (rates) {
            ratesArrayLen = rates.length;
          }

          for (var x = 0; x < ratesArrayLen; x++) {
            var rateObj = {};

            rateObj.display = rates[x].display;
            rateObj.cost = {
              amount: jsonPath(rates[x], '$.cost..amount')[0],
              currency: jsonPath(rates[x], '$.cost..currency')[0],
              display: jsonPath(rates[x], '$.cost..display')[0]
            }

            rateObj.recurrence = {
              interval: jsonPath(rates[x], '$.recurrence..interval')[0],
              display: jsonPath(rates[x], '$.recurrence..display')[0]
            }

            itemObj.rateCollection.push(rateObj);
          }

          // fake a price object when neither rate nor price present
          if (!purchasePrice && ratesArrayLen == 0) {
            itemObj.price.purchase = {
              display: 'none'
            };
          }

          categoryObj.itemCollection.push(itemObj);
        }

        return categoryObj;
      }
    });

    /*
     * Empty Models that do not fetch.
     * In controller, will take part of categoryItemPageModel response, and wrap that into Model.
     */
    // Category Pagination Model
    var categoryPaginationModel = Backbone.Model.extend({});

    // Category Item Collection Model
    var itemModel = Backbone.Model.extend({});
    var categoryItemCollectionModel = Backbone.Collection.extend({
      model: itemModel
    });


    return{
      CategoryModel: categoryModel,
      CategoryItemPageModel: categoryItemPageModel,
      CategoryPaginationModel: categoryPaginationModel,
      CategoryItemCollectionModel: categoryItemCollectionModel
    };
  }
);
