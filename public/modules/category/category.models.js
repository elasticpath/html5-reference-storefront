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
      paginationZoom: '?zoom=element,element:availability,element:definition,element:definition:assets:element,element:price,element:rate',
      parse: function (response) {
        var categoryObj = {};

        // category title
        categoryObj.title = response['display-name'];

        /*
         * category pagination
         */
        categoryObj.pagination = {};
        categoryObj.pagination.stats = {};
        categoryObj.pagination.links = {};
        var pageStats = jsonPath(response, '$..pagination')[0];

        // FIXME !!!
        var itemPLinks = jsonPath(response, '$._items[0].links')[0];
        var pLinks = jsonPath(response, '$.links')[0];
        if (itemPLinks) {
          var pageLinks = itemPLinks;
        } else {
          var pageLinks = pLinks;
        }

        categoryObj.pagination.stats = {
          currentPage: pageStats['current'],
          numOfPages: pageStats['pages'],
          resultsOnPage: pageStats['results-on-page'],
          pageSize: pageStats['page-size'],
          totalResults: pageStats['results']
        };

        categoryObj.pagination.links.next = jsonPath(pageLinks, "$.[?(@.rel=='next')].uri");
        categoryObj.pagination.links.prev = jsonPath(pageLinks, "$.[?(@.rel=='previous')].uri");


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

          // item rate
          // [!] currently works for only 1 rate per item; needs more work to display multiple rates
          itemObj.rate = {};

          var rate = jsonPath(itemArray[i], '$._rate..rate')[0];

          if (rate) {
            itemObj.rate.display = rate[0].display;
            itemObj.rate.cost = {
              amount: jsonPath(rate, '$..cost..amount')[0],
              currency: jsonPath(rate, '$..cost..currency')[0],
              display: jsonPath(rate, '$..cost..display')[0]
            }
            itemObj.rate.recurrence = {
              interval: jsonPath(rate, '$..recurrence..interval')[0],
              display: jsonPath(rate, '$..recurrence..display')[0]
            }
          }

          // fake a price object when neither rate nor price present
          if (!(purchasePrice || itemObj.rate.display)) {
            itemObj.price.purchase = {
              display: 'none'
            };
          }

        categoryObj.itemCollection.push(itemObj);
        }

        return categoryObj;
      }
    });


    var categoryPaginationModel = Backbone.Model.extend({});


    /*
     * Category Item Collection Model
     */
    var itemModel = Backbone.Model.extend({});
    var categoryItemCollectionModel = Backbone.Collection.extend({
      model: itemModel
    });


    return{
      CategoryModel: categoryModel,
      CategoryPaginationModel: categoryPaginationModel,
      CategoryItemCollectionModel: categoryItemCollectionModel
    };
  }
);
