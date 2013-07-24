define(['ep','app','backbone','jsonpath'],
	function(ep, app, Backbone, Cortex, URI) {
		var ItemModels = {};



    var itemModel = Backbone.Model.extend({
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
        var detailsArray = [];
        var detailsRoot = jsonPath(item, "$.['_definition'][0]['details']")[0];
        //if (item['_definition'][0]['details']){
        if (detailsRoot){
          //var detailsRoot = item['_definition'][0]['details'];

          var detailsAttribsArrayLen = detailsRoot.length;
          for (var x = 0;x < detailsAttribsArrayLen;x++){
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
        if (addToCartFormAction){
          itemObj.addtocart.actionlink = jsonPath(item, "$._addtocartform..links[?(@.rel='addtodefaultcartaction')].href")[0];;
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

          itemObj.asset.url = 'http://localhost:3007/images/testdata/finding-nemo.jpg';
          //itemObj.asset.url = defaultImage['content-location'];
          assetObj.contentLocation = defaultImage['content-location'];
          assetObj.name = defaultImage['name'];
          assetObj.relatvieLocation = defaultImage['relative-location'];
          assetsListArray.push(assetObj);
        }
        itemObj.assets = assetsListArray;

        /*
         *
         * Availability
         *
         * */
        //itemObj.availability = item['_availability'][0]['state'];
        itemObj.availability = jsonPath(item, "$.['_availability'][0]['state']")[0];


        /*
         *
         * Price
         *
         * */
        itemObj.price = {};
        itemObj.price.list = {};
        itemObj.price.purchase = {};

        var listPriceObject = jsonPath(item, "$.['_price'].['list-price']")[0];
        var purchasePriceObject = jsonPath(item, "$.['_price'].['purchase-price']")[0];

        /*
        *   List Price
        * */
        if (listPriceObject){
          itemObj.price.list = {
            currency:listPriceObject[0].currency,
            amount:listPriceObject[0].amount,
            display:listPriceObject[0].display
          };
        }

        /*
        *   Purchase Price
        * */
        if (purchasePriceObject){
          itemObj.price.purchase = {
            currency:purchasePriceObject[0].currency,
            amount:purchasePriceObject[0].amount,
            display:purchasePriceObject[0].display
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

	// Required, return the module for AMD compliance
	return {
    ItemModel:itemModel,
    ItemAttributeCollection:itemAttributeCollection,
    ListPriceModel:listPriceModel
  };
});

