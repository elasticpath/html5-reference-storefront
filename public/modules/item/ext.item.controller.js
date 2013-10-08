/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.

 * User: sbrookes
 * Date: 08/10/13
 * Time: 10:59 AM
 *
 */
define(['ep', 'eventbus', 'text!modules/item/ext.item.templates.html', 'extItem.views', 'item', 'item.views', 'item.models'],
  function (ep, EventBus, template, ExtView, baseController, View, Model) {

    $('#TemplateContainer').append(template);

    _.templateSettings.variable = 'E';

    _.extend(baseController, {
      customerView: function (uri) {
        // pace.start();
        var itemDetailLayout = new View.DefaultView({
          className: ''
        });

        var itemModel = new Model.ItemModel();

        itemModel.fetch({
          url: itemModel.getUrl(uri),
          success: function (response) {

            // Attribute List Collection
            var attribsList = new Model.ItemAttributeCollection(response.attributes.details);

            // Title View
            var titleView = new ExtView.DefaultItemTitleView({
              model: itemModel
            });

            // Asset Imge Url Processing
            var urlVal = itemModel.attributes.asset.url;
            var modelObject = {src: urlVal};
            var assetView = new View.DefaultItemAssetView({
              model: new Backbone.Model(itemModel)
            });
            // Attribute View
            var attributeView = new View.DefaultItemAttributeView({
              collection: attribsList
            });

            // Price View
            var priceView = new View.DefaultItemPriceView({
              model: new Backbone.Model({
                price: response.attributes.price,
                rateCollection: response.attributes.rateCollection
              })
            });
            // Add To Cart View
            var addToCartView = new View.DefaultItemAddToCartView({
              model: itemModel
            });

            itemDetailLayout.itemDetailTitleRegion.show(titleView);
            itemDetailLayout.itemDetailAssetRegion.show(assetView);
            itemDetailLayout.itemDetailAttributeRegion.show(attributeView);
            itemDetailLayout.itemDetailPriceRegion.show(priceView);
            itemDetailLayout.itemDetailAddToCartRegion.show(addToCartView);

            if (response.get('availability').state) {
              // Availability View
              var availabilityView = new View.DefaultItemAvailabilityView({
                model: new Backbone.Model(response.get('availability'))
              });
              itemDetailLayout.itemDetailAvailabilityRegion.show(availabilityView);
            }


          },
          error: function (response) {
            ep.logger.info('ERROR GETTING THE ITEM: ' + response);
          }
        });


        return itemDetailLayout;
      }

    });


    /*
     *
     * Event Listeners
     *
     * */

    EventBus.on('item.addToCartBtnClicked', function (event) {
      ep.logger.info('|');
      ep.logger.info('|');
      ep.logger.info('|         BUTTON ADD CLICK');
      ep.logger.info('|');
      ep.logger.info('|');
      ep.logger.info('|');
      ep.logger.info('|');
    });

    return baseController;

  });
