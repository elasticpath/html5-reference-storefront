/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 *
 *
 */
define(['jquery','ep','app', 'eventbus', 'item.models', 'item.views', 'text!modules/base/item/base.item.templates.html','i18n','pace'],
  function($, ep, App, EventBus, Model, View, template,i18n,pace){

    $('#TemplateContainer').append(template);

    _.templateSettings.variable = 'E';


    var defaultView = function(href){
      pace.start();
      var itemDetailLayout = new View.DefaultView({
        className: ''
      });

      var itemModel = new Model.ItemModel();

      itemModel.fetch({
        url: itemModel.getUrl(href),
        success: function (response) {

          // Attribute List Collection
          var attribsList = new Model.ItemAttributeCollection(response.get('details'));

          // Title View
          var titleView = new View.DefaultItemTitleView({
            model: itemModel
          });

          // Asset Imge Url Processing
          var assetView = new View.DefaultItemAssetView({
            model: itemModel
          });
          // Attribute View
          var attributeView = new View.DefaultItemAttributeView({
            collection: attribsList
          });

          // Price View
          var priceView = new View.DefaultItemPriceView({
            model: new Backbone.Model({
              price: response.get('price'),
              rateCollection: response.get('rateCollection')
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

          if (response.get('availability') && response.get('availability').state) {
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
    };

    /*
     *
     *
     *   EVENT LISTENERS
     *
     * */

    EventBus.on('item.loadDefaultCartRequest', function () {
      var test = 'test';
      // request cart data from Coretext
      document.location.href = '#mycart';
      // render cart view in main nav
    });
    EventBus.on('item.addToCartBtnClicked', function (event) {
      var formActionLink = $(event.target).data('actionlink');

      if (formActionLink) {

        var qty = View.getAddToCartQuantity();

        if (qty > 0) {

          var obj = '{quantity:' + qty + '}';
          // FIXME improve robustness of oauth token when we work on that story
          // FIXME [CU-88] use ajax model
          ep.io.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: formActionLink,
            data: obj,
            success: function (response, x, y) {
              // get the location header
//              ep.logger.info(response);
              // ep.logger.info(request);
              ep.logger.info(JSON.stringify(y));
              var lineItemUrl = y.getResponseHeader('Location');
              if (lineItemUrl) {
                EventBus.trigger('item.loadDefaultCartRequest');
              }
              else {
                ep.logger.warn('add to cart success but no cart url returned');
              }


              ep.logger.info('we are done load the cart view');


            },
            error: function (response) {
              ep.logger.error('error posting item to cart: ' + response);
            }
          });

        }
        else {
          ep.logger.warn('add to cart called with no quantity');
        }

      }
    });


    return {
      DefaultView: defaultView
    };
  }
);
