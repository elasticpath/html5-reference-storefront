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

    var Model = require('purchaseinfo.models');
    var View = require('purchaseinfo.views');
    var template = require('text!modules/base/purchaseinfo/base.purchaseinfo.templates.html');

    $('#TemplateContainer').append(template);

    _.templateSettings.variable = 'E';

    var purchasesModel = new Model.PurchaseInfoModel();

    var defaultView = function (receiptLink) {
      var purchaseInfoLayout = new View.PurchaseInformationLayout();

      purchasesModel.fetch({
        url: purchasesModel.getUrl(receiptLink),

        success: function (response) {
          var purchaseSummaryView = new View.PurchaseSummaryView({
            model: purchasesModel
          });

          purchaseInfoLayout.purchaseSummaryRegion.show(purchaseSummaryView);

          purchaseInfoLayout.purchaseBillingAddressRegion.show(new View.PurchaseBillingAddressView({
            model: new Backbone.Model(purchasesModel.get('billingAddress'))
          }));

          purchaseInfoLayout.purchaseLineItemsRegion.show(new View.PurchaseLineItemsView({
            collection: new Backbone.Collection(purchasesModel.get('lineItems'))
          }));

          if (purchasesModel.get('paymentMeans').displayValue) {
            purchaseInfoLayout.purchasePaymentMethodsRegion.show(new View.PurchasePaymentMeansView({
              model: new Backbone.Model(purchasesModel.get('paymentMeans'))
            }));
          }
        }

      });

      return purchaseInfoLayout;
    };


    return {
      DefaultView: defaultView

    };
  }
);
