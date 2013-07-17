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
