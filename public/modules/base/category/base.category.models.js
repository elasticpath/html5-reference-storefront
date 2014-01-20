/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 *
 */
define(['ep', 'eventbus', 'backbone'],
  function (ep, EventBus, Backbone) {

    /*
     * Category Model (fetching category info from server)
     */
    var categoryModel = Backbone.Model.extend({
      uri:'', // will be set in parse method
      getUrl: function (href) {
        this.uri = ep.ui.decodeUri(href);
        return ep.ui.decodeUri(href) + '?zoom=items';
      },
      parse: function (response) {
        var categoryObj = {};
        // category title
        categoryObj.title = response['display-name'];
        categoryObj.itemLink = jsonPath(response, '$._items..self.href')[0];
        categoryObj.href = this.uri;

        return categoryObj;
      }
    });

    /*
     * Category Item Page Model (fetching category item list & pagination info from server)
     */
    var categoryItemPageModel = Backbone.Model.extend({
      getUrl: function (href) {
        return ep.ui.decodeUri(href) + '?zoom=element, element:availability,element:definition,element:definition:assets:element,element:price,element:rate';
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

        categoryObj.pagination.links.next = jsonPath(pageLinks, "$.[?(@.rel=='next')].href")[0];
        categoryObj.pagination.links.prev = jsonPath(pageLinks, "$.[?(@.rel=='previous')].href")[0];

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
          var defaultImgObj = jsonPath(itemArray[i], '$._definition.._assets.._element[?(@.name="default-image")]')[0];
          itemObj.thumbnail = parseDefaultImg(defaultImgObj);


          // item name
          itemObj.name = jsonPath(itemArray[i], '$._definition..display-name')[0];

          // item link
          itemObj.link = jsonPath(itemArray[i], '$.self.href')[0];

          // item availability
          var availabilityObj = jsonPath(itemArray[i], '$._availability')[0];
          itemObj.availability = parseAvailability(availabilityObj);


          // item prices
          itemObj.price = {};
          var listPrice = jsonPath(itemArray[i], '$._price..list-price')[0];
          itemObj.price.listed = parsePrice(listPrice)

          var purchasePrice = jsonPath(itemArray[i], '$._price..purchase-price')[0];
          itemObj.price.purchase = parsePrice(purchasePrice);

          // item rate collection
          var rates = jsonPath(itemArray[i], '$._rate..rate')[0];
          itemObj.rateCollection = parseRates(rates);

          // fake a price object when neither rate nor price present
          if (!purchasePrice && itemObj.rateCollection.length == 0) {
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

    // function to parse default image
    var parseDefaultImg = function(imgObj) {
      var defaultImg = {};

      if (imgObj) {
        defaultImg = {
          absolutePath: imgObj['content-location'],
          relativePath: imgObj['relative-location'],
          name: imgObj['name']
        };
      }

      return defaultImg;
    };

    // function to parse availability (states and release-date)
    var parseAvailability = function(availabilityObj) {
      var availability = {};

      if (availabilityObj) {
        availability.state = jsonPath(availabilityObj, '$..state')[0];
        var releaseDate = jsonPath(availabilityObj, '$..release-date')[0];
        if (releaseDate) {
          availability.releaseDate = {
            displayValue: releaseDate['display-value'],
            value: releaseDate['value']
          };
        }
      }

      return availability;
    };

    // function to parse one-time price (list or purchase)
    var parsePrice = function(priceObj) {
      var price = {};

      if (priceObj) {
        price = {
          currency: priceObj[0].currency,
          amount: priceObj[0].amount,
          display: priceObj[0].display
        }
      }

      return price;
    };

    // function to parse rates collection
    var parseRates = function(rates) {
      var ratesArrayLen = 0;
      var rateCollection = [];

      if (rates) {
        ratesArrayLen = rates.length;
      }

      for (var i = 0; i < ratesArrayLen; i++) {
        var rateObj = {};

        rateObj.display = rates[i].display;
        rateObj.cost = {
          amount: jsonPath(rates[i], '$.cost..amount')[0],
          currency: jsonPath(rates[i], '$.cost..currency')[0],
          display: jsonPath(rates[i], '$.cost..display')[0]
        }

        rateObj.recurrence = {
          interval: jsonPath(rates[i], '$.recurrence..interval')[0],
          display: jsonPath(rates[i], '$.recurrence..display')[0]
        }

        rateCollection.push(rateObj);
      }

      return rateCollection;
    };

    return{
      CategoryModel: categoryModel,
      CategoryItemPageModel: categoryItemPageModel,
      CategoryPaginationModel: categoryPaginationModel,
      CategoryItemCollectionModel: categoryItemCollectionModel
    };
  }
);
