/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 */
define(['ep','marionette','i18n','eventbus','mediator'],
  function(ep,Marionette,i18n,EventBus,Mediator){
    var viewHelpers = {
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
      getDefaultImagePath:function(thumbnail){
        var retVar;
        if (thumbnail && thumbnail.absolutePath){
          retVar = thumbnail.absolutePath;
        }
        else{
         retVar = '/images/img-placeholder.png';
        }
        return retVar;
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
      },
      getItemUrl:function(uri){
        var retVar;
        if (uri) {
          retVar = ep.app.config.routes.itemDetail + '/' + ep.ui.encodeUri(uri);
        } else {
          retVar = '';
          ep.logger.warn('[cart]: unable to generate href to item-detail');
        }

        return retVar;
      },
      getCortexPath:function(){
        return ep.app.config.cortexApi.path;
      },
      getCheckoutButtonDisabledAttrib:function(model){
        // complete purchase disabled by default
        var retVar = 'disabled="disabled"';
        // is user anonymous - return true
        if (!ep.app.isUserLoggedIn() && (model.cartTotalQuantity > 0)){
            retVar = '';
        }
        // user is logged in but may not have a submitorderaction link
        else if(model.submitOrderActionUri){
          retVar = '';
        }
        return  retVar;

      },
      fuck:function(model){
        var x = model;
        return JSON.stringify(x);
      }
    };

    /*
    * Functions
    *
    * */
    // Set Checkout Button to Processing State
    function setCheckoutButtonProcessing(){
      $('.btn-cmd-checkout').html('<img src="/images/activity-indicator-strobe.gif" />');

    }
    // Set Checkout Button to Ready State
    function resetCheckoutButtonText(){
      $('.btn-cmd-checkout').html(viewHelpers.getI18nLabel('cart.checkout'));
    }

    // Default Layout
    var defaultView = Backbone.Marionette.Layout.extend({
      template:'#DefaultCartLayoutTemplate',
      className:'cart-container',
      regions:{
        cartTitleRegion:'[data-region="cartTitleRegion"]',
        mainCartRegion:'[data-region="mainCartRegion"]',
        cartSummaryRegion:'[data-region="cartSummaryRegion"]',
        cartCheckoutActionRegion:'[data-region="cartCheckoutActionRegion"]'
      },
      onShow:function(){
        Mediator.fire('mediator.cart.DefaultViewRendered');

      }
    });

    // Cart Title View
    var cartTitleView = Backbone.Marionette.ItemView.extend({
      template:'#CartTitleTemplate',
      templateHelpers:viewHelpers
    });

    // Cart Line Item View
    var cartLineItemView = Backbone.Marionette.ItemView.extend({
      template:'#CartLineItemTemplate',
      tagName:'tr',
      templateHelpers:viewHelpers,
      events:{
        'click .btn-cart-removelineitem':function(event){
          event.preventDefault();
          EventBus.trigger('cart.removeLineItemBtnClicked', event);
        }
      },
      onShow:function(){
        // check if there is releaseDate in model
        // if so inject view to display availability release date
        if (viewHelpers.getAvailabilityReleaseDate(this.model.attributes.availability.releaseDate)) {
          var childReleaseDateView = new cartLineItemReleaseDateView({
            model:this.model
          });
          childReleaseDateView.render();
          $('li[data-region="cartLineitemReleaseDateRegion"]', this.el).html(childReleaseDateView.el);
        }
        else {
          $('li[data-region="cartLineitemReleaseDateRegion"]', this.el).hide();
        }

        // check if there is list price data (unit price or total price)
        // if so inject view to display list price
        if (viewHelpers.getListPrice(this.model.attributes.price)){
          var childTotalListPriceView = new cartLineitemTotalListPriceView({
            model:this.model
          });
          var childUnitListPriceView = new cartLineitemUnitListPriceView({
            model:this.model
          });

          childTotalListPriceView.render();
          childUnitListPriceView.render();

          $('li[data-region="cartLineitemTotalListPrice"]', this.el).html(childTotalListPriceView.el);
          $('li[data-region="cartLineitemUnitListPrice"]', this.el).html(childUnitListPriceView.el);
        } else {
          $('li[data-region="cartLineitemTotalListPrice"]', this.el).hide();
          $('li[data-region="cartLineitemUnitListPrice"]', this.el).hide();
        }
      }
    });

    // Cart Line Item Release Date View
    var cartLineItemReleaseDateView = Backbone.Marionette.ItemView.extend({
      template:'#CartLineitemReleaseDateTemplate',
      templateHelpers:viewHelpers
    });

    // Cart Line Item List Price (unit price) View
    var cartLineitemUnitListPriceView = Backbone.Marionette.ItemView.extend({
      template:'#CartLineitemUnitListPriceTemplate',
      templateHelpers:viewHelpers
    });

    // Cart Line Item List Price (total price) View
    var cartLineitemTotalListPriceView = Backbone.Marionette.ItemView.extend({
      template:'#CartLineitemTotalListPriceTemplate',
      templateHelpers:viewHelpers
    });

    // Empty Cart View
    var emptyCartView = Backbone.Marionette.ItemView.extend({
      template:'#EmptyCartTemplate',
      templateHelpers:viewHelpers,
      className:"cart-empty-container"
    });

    // Main Cart View
    var mainCartView = Backbone.Marionette.CompositeView.extend({
      template:'#MainCartTemplate',
      itemView:cartLineItemView,
      itemViewContainer:'tbody',
      templateHelpers:viewHelpers
    });

    // Cart Summary View
    var cartSummaryView = Backbone.Marionette.ItemView.extend({
      template:'#CartSummaryTemplate',
      templateHelpers:viewHelpers
    });

    // Cart Checkout Action View
    var cartCheckoutActionView = Backbone.Marionette.ItemView.extend({
      template:'#CartCheckoutActionTemplate',
      templateHelpers:viewHelpers,
      events:{
        'click .btn-cmd-checkout':function(event){
          event.preventDefault();
          EventBus.trigger('cart.checkoutBtnClicked',this.model);
        }
      }
    });

    // Purchase Confirmation Layout
    var purchaseConfirmationLayout = Backbone.Marionette.Layout.extend({
      template:'#PurchaseConfirmationLayoutTemplate',
      className:'purchase-confirmation-container'
    });

    // Purchase Confirmation View
    var purchaseConfirmationView = Backbone.Marionette.ItemView.extend({
      template:'#PurchaseConfirmationTemplate',
      templateHelpers:viewHelpers
    });

    // Activity Indicator View
    var cartActivityIndicatorView = Backbone.Marionette.ItemView.extend({
      template:'#CartActivityIndicatorTemplate'
    });

    return {
      CartTitleView:cartTitleView,
      MainCartView:mainCartView,
      CartLineItemView:cartLineItemView,
      EmptyCartView:emptyCartView,
      CartSummaryView:cartSummaryView,
      CartCheckoutActionView:cartCheckoutActionView,
      DefaultView:defaultView,
      PurchaseConfirmationView:purchaseConfirmationView,
      PurchaseConfirmationLayout:purchaseConfirmationLayout,
      CartActivityIndicatorView:cartActivityIndicatorView,
      setCheckoutButtonProcessing:setCheckoutButtonProcessing,
      resetCheckoutButtonText:resetCheckoutButtonText
    };
  }
);
