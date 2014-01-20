/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 */
define(['ep', 'app', 'backbone'],
  function (ep, app, Backbone) {
    var ItemModels = {};


    var itemModel = Backbone.Model.extend({
      getUrl: function (href) {
        return ep.ui.decodeUri(href) + '?zoom=availability,addtocartform,price,rate,definition,definition:assets:element';
      },
      parse: function (item) {


        var itemObj = {};


        /*
         *
         * Display Name
         *
         * */
        itemObj.displayName = jsonPath(item, "$.['_definition'][0]['display-name']")[0];
        //itemObj.displayName = item['_definition'][0]['display-name'];

        /*
         *
         * Details
         *
         * */
        var detailsArray = [];
        var detailsRoot = jsonPath(item, "$.['_definition'][0]['details']")[0];
        //if (item['_definition'][0]['details']){
        if (detailsRoot) {
          //var detailsRoot = item['_definition'][0]['details'];

          var detailsAttribsArrayLen = detailsRoot.length;
          for (var x = 0; x < detailsAttribsArrayLen; x++) {
            var currObj = detailsRoot[x];
            var detailObject = {};
            detailObject.displayName = currObj['display-name'];
            detailObject.displayValue = currObj['display-value'];
            detailsArray.push(detailObject);
          }

        }
        itemObj.details = detailsArray;

        /*
         *
         * Add to Cart Action test
         *
         * */
        itemObj.addtocart = {};
        itemObj.addtocart.actionlink = null;
        var addToCartFormAction = jsonPath(item, "$._addtocartform..links[?(@.rel='addtodefaultcartaction')].rel")[0];
        if (addToCartFormAction) {
          itemObj.addtocart.actionlink = jsonPath(item, "$._addtocartform..links[?(@.rel='addtodefaultcartaction')].href")[0];
          ;
        }


        /*
         *
         * Assets
         *
         * */
        itemObj.asset = {};
        itemObj.asset.url = '';
        var assetsListArray = [];
        var assetsArray = jsonPath(item, "$._definition.._assets.._element")[0];
        if (assetsArray) {
          var defaultImage = jsonPath(item, "$._definition.._assets.._element[?(@.name='default-image')]")[0];
          var assetObj = {};

          //itemObj.asset.url = 'http://localhost:3007/images/testdata/finding-nemo.jpg';
          //itemObj.asset.url = defaultImage['content-location'];
          assetObj.absolutePath = defaultImage['content-location'];
          assetObj.name = defaultImage['name'];
          assetObj.relativePath = defaultImage['relative-location'];
          assetsListArray.push(assetObj);
        }

        itemObj.assets = assetsListArray;

        /*
         *
         * Availability
         *
         * */
        var availabilityObj = jsonPath(item, '$._availability')[0];
        if (availabilityObj) {
          itemObj.availability = parseAvailability(availabilityObj);
        }


        /*
         *
         * Price
         *
         * */
        itemObj.price = {};
        itemObj.price.listed = {};
        itemObj.price.purchase = {};
        itemObj.rateCollection = [];

        var listPriceObject = jsonPath(item, '$._price..list-price[0]')[0];
        if (listPriceObject) {
          itemObj.price.listed = parsePrice(listPriceObject);
        }

        var purchasePriceObject = jsonPath(item, '$._price..purchase-price[0]')[0];
        if (purchasePriceObject) {
          itemObj.price.purchase = parsePrice(purchasePriceObject);
        }

        var rates = jsonPath(item, '$._rate..rate')[0];
        itemObj.rateCollection = parseRates(rates);


        // fake a price object when neither rate nor price present
        if (!purchasePriceObject && itemObj.rateCollection.length == 0) {
          itemObj.price.purchase = {
            display: 'none'
          };
        }

        return itemObj;
      },
      getDefaultImage: function () {
        var retVal = null;
        if (this.attributes.assets && (this.attributes.assets.length > 0)) {
          for (var i = 0; i < this.attributes.assets.length; i++) {
            if (this.attributes.assets[i].name === 'default-image') {
              retVal = this.attributes.assets[i];
              break;
            }
          }
        }
        return retVal;
      },
      isAddToCartEnabled: function () {
        var retVal = false;
        if (this.attributes.addtocart) {
          if (this.attributes.addtocart.actionlink) {
            return true;
          }
        }
        return retVal;
      }
    });

    var itemAttributeModel = Backbone.Model.extend();
    var itemAttributeCollection = Backbone.Collection.extend({
      model: itemAttributeModel,
      parse: function (collection) {
        return collection;
      }
    });

    var listPriceModel = Backbone.Model.extend();


    // function to parse availability (states and release-date)
    var parseAvailability = function (availabilityObj) {
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
    var parsePrice = function (rawObject) {
      var price = {};

      try {
        price = {
          currency: jsonPath(rawObject, '$.currency')[0],
          amount: jsonPath(rawObject, '$.amount')[0],
          display: jsonPath(rawObject, '$.display')[0]
        }
      }
      catch (error) {
        ep.logger.error('Error building price object: ' + error.message);
      }

      return price;
    };

    // function to parse rates collection
    var parseRates = function (rates) {
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
    }

    // Required, return the module for AMD compliance
    return {
      ItemModel: itemModel,
      ItemAttributeCollection: itemAttributeCollection,
      ListPriceModel: listPriceModel
    };
  });

