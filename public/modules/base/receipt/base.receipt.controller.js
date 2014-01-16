/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 *
 */
define(function (require) {
    var ep = require('ep');
    var Backbone = require('backbone');
    var pace = require('pace');
    var i18n = require('i18n');

    var Model = require('receipt.models');
    var View = require('receipt.views');
    var template = require('text!modules/base/receipt/base.receipt.templates.html');

    $('#TemplateContainer').append(template);

    _.templateSettings.variable = 'E';

    var purchasesModel = new Model.PurchaseConfirmationModel();

    var defaultView = function (receiptLink) {
      var purchaseConfirmationLayout = new View.PurchaseConfirmationLayout();

      purchasesModel.fetch({
        url: purchasesModel.getUrl(receiptLink),

        success: function (response) {
          var purchaseConfirmationView = new View.PurchaseConfirmationView({
            model: purchasesModel
          });

          purchaseConfirmationLayout.purchaseConfirmationRegion.show(purchaseConfirmationView);

          purchaseConfirmationLayout.confirmationBillingAddressRegion.show(new View.PurchaseConfirmationBillingAddressView({
            model: new Backbone.Model(purchasesModel.get('billingAddress'))
          }));

          purchaseConfirmationLayout.confirmationLineItemsRegion.show(new View.PurchaseConfirmationLineItemsContainerView({
            collection: new Backbone.Collection(purchasesModel.get('lineItems'))
          }));

          if (purchasesModel.get('paymentMeans').displayValue) {
            purchaseConfirmationLayout.confirmationPaymentMethodsRegion.show(new View.PurchaseConfirmationPaymentMeansView({
              model: new Backbone.Model(purchasesModel.get('paymentMeans'))
            }));
          }
        }

      });

      return purchaseConfirmationLayout;
    };


    return {
      DefaultView: defaultView

    };
  }
);
