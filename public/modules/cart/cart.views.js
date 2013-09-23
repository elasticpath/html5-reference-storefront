/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 */
define(['ep','marionette','i18n','eventbus','mediator','pace'],
  function(ep,Marionette,i18n,EventBus,Mediator,pace){
    pace.start();
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
        // show availability if at least has availability state
        if (this.model.get('availability').state) {
          var availabilityRegion = new Backbone.Marionette.Region({
            el: $('[data-region="cartLineitemAvailabilityRegion"]', this.el)
          });
          availabilityRegion.show(
            new itemAvailabilityView({
              model: new Backbone.Model(this.model.get('availability'))
            })
          );
        }

        // show unit price
        var unitPriceRegion = new Backbone.Marionette.Region({
          el: $('[data-region="cartLineitemUnitPriceRegion"]', this.el)
        });
        unitPriceRegion.show(
          new itemUnitPriceLayout({
            model: new Backbone.Model({
              price: this.model.attributes.unitPrice,
              rateCollection: this.model.attributes.unitRateCollection
            })
          })
        );

        // show total price
        var totalPriceRegion = new Backbone.Marionette.Region({
          el: $('[data-region="cartLineitemTotalPriceRegion"]', this.el)
        });
        totalPriceRegion.show(
          new itemTotalPriceLayout({
            model: new Backbone.Model({
              price: this.model.attributes.price,
              rateCollection: this.model.attributes.rateCollection
            })
          })
        );

      }
    });

    // Item Availability
    var itemAvailabilityView = Backbone.Marionette.ItemView.extend({
      template: '#CartLineItemAvailabilityTemplate',
      templateHelpers: viewHelpers,
      tagName: 'ul',
      className: 'cart-lineitem-availability-container',
      onShow: function () {
        // if no release date, hide dom element with release-date & the label
        if (!viewHelpers.getAvailabilityReleaseDate(this.model.get('releaseDate'))) {
          $('[data-region="itemAvailabilityDescriptionRegion"]', this.el).addClass('itemdetail-release-date-hidden');
        }
      }
    });

    //
    // price master view
    //
    var itemUnitPriceLayout = Backbone.Marionette.Layout.extend({
      template: '#CartLineItemUnitPriceMasterTemplate',
      regions: {
        itemPriceRegion: $('[data-region="itemUnitPriceRegion"]', this.el),
        itemRateRegion: $('[data-region="itemUnitRateRegion"]', this.el)
      },
      onShow: function () {
        // if item has rate, load rate view
        if (this.model.attributes.rateCollection.length > 0) {
          this.itemRateRegion.show(
            new itemRateCollectionView({
              className: 'cart-lineitem-unit-rate cart-lineitem-rate-container',
              collection: new Backbone.Collection(this.model.attributes.rateCollection)
            })
          );
        }

        // if item has one-time purchase price, load price view
        if (this.model.get('price').purchase.display) {
          this.itemPriceRegion.show(
            new itemPriceView({
              template: '#CartLineItemUnitPriceTemplate',
              model: new Backbone.Model(this.model.attributes.price)
            })
          );
        }

        // no price nor rate scenario is handled at model level
        // an item price object is created with artificial display value
      }
    });

    var itemTotalPriceLayout = Backbone.Marionette.Layout.extend({
      template: '#CartLineItemTotalPriceMasterTemplate',
      regions: {
        itemPriceRegion: $('[data-region="itemTotalPriceRegion"]', this.el),
        itemRateRegion: $('[data-region="itemTotalRateRegion"]', this.el)
      },
      onShow: function () {
        // if item has rate, load rate view
        if (this.model.attributes.rateCollection.length > 0) {
          this.itemRateRegion.show(
            new itemRateCollectionView({
              className: 'cart-lineitem-total-rate cart-lineitem-rate-container',
              collection: new Backbone.Collection(this.model.attributes.rateCollection)
            })
          );
        }

        // if item has one-time purchase price, load price view
        if (this.model.get('price').purchase.display) {
          this.itemPriceRegion.show(
            new itemPriceView({
              template: '#CartLineItemTotalPriceTemplate',
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
      templateHelpers: viewHelpers,
      className: 'cart-lineitem-price-container',
      tagName: 'ul',
      onShow: function () {
        if (!viewHelpers.getListPrice(this.model.attributes)) {
          $('[data-region="itemListPriceRegion"]', this.el).addClass('itemdetail-list-price-hidden');
        }
      }
    });

    // Item Rate ItemView
    var itemRateItemView = Backbone.Marionette.ItemView.extend({
      template: '#CartLineItemRateTemplate',
      templateHelpers: viewHelpers,
      tagName: 'li'
    });

    // Item Rate CollectionView
    var itemRateCollectionView = Backbone.Marionette.CollectionView.extend({
      itemView: itemRateItemView,
      tagName: 'ul'
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
      templateHelpers:viewHelpers,
      onShow:function(){
        pace.stop();
      }
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
