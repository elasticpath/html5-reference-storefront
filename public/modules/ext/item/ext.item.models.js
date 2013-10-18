define(['ep','app','backbone','jsonpath'],
	function(ep, app, Backbone, Cortex, URI) {
		var ItemModels = {};



    var itemModel = Backbone.Model.extend({
      getUrl: function(uri) {
        return ep.app.config.cortexApi.path + '/' + ep.ui.decodeUri(uri)  + '?zoom=availability,addtocartform,price,rate,definition,definition:assets:element';
      },
      parse:function(item){


        var itemObj = {};


        /*
         *
         * Display Name
         *
         * */
        itemObj.displayName  = jsonPath(item, "$.['_definition'][0]['display-name']")[0];
        //itemObj.displayName = item['_definition'][0]['display-name'];

        /*
         *
         * Details
         *
         * */
        itemObj.details = [];
        var longDesc = {
          index: 0,
          key: 'longDesc'
        };
        var features = {
          index: 1,
          key: 'features'
        };
        var sysRequirement = {
          index: 2,
          key: 'system_requirements'
        };

        var attributesArray = [];
        var attrArrayLen = 0;
        var rawAttributes = jsonPath(item, "$.'_definition'..'details'")[0];

        if (rawAttributes){
          attrArrayLen = rawAttributes.length;
        }

        for (var x = 0; x < attrArrayLen; x++) {
          var currObj = rawAttributes[x];
          var attrKey = jsonPath(currObj, 'name');

          if (longDesc.key == attrKey) {
            addAttributeToList(attributesArray, currObj, longDesc.index);
          }

          if (features.key == attrKey) {
            addAttributeToList(attributesArray, currObj, features.index);
          }

          if (sysRequirement.key == attrKey) {
            addAttributeToList(attributesArray, currObj, sysRequirement.index);
          }
        }

        itemObj.details = attributesArray;


        /*
        *
        * Add to Cart Action test
        *
        * */
        itemObj.addtocart = {};
        itemObj.addtocart.actionlink = null;
        var addToCartFormAction = jsonPath(item, "$._addtocartform..links[?(@.rel='addtodefaultcartaction')].rel")[0];
        if (addToCartFormAction){
          itemObj.addtocart.actionlink = jsonPath(item, "$._addtocartform..links[?(@.rel='addtodefaultcartaction')].uri")[0];;
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
        if (assetsArray){
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
        itemObj.availability = parseAvailability(availabilityObj);


        /*
         *
         * Price
         *
         * */
        itemObj.price = {};

        var listPriceObject = jsonPath(item, "$.['_price'].['list-price']")[0];
        itemObj.price.listed = parsePrice(listPriceObject);

        var purchasePriceObject = jsonPath(item, "$.['_price'].['purchase-price']")[0];
        itemObj.price.purchase = parsePrice(purchasePriceObject);

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
      getDefaultImage:function(){
        var retVal = null;
        if(this.attributes.assets && (this.attributes.assets.length > 0)){
          for (var i = 0;i < this.attributes.assets.length;i++){
            if (this.attributes.assets[i].name === 'default-image'){
              retVal = this.attributes.assets[i];
              break;
            }
          }
        }
        return retVal;
      },
      isAddToCartEnabled:function(){
        var retVal = false;
        if (this.attributes.addtocart){
          if(this.attributes.addtocart.actionlink){
            return true;
          }
        }
        return retVal;
      }
    });

    var itemAttributeModel = Backbone.Model.extend();
    var itemAttributeCollection = Backbone.Collection.extend({
      model:itemAttributeModel,
      parse:function(collection){
        return collection;
      }
    });

    var listPriceModel = Backbone.Model.extend();


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
    }

    var addAttributeToList = function(list, rawObj, insertIndex) {
      var attributeObj = {
        attrKey: jsonPath(rawObj, 'name'),
        displayName: jsonPath(rawObj, 'display-name'),
        displayValue: jsonPath(rawObj, 'display-value')
      }

      list.splice(insertIndex, 0, attributeObj);
    }

    // Required, return the module for AMD compliance
	return {
    ItemModel:itemModel,
    ItemAttributeCollection:itemAttributeCollection,
    ListPriceModel:listPriceModel
  };
});

