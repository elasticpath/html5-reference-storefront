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
 *
 */
define(function (require) {
    var ep = require('ep');
    var Backbone = require('backbone');
    var ModelHelper = require('modelHelpers');


    // Array of zoom parameters to pass to Cortex
    var itemPageZoomArray = [
      'element',
      'element:availability',
      'element:definition',
      'element:definition:assets:element',
      'element:price',
      'element:rate',
      'element:code'
    ];

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
        return ep.ui.decodeUri(href) + '?zoom=' + itemPageZoomArray.join();
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
          currentPage: pageStats.current,
          numOfPages: pageStats.pages,
          resultsOnPage: pageStats['results-on-page'],
          pageSize: pageStats['page-size'],
          totalResults: pageStats.results
        };

        categoryObj.pagination.links.next = jsonPath(pageLinks, "$.[?(@.rel=='next')].href")[0];
        categoryObj.pagination.links.prev = jsonPath(pageLinks, "$.[?(@.rel=='previous')].href")[0];

        /*
         * category item browse
         */
        categoryObj.itemCollection = [];
        var itemArrayLen;
        var itemArray = jsonPath(response, '$.._element')[0];
        if (itemArray) {
          itemArrayLen = itemArray.length;
        }

        for (var i = 0; i < itemArrayLen; i++) {

          var itemObj = {};

          // item thumbnail by sku
          var assetObj = {};
          var skuName = jsonPath(itemArray[i], "$.['_code'][0]['code']")[0];
          assetObj.absolutePath = ep.app.config.skuImagesS3Url.replace("%sku%",skuName)
          assetObj.name = 'default-image'
          itemObj.thumbnail = assetObj;

          // item name
          itemObj.name = jsonPath(itemArray[i], '$._definition..display-name')[0];

          // item link
          itemObj.link = jsonPath(itemArray[i], '$.self.href')[0];

          // item availability
          var availabilityObj = jsonPath(itemArray[i], '$._availability')[0];
          itemObj.availability = modelHelpers.parseAvailability(availabilityObj);


          // item prices
          itemObj.price = {};
          var purchasePrice = jsonPath(itemArray[i], '$._price..purchase-price[0]')[0];
          if (purchasePrice) {
            itemObj.price.purchase = modelHelpers.parsePrice(purchasePrice);
          }

          var listPrice = jsonPath(itemArray[i], '$._price..list-price[0]')[0];
          if (listPrice) {
            itemObj.price.listed = modelHelpers.parseListPrice(listPrice, itemObj.price.purchase);
          }

          // item rate collection
          var rates = jsonPath(itemArray[i], '$._rate..rate')[0];
          itemObj.rateCollection = parseRates(rates);

          // fake a price object when neither rate nor price present
          if (!purchasePrice && itemObj.rateCollection.length === 0) {
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

    var modelHelpers = ModelHelper.extend({});

    // function to parse default image
    var parseDefaultImg = function(imgObj) {
      var defaultImg = {};

      if (imgObj) {
        defaultImg = {
          absolutePath: imgObj['content-location'],
          relativePath: imgObj['relative-location'],
          name: imgObj.name
        };
      }

      return defaultImg;
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
        };

        rateObj.recurrence = {
          interval: jsonPath(rates[i], '$.recurrence..interval')[0],
          display: jsonPath(rates[i], '$.recurrence..display')[0]
        };

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
