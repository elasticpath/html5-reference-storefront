/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 */
define(['marionette'],
  function(Marionette){
    var viewHelpers = {
      getDisplayType:function(bHasChildren){
        if (bHasChildren){
          return 'inline-block';
        }
        return 'none';
      },
      getAvailabilityDisplayText:function(availability){
        var retVal = '';
        switch(availability){
          case 'AVAILABLE':
            retVal = 'In Stock';
            break;
          case 'ALWAYS':
            retVal = 'Always';
            break;
          case 'NOT_AVAILABLE':
            retVal = 'Out of Stock';
            break;
          case 'AVAILABLE_FOR_BACK_ORDER':
            retVal = 'Available for Back Order';
            break;
          case 'AVAILABLE_FOR_PRE_ORDER':
            retVal = 'Pre Order';
            break;
          default:
            retVal = '';
        }
        return retVal;
      },
      checkForDisabledAddToCart:function(model){

        /*
        *
        * evaluate conditions where Add To Cart would be disabled
        *
        * - availability is NOT_AVAILABLE
        * - there is no url in the addtocartaction link rel
        *
        * */

//        if (model.availability === 'NOT_AVAILABLE'){
//          return 'disabled="disabled"';
//        }
        // only check for the action link on the form as the
        // determining whether the add to cart button should be active
          // check if add to cart is available
          if (!model.addtocart.actionlink){
            return 'disabled="disabled"';
          }


      }

    };







    var defaultItemViewLayout = Backbone.Marionette.Layout.extend({
      template:'#ItemDefaultLayoutTemplate',
      regions:{
        itemDetailViewRegion:'[data-region="itemDetailViewRegion"]'
      }

    });

    var defaultItemDetailListItemView = Backbone.Marionette.ItemView.extend({
      template:'#DefaultItemDetailListItemTemplate',
      tagName:'tr'
    });
    var defaultItemDetailView = Backbone.Marionette.ItemView.extend({
      template:'#DefaultItemDetailViewTemplate',
      templateHelpers:viewHelpers
    });

    var itemAttributeListView = Backbone.Marionette.CollectionView.extend({
      itemView:defaultItemDetailListItemView,
      tagName:'table',
      className:'striped'

    });

    var itemDetailListPriceView = Backbone.Marionette.ItemView.extend({
      template:'#ItemDetailListPriceTemplate'
    });

    var itemDetailImageView = Backbone.Marionette.ItemView.extend({
      template:'#ItemDetailImageTemplate',
      className:'item-detail-asset-container'
    });




    return {
      DefaultItemViewLayout:defaultItemViewLayout,
      DefaultItemDetailView:defaultItemDetailView,
      ItemAttributeListView:itemAttributeListView,
      ItemDetailListPriceView:itemDetailListPriceView,
      ItemDetailImageView:itemDetailImageView

    };
  }
);
