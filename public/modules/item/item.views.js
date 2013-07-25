/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 */
define(['ep','marionette','i18n'],
  function(ep,Marionette,i18n){
    //console.log('fuck:  ' + i18n);
    var viewHelpers = {
      getDisplayType:function(bHasChildren){
        if (bHasChildren){
          return 'inline-block';
        }
        return 'none';
      },
      getI18nLabel:function(key){
        retVal = key;
        try{
          retVal = i18n.t(key);
        }
        catch(e){
          // slient failure on label rendering
        }

        return retVal;

      },
      getAvailabilityDisplayText:function(availability){
        var retVal = '';
        switch(availability){
          case 'AVAILABLE':
            retVal = this.getI18nLabel('AVAILABLE');
            break;
          case 'ALWAYS':
            retVal = this.getI18nLabel('ALWAYS');
            break;
          case 'NOT_AVAILABLE':
            retVal = this.getI18nLabel('NOT_AVAILABLE');
            break;
          case 'AVAILABLE_FOR_BACK_ORDER':
            retVal = this.getI18nLabel('AVAILABLE_FOR_BACK_ORDER');
            break;
          case 'AVAILABLE_FOR_PRE_ORDER':
            retVal = this.getI18nLabel('AVAILABLE_FOR_PRE_ORDER');
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


      },
      getListPrice:function(priceObj){
        if (priceObj.list && priceObj.list.display){
          return priceObj.list.display;
        }
        else{
          return '';
        }
      },
      getPurchasePrice:function(priceObj){
        if (priceObj.purchase && priceObj.purchase.display){
          return priceObj.purchase.display;
        }
        else{
          return '';
        }
      },
      getDefaultImagePath:function(aModel){
        if (aModel){
          for (var i = 0;i < aModel.length;i++){
            if (aModel[i].name == 'default-image'){
              return aModel[i].contentLocation;
              break;
            }
          }
        }
        else{
          return '';
        }
      }
    };

    // Default Item Detail Layout
    var defaultLayout = Backbone.Marionette.Layout.extend({
      template:'#DefaultItemDetailLayoutTemplate',
      regions:{
        itemDetailTitleRegion:'[data-region="itemDetailTitleRegion"]',
        itemDetailAssetRegion:'[data-region="itemDetailAssetRegion"]',
        itemDetailAttributeRegion:'[data-region="itemDetailAttributeRegion"]',
        itemDetailPriceRegion:'[data-region="itemDetialPriceRegion"]',
        itemDetailSubscriptionRegion:'[data-region="itemDetailSubscriptionRegion"]',
        itemDetailAvailabilityRegion:'[data-region="itemDetailAvailabilityRegion"]',
        itemDetailQuantityRegion:'[data-region="itemDetailQuantityRegion"]',
        itemDetailAddToCartRegion:'[data-region="itemDetailAddToCartRegion"]'
      },
      className:'itemdetail-container'
    });

    // Default Title View
    var defaultItemTitleView = Backbone.Marionette.ItemView.extend({
      template:'#DefaultItemTitleTemplate'
    });

    // Default Asset View
    var defaultItemAssetView = Backbone.Marionette.ItemView.extend({
      template:'#DefaultItemAssetTemplate',
      className:'itemdetail-asset-container',
      templateHelpers:viewHelpers
    });

    // Default Attribute item View
    var defaultItemAttributeView = Backbone.Marionette.ItemView.extend({
      template:'#DefaultItemAttributeItemTemplate',
      tagName:'tr'
    });

    // Default Attribute List View
    var defaultItemAttributeListView = Backbone.Marionette.CollectionView.extend({
      itemView:defaultItemAttributeView,
      tagName:'table',
      className:'striped'
    });

    // Default Item Availability View
    var defaultItemAvailabilityView = Backbone.Marionette.ItemView.extend({
      template:'#DefaultItemDetailAvailabilityTemplate',
      className:'itemdetail-availability',
      tagName:'div',
      templateHelpers:viewHelpers
    });

    // Default Item Price View
    var defaultItemPriceView = Backbone.Marionette.ItemView.extend({
      template:'#DefaultItemDetailPriceTemplate',
      templateHelpers:viewHelpers,
      onShow:function(){
        // check if there is list price data
        // if not then turn off the item
        if (!viewHelpers.getListPrice(this.model.attributes.price)){
          $('.price-list-item').hide();
        }
      }
    });

    // Default Item Subscription View
    var defaultItemSubscriptionView = Backbone.Marionette.ItemView.extend({
      template:'#DefaultItemDetailSubscriptionTemplate'
    });

    // Default Item Add to Cart View
    var defaultItemAddToCartView = Backbone.Marionette.ItemView.extend({
      template:'#DefaultItemDetailAddToCartTemplate',
      templateHelpers:viewHelpers
    });

    return {
      DefaultLayout:defaultLayout,
      DefaultItemTitleView:defaultItemTitleView,
      DefaultItemAssetView:defaultItemAssetView,
      DefaultItemAttributeView:defaultItemAttributeListView,
      DefaultItemAvailabilityView:defaultItemAvailabilityView,
      DefaultItemPriceView:defaultItemPriceView,
      DefaultItemSubscriptionView:defaultItemSubscriptionView,
      DefaultItemAddToCartView:defaultItemAddToCartView


    };
  }
);
