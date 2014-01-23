/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
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
         retVar = 'images/img-placeholder.png';
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
      getItemUrl:function(link){
        var retVar;
        if (link) {
          retVar = ep.app.config.routes.itemDetail + '/' + ep.ui.encodeUri(link);
        } else {
          retVar = '';
          ep.logger.warn('[cart]: unable to generate href to item-detail');
        }

        return retVar;
      },
      getCheckoutButtonDisabledAttr:function(model){
        // Proceed to checkout button disabled by default
        var retVar = 'disabled="disabled"';

        // Check that there is at least one item in the cart
        if (model.cartTotalQuantity > 0){
            retVar = '';
        }

        return  retVar;

      },
      checkIfVisible:function(model){
        if (model.amount.display){
         return null;
        }
        return 'is-hidden';
      },
      /**
       * generate HTML markup for options inside a select of a given range
       * @param min     minimum number of option range
       * @param max     maximum number of option range
       * @param quantity  initial selected quantity
       * @returns {string}  options HTML markup of a given range
       */
      createQuantityOptions:function(min, max, quantity) {
        var optionHtml = '';
        var selected = '';

        for (var i = min; i <= max; i++) {
          // e.g. <option value="1" selcted="selected">1</option>
          if (i === quantity) {
            selected = 'selected="selected"';
          } else {
            selected = '';
          }
          optionHtml += '<option value="' + i + '"' + selected + ' >' + i + '</option>' ;
        }

        return optionHtml;
      }
    };

    /*
    * Functions
    *
    * */
    // Set Checkout Button to Processing State
    function setCheckoutButtonProcessing(){
      $('.btn-cmd-submit-order').html('<img src="images/activity-indicator-strobe.gif" />');

    }
    // Set Checkout Button to Ready State
    function resetCheckoutButtonText(){
      $('.btn-cmd-submit-order').html(viewHelpers.getI18nLabel('cart.submitOrder'));
    }

    // Default Layout
    var defaultLayout = Backbone.Marionette.Layout.extend({
      template:'#DefaultCartLayoutTemplate',
      templateHelpers:viewHelpers,
      className:'cart-container container',
      regions:{
        cartTitleRegion:'[data-region="cartTitleRegion"]',
        mainCartRegion:'[data-region="mainCartRegion"]',
        cartCheckoutMasterRegion:'[data-region="cartCheckoutMasterRegion"]'
      },
      onShow:function(){
        Mediator.fire('mediator.cart.DefaultViewRendered');
      }
    });

    /**
     * A layout containing the cart summary and checkout action elements.
     * The $el object returned by this view is not a suitable target for an activity indicator
     * so the ui.activityIndicatorEl property is used to specify a more suitable object.
     *
     * @type {Backbone.Marionette.Layout}
     */
    var cartCheckoutMasterLayout = Backbone.Marionette.Layout.extend({
      template:'#CartCheckoutMasterLayoutTemplate',
      regions:{
        cartSummaryRegion:'[data-region="cartSummaryRegion"]',
        cartCheckoutActionRegion:'[data-region="cartCheckoutActionRegion"]'
      },
      ui: {
        // A jQuery selector for the DOM element to which an activity indicator should be applied.
        activityIndicatorEl: '.cart-sidebar-inner'
      }
    });

    // Cart Title View
    var cartTitleView = Backbone.Marionette.ItemView.extend({
      template:'#CartTitleTemplate',
      templateHelpers:viewHelpers
    });

    // Cart Line Item Layout
    var cartLineItemLayout = Backbone.Marionette.Layout.extend({
      template:'#CartLineItemTemplate',
      tagName:'tr',
      templateHelpers:viewHelpers,
      regions: {
        cartLineitemAvailabilityRegion: '[data-region="cartLineitemAvailabilityRegion"]',
        cartLineitemUnitPriceRegion: '[data-region="cartLineitemUnitPriceRegion"]',
        cartLineitemTotalPriceRegion: '[data-region="cartLineitemTotalPriceRegion"]'
      },
      events:{
        'click .btn-cart-removelineitem':function(event){
          var actionLink = $(event.currentTarget).data("actionlink");
          EventBus.trigger('cart.removeLineItemBtnClicked', actionLink);
        },

        'change .cart-lineitem-quantity-select': function(event) {
          var actionLink = this.model.get('lineitemLink');
          var quantities = {
            original: this.model.get('quantity'),
            changeTo: $(event.target).val()
          };
          EventBus.trigger('cart.lineItemQuantityChanged', actionLink, quantities);
        }
      },
      onShow:function(){
        // show availability if at least has availability state
        if (this.model.get('availability').state) {
          this.cartLineitemAvailabilityRegion.show(
            new itemAvailabilityView({
              model: new Backbone.Model(this.model.get('availability'))
            })
          );
        }

        // show unit price
        this.cartLineitemUnitPriceRegion.show(
          new itemUnitPriceLayout({
            model: new Backbone.Model({
              price: this.model.attributes.unitPrice,
              rateCollection: this.model.attributes.unitRateCollection
            })
          })
        );

        // show total price
        this.cartLineitemTotalPriceRegion.show(
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
          $('[data-region="itemAvailabilityDescriptionRegion"]', this.el).addClass('is-hidden');
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
              className: 'cart-lineitem-unit-rate-container',
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
              className: 'cart-lineitem-total-rate-container',
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
          $('[data-region="itemListPriceRegion"]', this.el).addClass('is-hidden');
        }
      }
    });

    // Item Rate ItemView
    var itemRateItemView = Backbone.Marionette.ItemView.extend({
      template: '#CartLineItemRateTemplate',
      templateHelpers: viewHelpers,
      className: 'cart-lineitem-rate',
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
      itemView:cartLineItemLayout,
      itemViewContainer:'tbody',
      className:'cart-main-inner table-responsive',
      templateHelpers:viewHelpers,
      onShow:function(){
        pace.stop();
      }
    });

    // Cart Summary View
    var cartSummaryView = Backbone.Marionette.ItemView.extend({
      template:'#CartSummaryTemplate',
      templateHelpers:viewHelpers,
      modelEvents: {
        'change': function() {
          this.render();
        }
      }
    });

    // Cart Checkout Action View
    var cartCheckoutActionView = Backbone.Marionette.ItemView.extend({
      template:'#CartCheckoutActionTemplate',
      templateHelpers:viewHelpers,
      modelEvents: {
        'change': function() {
          this.render();
        }
      },
      events:{
        'click .btn-cmd-checkout':function(event){
          EventBus.trigger('cart.checkoutBtnClicked',this.model.get('checkoutLink'));
        }
      }
    });

    /**
     * This view is rendered in the modal region to obtain confirmation from the user before proceeding
     * with a request to remove a line item from the cart.
     */
    var cartRemoveLineItemConfirmView = Backbone.Marionette.ItemView.extend({
      className:'cart-remove-confirm-modal',
      template:'#CartRemoveLineItemConfirmModalTemplate',
      templateHelpers:viewHelpers,
      events:{
        'click .btn-yes':function(event) {
          event.preventDefault();
          EventBus.trigger('cart.removeLineItemConfirmYesBtnClicked', this.options.href);
        },
        'click .btn-no':function(event) {
          event.preventDefault();
          $.modal.close();
        }
      }
    });

    /* ********* Helper functions ********* */
    /**
     * Reset a lineItem's quantity to original value recorded in model.
     */
    function resetQuantity(originalQty) {
      $('[data-el-value="lineItem.quantity"] option[value="' + originalQty + '"]').prop('selected', true);
    }

    return {
      DefaultLayout:defaultLayout,
      CartTitleView:cartTitleView,
      MainCartView:mainCartView,
      CartLineItemLayout:cartLineItemLayout,
      EmptyCartView:emptyCartView,
      CartSummaryView:cartSummaryView,
      CartCheckoutActionView:cartCheckoutActionView,
      CartCheckoutMasterLayout:cartCheckoutMasterLayout,
      CartRemoveLineItemConfirmView: cartRemoveLineItemConfirmView,
      setCheckoutButtonProcessing:setCheckoutButtonProcessing,
      resetCheckoutButtonText:resetCheckoutButtonText,
      resetQuantity: resetQuantity
    };
  }
);
