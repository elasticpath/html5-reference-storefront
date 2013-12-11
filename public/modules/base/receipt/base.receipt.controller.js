/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 * 
 */
define(['app', 'ep', 'i18n', 'eventbus', 'receipt.models', 'receipt.views', 'text!modules/base/receipt/base.receipt.templates.html'],
  function(App, ep, i18n, EventBus, Model, View, template){

    $('#TemplateContainer').append(template);

    _.templateSettings.variable = 'E';

    // Purchase Confirmation View
    var defaultView = function(link){


      if (ep.app.isUserLoggedIn()) {
        var purchaseConfirmationModel = new Model.PurchaseConfirmationModel();
        var purchaseConfirmationLayout = new View.PurchaseConfirmationLayout();
//        var confirmationRegion = new Marionette.Region({
//          el:'[data-region="purchaseConfirmationRegion"]'
//        });
//        var billingAddressRegion = new Marionette.Region({
//          el:'[data-region="confirmationBillingAddressRegion"]'
//        });
//        var purchaseConfirmationlineItemsRegion = new Marionette.Region({
//          el:'[data-region="confirmationLineItemsRegion"]'
//        });
        var purchaseConfirmationView = new View.PurchaseConfirmationView({
          model:purchaseConfirmationModel
        });

        var rawLink = ep.ui.decodeUri(link);

        // FIXME [CU-196] zoom should be inside model
       var zoomedLink = rawLink + '?zoom=billingaddress, paymentmeans:element, lineitems:element, lineitems:element:rate';
        purchaseConfirmationModel.fetch({
          url:zoomedLink,
          success:function(response){

            purchaseConfirmationLayout.purchaseConfirmationRegion.show(purchaseConfirmationView);
            purchaseConfirmationLayout.confirmationBillingAddressRegion.show(new View.PurchaseConfirmationBillingAddressView({
              model:new Backbone.Model(purchaseConfirmationModel.get('billingAddress'))
            }));
            purchaseConfirmationLayout.confirmationLineItemsRegion.show(new View.PurchaseConfirmationLineItemsContainerView({
              collection:new Backbone.Collection(purchaseConfirmationModel.get('lineItems'))
            }));
            if (purchaseConfirmationModel.get('paymentMeans').displayValue ){
              purchaseConfirmationLayout.confirmationPaymentMethodsRegion.show(new View.PurchaseConfirmationPaymentMeansView({
                model:new Backbone.Model(purchaseConfirmationModel.get('paymentMeans'))
              }));
            }

          },
          error:function(response){
            ep.logger.error('Error retrieving purchase confirmation response');
          }
        });
        return purchaseConfirmationLayout;
      }
      else{
        // trigger login
        EventBus.trigger('layout.loadRegionContentRequest', {
          region: 'appModalRegion',
          module: 'auth',
          view: 'LoginFormView'
        });

      }



    };



    return {
      DefaultView:defaultView

    };
  }
);
