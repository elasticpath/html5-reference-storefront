define(['ep','app','backbone','jsonpath'],
	function(ep, app, Backbone, Cortex, URI) {
		var ItemModels = {};


    var itemModel = Backbone.Model.extend({
      parse:function(item){

        var tempObj = {};


        tempObj.displayName = item['display-name'];


        var itemObj = {};


        /*
         *
         * Display Name
         *
         * */
        itemObj.displayName = item['_definition'][0]['display-name'];

        /*
         *
         * Details
         *
         * */

        var detailsArray = [];
        if (item['_definition'][0]['details']){
          var detailsRoot = item['_definition'][0]['details'];

          for (var x = 0;x < detailsRoot.length;x++){
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
         * Assets
         *
         * */
        itemObj.asset = {};
        itemObj.asset.url = '';
        var assetsListArray = [];
        if (item['_definition'][0]['_assets']){
          var assetsList = item['_definition'][0]['_assets'][0]._element;
          for (var i = 0;i < assetsList.length;i++){
            var currAssetObj = assetsList[i];
            var assetObj = {};
            // for first cut only worry about the default image
            // multi image will come in future enhancements
            if (currAssetObj['name'] === 'default-image'){
              itemObj.asset.url = 'http://localhost:3007/images/testdata/finding-nemo.jpg';
              //assetObj.contentLocation = currAssetObj['content-location'];
              assetObj.name = currAssetObj['name'];
              assetObj.relatvieLocation = currAssetObj['relative-location'];
            }

            assetsListArray.push(assetObj);
          }

        }
        itemObj.assets = assetsListArray;


        /*
         *
         * Availability
         *
         * */
        itemObj.availability = item['_availability'][0]['state'];

        /*
         *
         * Price
         *
         * */
        itemObj.price = {};
        itemObj.price.list = {};
        itemObj.price.purchase = {};

        if (item['_price'] && item['_price'][0]['list-price']){

          itemObj.price.list = {
            currency:item['_price'][0]['list-price'][0].currency,
            amount:item['_price'][0]['list-price'][0].amount,
            display:item['_price'][0]['list-price'][0].display
          };
        }


        if (item['_price'] && item['_price'][0]['purchase-price']){
          itemObj.price.purchase = {
            currency:item['_price'][0]['purchase-price'][0].currency,
            amount:item['_price'][0]['purchase-price'][0].amount,
            display:item['_price'][0]['purchase-price'][0].display
          };
        }



        return itemObj;
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

