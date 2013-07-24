/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 * 
 */
define(['jquery','ep','app', 'eventbus', 'cortex', 'modules/item/item.models', 'modules/item/item.views', 'text!modules/item/item.templates.html','i18n'],
  function($, ep, App, EventBus, Cortex, Model, View, template,i18n){

    $('#TemplateContainer').append(template);

    _.templateSettings.variable = 'E';



    var defaultItemDetailView = function(id){

      var defaultItemViewLayout = new View.DefaultLayout({
        className:''
      });

      var itemModel = new Model.ItemModel();

      itemModel.fetch({
        url: ep.app.config.cortexApi.path + '/items/' + ep.app.config.cortexApi.store + '/' + id  + '?zoom=availability,addtocartform,price,definition,definition:assets:element',
        success:function(response){

          // Attribute List Collection
          var attribsList = new Model.ItemAttributeCollection(response.attributes.details);

          // Title View
          var titleView = new View.DefaultItemTitleView({
            model:itemModel
          });

          // Asset Imge Url Processing
          var urlVal = itemModel.attributes.asset.url;
          var modelObject = {src:urlVal};
          var assetView = new View.DefaultItemAssetView({
            model:new Backbone.Model(modelObject)
          });
          // Attribute View
          var attributeView = new View.DefaultItemAttributeView({
            collection:attribsList
          });
          // Availability View
          var availabilityView = new View.DefaultItemAvailabilityView({
            model:itemModel
          });
          // Price View
          var priceView = new View.DefaultItemPriceView({
            model:itemModel
          });
          // Add To Cart View
          var addToCartView = new View.DefaultItemAddToCartView({
            model:itemModel
          });

          defaultItemViewLayout.itemDetailTitleRegion.show(titleView);
          defaultItemViewLayout.itemDetailAssetRegion.show(assetView);
          defaultItemViewLayout.itemDetailAttributeRegion.show(attributeView);
          defaultItemViewLayout.itemDetailAvailabilityRegion.show(availabilityView);
          defaultItemViewLayout.itemDetailPriceRegion.show(priceView);
          defaultItemViewLayout.itemDetailAddToCartRegion.show(addToCartView);


        },
        error:function(response){
          ep.logger.info('ERROR GETTING THE ITEM: ' + response);
        }
      });


      return defaultItemViewLayout;
    };


    return {
      DefaultLayout:View.DefaultLayout,
      DefaultItemDetailView:defaultItemDetailView,
      ItemModel:Model.ItemModel
    };
  }
);
