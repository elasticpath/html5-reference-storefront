/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 */
define(function (require) {
  var ep = require('ep');
  var i18n = require('i18n');
  var Mediator = require('mediator');
  var Marionette = require('marionette');
  var ViewHelpers = require('viewHelpers');

    /**
     * Template helper functions
     */
    var viewHelpers = ViewHelpers.extend({
      isContainerVisible:function(value){
        if (value){
          return null;
        }
        return 'is-hidden';
      },
      checkIfVisible:function(model){
        if (model.amount.display){
          return null;
        }
        return 'is-hidden';
      }
    });

    var purchaseInformationLayout = Marionette.Layout.extend({
      template:'#PurchaseInformationTemplate',
      className:'purchase-information-container container',
      regions:{
        purchaseSummaryRegion:'[data-region="purchaseSummaryRegion"]',
        purchaseLineItemsRegion:'[data-region="purchaseLineItemsRegion"]',
        purchaseBillingAddressRegion:'[data-region="purchaseBillingAddressRegion"]',
        purchasePaymentMethodsRegion:'[data-region="purchasePaymentMethodsRegion"]'
      },
      templateHelpers:viewHelpers

    });

    // Purchase Summary View
    var purchaseSummaryView = Marionette.ItemView.extend({
      template:'#PurchaseSummaryTemplate',
      templateHelpers:viewHelpers
    });

    // Purchase Billing Address View
    var PurchaseBillingAddressView = Marionette.Layout.extend({
      template:'#PurchaseBillingAddress',
      templateHelpers:viewHelpers,
      className: 'purchase-billing-address-container',
      regions: {
        purchaseAddressComponentRegion: '[data-region="purchaseAddressComponentRegion"]'
      },
      onShow: function() {
        // fire event to load the address itemView from component
        Mediator.fire('mediator.loadAddressesViewRequest', {
          region: this.purchaseAddressComponentRegion,
          model: this.model
        });
      }
    });

    // Payment Means View
    var purchasePaymentMeansView = Marionette.ItemView.extend({
      template:'#PurchasePaymentMeans',
      templateHelpers:viewHelpers
    });

    // Purchase Line Item View
    var purchaseLineItemView = Marionette.ItemView.extend({
      template:'#PurchaseLineItem',
      templateHelpers:viewHelpers,
      tagName:'li',
      attributes: {
        "data-el-container":"receipt.lineItem"
      }
    });
    // Purchase Line Item Container View
    var purchaseLineItemsCollectionView = Marionette.CollectionView.extend({
      tagName:'ul',
      className:'purchase-items-list',
      itemView:purchaseLineItemView,
      templateHelpers:viewHelpers

    });




    return {
      PurchaseBillingAddressView:PurchaseBillingAddressView,
      PurchaseLineItemsView:purchaseLineItemsCollectionView,
      PurchaseSummaryView:purchaseSummaryView,
      PurchaseInformationLayout:purchaseInformationLayout,
      PurchasePaymentMeansView:purchasePaymentMeansView
    };
  }
);
