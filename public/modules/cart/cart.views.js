/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 */
define(['marionette'],
  function(Marionette){


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
      template:'#CartLineItemTemplate'
    });

    // Main Cart View
    var mainCartView = Backbone.Marionette.CompositeView.extend({
      template:'#MainCartTemplate',
      itemView:cartLineItemView
    });

    // Cart Summary View
    var cartSummaryView = Backbone.Marionette.ItemView.extend({
      template:'#CartSummaryTemplate'
    });

    // Cart Checkout Action View
    var cartCheckoutActionView = Backbone.Marionette.ItemView.extend({
      template:'#CartChecktouActionTemplate'
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
