/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 * 
 */
define(['ep','app', 'eventbus', 'cortex', 'modules/item/item.models', 'modules/item/item.views', 'text!modules/item/item.templates.html'],
  function(ep, App, EventBus, Cortex, Model, View, template){

    $('#TemplateContainer').append(template);

    _.templateSettings.variable = 'E';

    var init = function(){



    };

    var defaultItemDetailView = function(id){

      var defaultItemViewLayout = new View.DefaultItemViewLayout();

      var itemModel = new Model.ItemModel();

      itemModel.fetch({
        url: ep.app.config.cortexApi.path + '/items/' + ep.app.config.cortexApi.store + '/' + id  + '?zoom=availability,addtocartform,price,definition,definition:assets:element',
        success:function(response){

          var attribsList = response.attributes.details;

          var itemView = new View.DefaultItemDetailView({
            model:itemModel,
            collection:new Model.ItemAttributeCollection(attribsList)
          });

          var collectionView = new View.ItemAttributeListView({
            collection:new Model.ItemAttributeCollection(attribsList)
          });

          var attribListRegion = new Marionette.Region({
            el:'[data-region="attributeListRegion"]'
          });
          attribListRegion.show(collectionView);

          if (itemModel.attributes.price.list){
            var listPriceView = new View.ItemDetailListPriceView({
              model:new Model.ListPriceModel(itemModel.attributes.price.list)
            });
            var listPriceRegion = new Marionette.Region({
              el:'[data-region="listPriceRegion"]'
            });
            listPriceRegion.show(listPriceView);
          }
          itemView.on('show',function(){
            if (itemModel.attributes.asset.url){
              var itemDetailAssetRegion = new Marionette.Region({
                el:'[data-region="itemDetailAssetRegion"]'
              });
              var urlVal = itemModel.attributes.asset.url;
              var modelObject = {src:urlVal};
              var itemDetailImageView = new View.ItemDetailImageView({
                model:new Backbone.Model(modelObject)
              });
              itemDetailAssetRegion.show(itemDetailImageView);
            }
          });


          defaultItemViewLayout.itemDetailViewRegion.show(itemView);
        },
        error:function(response){
          ep.logger.info('ERROR GETTING THE ITEM: ' + response);
        }
      });


      return defaultItemViewLayout;
    };


    return {
      init:init,
      DefaultItemDetailView:defaultItemDetailView,
      ItemModel:Model.ItemModel
    };
  }
);
