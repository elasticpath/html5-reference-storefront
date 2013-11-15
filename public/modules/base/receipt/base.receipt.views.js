/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 */
define(['marionette', 'i18n', 'mediator', 'viewHelpers'],
  function(Marionette, i18n, Mediator, ViewHelpers){

    var viewHelpers = ViewHelpers.extend({
      isContainerVisisble:function(value){
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

    // Purchase Confirmation Layout
    var purchaseConfirmationLayout = Backbone.Marionette.Layout.extend({
      template:'#PurchaseConfirmationLayoutTemplate',
      className:'purchase-confirmation-container container',
      regions:{
        purchaseConfirmationRegion:'[data-region="purchaseConfirmationRegion"]',
        confirmationLineItemsRegion:'[data-region="confirmationLineItemsRegion"]',
        confirmationBillingAddressRegion:'[data-region="confirmationBillingAddressRegion"]',
        confirmationPaymentMethodsRegion:'[data-region="confirmationPaymentMethodsRegion"]'
      },
      templateHelpers:viewHelpers

    });

    // Purchase Confirmation View
    var purchaseConfirmationView = Backbone.Marionette.ItemView.extend({
      template:'#PurchaseConfirmationTemplate',
      templateHelpers:viewHelpers
    });

    // Purchase Confirmation Billing Address View
    var purchaseConfirmationBillingAddressView = Backbone.Marionette.Layout.extend({
      template:'#PurchaseConfirmationBillingAddress',
      templateHelpers:viewHelpers,
      className: 'purchase-confirmation-billing-address-container',
      regions: {
        confirmationAddressComponentRegion: '[data-region="confirmationAddressComponentRegion"]'
      },
      onShow: function() {
        // fire event to load the address itemView from component
        Mediator.fire('mediator.loadAddressesViewRequest', {
          region: this.confirmationAddressComponentRegion,
          model: this.model
        });
      }
    });
    // Payment Means View
    var purchaseConfirmationPaymentMeansView = Backbone.Marionette.ItemView.extend({
      template:'#PurchaseConfirmationPaymentMeans',
      templateHelpers:viewHelpers
    });

    // Purchase Confirmation Line Item View
    var purchaseConfirmationLineItemView = Backbone.Marionette.ItemView.extend({
      template:'#PurchaseConfirmationLineItem',
      templateHelpers:viewHelpers,
      tagName:'li',
      attributes: {
        "data-el-container":"receipt.lineItem"
      }
    });
    // Purchase Confirmation Line Item Container View
    var purchaseConfirmationLineItemsContainerView = Backbone.Marionette.CollectionView.extend({
      tagName:'ul',
      className:'purchaseconfirmation-items-list',
      itemView:purchaseConfirmationLineItemView,
      templateHelpers:viewHelpers

    });




    return {
      PurchaseConfirmationBillingAddressView:purchaseConfirmationBillingAddressView,
      PurchaseConfirmationLineItemsContainerView:purchaseConfirmationLineItemsContainerView,
      PurchaseConfirmationView:purchaseConfirmationView,
      PurchaseConfirmationLayout:purchaseConfirmationLayout,
      PurchaseConfirmationPaymentMeansView:purchaseConfirmationPaymentMeansView
    };
  }
);
