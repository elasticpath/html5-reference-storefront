/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 *
 */
define(['ep','marionette','i18n','eventbus','pace'],
  function(ep,Marionette,i18n,EventBus,pace){
    //console.log('fuck:  ' + i18n);
    var viewHelpers = {
      getDisplayType:function(bHasChildren){
        if (bHasChildren){
          return 'inline-block';
        }
        return 'none';
      },
      getI18nLabel:function(key){
        var retVal = key;
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
            retVal = this.getI18nLabel('availability.AVAILABLE');
            break;
          case 'ALWAYS':
            retVal = this.getI18nLabel('availability.ALWAYS');
            break;
          case 'NOT_AVAILABLE':
            retVal = this.getI18nLabel('availability.NOT_AVAILABLE');
            break;
          case 'AVAILABLE_FOR_BACK_ORDER':
            retVal = this.getI18nLabel('availability.AVAILABLE_FOR_BACK_ORDER');
            break;
          case 'AVAILABLE_FOR_PRE_ORDER':
            retVal = this.getI18nLabel('availability.AVAILABLE_FOR_PRE_ORDER');
            break;
          default:
            retVal = '';
        }
        return retVal;
      },
      getAvailabilityReleaseDate: function (releaseDate) {
        var retVar = '';

        if (releaseDate && releaseDate.displayValue) {
          retVar = releaseDate.displayValue;
        }

        return retVar;
      },
      getListPrice: function (priceObj) {
        var retVar = '';

        if (priceObj) {
          if (priceObj.listed && priceObj.listed.display) {
            retVar = priceObj.listed.display;
          }
        }

        return retVar;
      },
      getPurchasePrice: function (priceObj) {
        var retVar = '';

        if (priceObj) {
          if (priceObj.purchase && priceObj.purchase.amount >= 0) {
            retVar = priceObj.purchase.display;
          }
          else {
            retVar = this.getI18nLabel('itemDetail.noPrice');
          }
        }

        return retVar;
      },
      checkForDisabledAddToCart:function(model){
        // only check for the action link on the form as the
        // determining whether the add to cart button should be active
          // check if add to cart is available
          if (!model.addtocart.actionlink){
            return 'disabled="disabled"';
          }
      },
      getDefaultImagePath:function(thumbnail){
        if (thumbnail && (thumbnail.length > 0)){
          for (var i = 0;i < thumbnail.length;i++){
            if (thumbnail[i].name == 'default-image'){
              return thumbnail[i].absolutePath;
              break;
            }
          }
        }
        else{
          return 'images/img-placeholder.png';
        }
      },
      getDefaultImageName:function(thumbnail){
        var retVar;
        if (thumbnail && thumbnail.name){
          retVar = thumbnail.name;
        }
        else{
          retVar = this.getI18nLabel('itemDetail.noImgLabel');
        }
        return retVar;
      }
    };

    // Default Item Detail Layout
    var defaultLayout = Backbone.Marionette.Layout.extend({
      template:'#DefaultItemDetailLayoutTemplate',
      regions:{
        itemDetailTitleRegion:'[data-region="itemDetailTitleRegion"]',
        itemDetailAssetRegion:'[data-region="itemDetailAssetRegion"]',
        itemDetailAttributeRegion:'[data-region="itemDetailAttributeRegion"]',
        itemDetailPriceRegion:'[data-region="itemDetailPriceRegion"]',
        itemDetailAvailabilityRegion:'[data-region="itemDetailAvailabilityRegion"]',
        itemDetailQuantityRegion:'[data-region="itemDetailQuantityRegion"]',
        itemDetailAddToCartRegion:'[data-region="itemDetailAddToCartRegion"]'
      },
      className:'itemdetail-container container'
    });

    // Default Title View
    var defaultItemTitleView = Backbone.Marionette.ItemView.extend({
      template:'#DefaultItemTitleTemplate',
      onShow:function(){
        pace.stop();
      }
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
      className:'table table-striped table-condensed'
    });

    // Default Item Availability View
    var defaultItemAvailabilityView = Backbone.Marionette.ItemView.extend({
      template: '#ItemAvailabilityTemplate',
      templateHelpers: viewHelpers,
      tagName: 'ul',
      className: 'itemdetail-availability-container',
      onShow: function () {
        // if no release date, hide dom element with release-date & the label
        if (!viewHelpers.getAvailabilityReleaseDate(this.model.get('releaseDate'))) {
          $('[data-region="itemAvailabilityDescriptionRegion"]', this.el).addClass('is-hidden');
        }
      }
    });

    //
    // price master view
    //
    var defaultItemPriceView = Backbone.Marionette.Layout.extend({
      template: '#ItemPriceMasterViewTemplate',
      regions: {
        itemPriceRegion: $('[data-region="itemPriceRegion"]', this.el),
        itemRateRegion: $('[data-region="itemRateRegion"]', this.el)
      },
      onShow: function () {
        // if item has rate, load rate view
        if (this.model.attributes.rateCollection.length > 0) {
          this.itemRateRegion.show(
            new itemRateCollectionView({
              collection: new Backbone.Collection(this.model.attributes.rateCollection)
            })
          );
        }

        // if item has one-time purchase price, load price view
        if (this.model.get('price').purchase.display) {
          this.itemPriceRegion.show(
            new itemPriceView({
              model: new Backbone.Model(this.model.attributes.price)
            })
          );
        }

        // no price nor rate scenario is handled at model level
        // an item price object is created with artificial display value
      }
    });

    // Item Price View
    var itemPriceView = Backbone.Marionette.ItemView.extend({
      template: '#ItemPriceTemplate',
      templateHelpers: viewHelpers,
      tagName: 'ul',
      className: 'itemdetail-price-container',
      onShow: function () {
        if (!viewHelpers.getListPrice(this.model.attributes)) {
          $('[data-region="itemListPriceRegion"]', this.el).addClass('is-hidden');
        }
      }
    });

    // Item Rate ItemView
    var itemRateItemView = Backbone.Marionette.ItemView.extend({
      template: '#ItemRateTemplate',
      templateHelpers: viewHelpers,
      tagName: 'li'
    });

    // Item Rate CollectionView
    var itemRateCollectionView = Backbone.Marionette.CollectionView.extend({
      itemView: itemRateItemView,
      tagName: 'ul',
      className: 'itemdetail-rate-container'
    });

    // Default Item Add to Cart View
    var defaultItemAddToCartView = Backbone.Marionette.ItemView.extend({
      template:'#DefaultItemDetailAddToCartTemplate',
      templateHelpers:viewHelpers,
      events:{
        'click .btn-itemdetail-addtocart':function(event){
          event.preventDefault();
          EventBus.trigger('item.addToCartBtnClicked',event);
        }
      }
    });

    function getAddToCartQuantity(){

      return $('#itemdetail-select-quantity').val() || 0;
    }

    return {
      DefaultView:defaultLayout,
      DefaultItemTitleView:defaultItemTitleView,
      DefaultItemAssetView:defaultItemAssetView,
      DefaultItemAttributeView:defaultItemAttributeListView,
      DefaultItemAvailabilityView:defaultItemAvailabilityView,
      DefaultItemPriceView:defaultItemPriceView,
      DefaultItemAddToCartView:defaultItemAddToCartView,
      getAddToCartQuantity:getAddToCartQuantity


    };
  }
);
