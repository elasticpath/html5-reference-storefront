/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 */
define(['ep','marionette','i18n','eventbus'],
  function(ep,Marionette,i18n,EventBus){
    var viewHelpers = {
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
      getAvailabilityReleaseDate:function(releaseDate){
        var retVar = '';

        if (releaseDate && releaseDate.displayValue){
          retVar = releaseDate.displayValue;
        }

        return retVar;
      },
      getListPrice:function(priceObj){
        if (priceObj.listed && priceObj.listed.display){
          return priceObj.listed.display;
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
        var retVar;
        if (aModel){
          retVar = aModel.contentLocation;
        }
        else{
         retVar = '';
        }
        return retVar;
      },
      getDefaultImageName:function(aModel){
        var retVar;
        if (aModel){
          retVar = this.getI18nLabel('cart.defaultImage');
        }
        else{
          retVar = '';
        }
        return retVar;
      },
      getItemUrl:function(uri){
        var retVar;
        var uriCruft = '/itemdefinitions/' + ep.app.config.cortexApi.store + '/';
        if (uri && uri.indexOf(uriCruft) > -1){
          retVar = '#itemdetail/' + uri.substring(uriCruft.length, uri.length);
        } else {
          retVar = '';
        }
        return retVar;
      },
      getCortexPath:function(){
        return ep.app.config.cortexApi.path;
      }
    };

    // Default Layout
    var defaultLayout = Backbone.Marionette.Layout.extend({
      template:'#DefaultCartLayoutTemplate',
      regions:{
        cartTitleRegion:'[data-region="cartTitleRegion"]',
        mainCartRegion:'[data-region="mainCartRegion"]',
        cartSummaryRegion:'[data-region="cartSummaryRegion"]',
        cartCheckoutActionRegion:'[data-region="cartCheckoutActionRegion"]'
      }
    });

    // Cart Title View
    var cartTitleView = Backbone.Marionette.ItemView.extend({
      template:'#CartTitleTemplate'
    });

    // Cart Line Item View
    var cartLineItemView = Backbone.Marionette.ItemView.extend({
      template:'#CartLineItemTemplate',
      tagName:'tr',
      templateHelpers:viewHelpers,
      events:{
        'click.btn-cart-removelineitem':function(event){
          event.preventDefault();
          EventBus.trigger('cart.removeLineItemBtnClicked', event);
        }
      },
      onShow:function(){
        if (!viewHelpers.getListPrice(this.model.attributes.price)){
          $('.price-list-item', this.el).hide();
        }
        if (!viewHelpers.getAvailabilityReleaseDate(this.model.attributes.availability.releaseDate)) {
          $('.availability-release-date', this.el).hide();
        }
      }
    });

    // Main Cart View
    var mainCartView = Backbone.Marionette.CompositeView.extend({
      template:'#MainCartTemplate',
      itemView:cartLineItemView,
      itemViewContainer:"tbody",
      templateHelpers:viewHelpers
    });

    // Cart Summary View
    var cartSummaryView = Backbone.Marionette.ItemView.extend({
      template:'#CartSummaryTemplate',
      templateHelpers:viewHelpers
    });

    // Cart Checkout Action View
    var cartCheckoutActionView = Backbone.Marionette.ItemView.extend({
      template:'#CartChecktouActionTemplate',
      templateHelpers:viewHelpers
    });

    return {
      CartTitleView:cartTitleView,
      MainCartView:mainCartView,
      CartLineItemView:cartLineItemView,
      CartSummaryView:cartSummaryView,
      CartCheckoutActionView:cartCheckoutActionView,
      DefaultLayout:defaultLayout
    };
  }
);
