/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 * Default PurchaseInfo Views
 * The HTML5 Reference Storefront's MVC Views for displaying a purchase record's details: purchase summary, billing
 * address, payment methods, items purchased.
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
      /**
       * Check if container should be visible, and return correct css class accordingly.
       * @param value value that can determine if container is visible or not by its presence
       * @returns String css class to render container visible or hidden
       */
      isContainerVisible:function(value){
        if (value){
          return null;
        }
        return 'is-hidden';
      },
      /**
       * Check if element should be visible, and return correct css class accordingly.
       * @param model model object that contains value that can determine if element should be visible
       * @returns String  css class to render element visible or hidden
       */
      checkIfVisible:function(model){
        if (model.amount.display){
          return null;
        }
        return 'is-hidden';
      }
    });

    /**
     * Purchase Receipt Layout
     * will render a wrapper around purchaseInformationLayout that contains receipt specific elements.
     * @type Marionette.Layout
     */
    var purchaseReceiptLayout = Marionette.Layout.extend({
      template: '#PurchaseReceiptTemplate',
      className: 'container',
      templateHelpers:viewHelpers,
      regions: {
        purchaseInfoRegion: '[data-region="purchaseInformationRegion"]'
      }
    });

    /**
     * Purchase Details Layout
     * will render a wrapper around purchaseInformationLayout that contains elements specific to purchase details page.
     * @type Marionette.Layout
     */
    var purchaseDetailsLayout = Marionette.Layout.extend({
      template: '#PurchaseDetailsTemplate',
      className: 'container',
      templateHelpers:viewHelpers,
      regions: {
        purchaseInfoRegion: '[data-region="purchaseInformationRegion"]'
      }
    });


    /* ==============  Purchase Information ============== */
    /**
     * Purchase Information Layout
     * renders regions to for views about purchase information to load; such as summary, billing address etc.
     * @type Marionette.Layout
     */
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
        "data-el-container":"purchaseInfo.lineItem"
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
      PurchaseReceiptLayout: purchaseReceiptLayout,
      PurchaseDetailsLayout: purchaseDetailsLayout,
      PurchaseInformationLayout:purchaseInformationLayout,
      PurchaseBillingAddressView:PurchaseBillingAddressView,
      PurchaseLineItemsView:purchaseLineItemsCollectionView,
      PurchaseSummaryView:purchaseSummaryView,
      PurchasePaymentMeansView:purchasePaymentMeansView
    };
  }
);
