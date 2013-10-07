/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 */
define(['marionette', 'i18n'],
  function(Marionette, i18n){

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
    };
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
    var purchaseConfirmationBillingAddressView = Backbone.Marionette.ItemView.extend({
      template:'#PurchaseConfirmationBillingAddress',
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
      PurchaseConfirmationLayout:purchaseConfirmationLayout
    };
  }
);
