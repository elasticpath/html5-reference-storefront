/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 * Default PurchaseInfo Controller
 * The HTML5 Reference Storefront's MVC controller instantiates the purchaseInfo model and views,
 * renders purchaseinfo views in designated regions.
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

    /**
     * Renders a default purchase receipt view. Instantiate the wrapper view PurchaseReceiptLayout,
     * and onShow of this view, call to render purchase information views.
     * @param   href to a cortex purchase resource
     * @returns {View.PurchaseReceiptLayout} PurchaseReceiptLayout with child views ready to render
     */
    var purchaseReceiptView = function(link) {
      var purchaseReceiptView = new View.PurchaseReceiptLayout();

      purchaseReceiptView.on('show', function() {
        purchaseReceiptView.purchaseInfoRegion.show(purchaseInfoView(link));
      });

      return purchaseReceiptView;
    };

    /**
     * Renders a default purchase details view. Instantiate the wrapper view PurchaseDetailsLayout,
     * and onShow of this view, call to render purchase information views.
     * @param   href to a cortex purchase resource
     * @returns {View.PurchaseDetailsLayout} PurchaseDetailsLayout with child views ready to render
     */
    var purchaseDetailsView = function(link) {
     var purchaseDetailsView = new View.PurchaseDetailsLayout();

      purchaseDetailsView.on('show', function() {
        purchaseDetailsView.purchaseInfoRegion.show(purchaseInfoView(link));
      });

      return purchaseDetailsView;
    };

    /**
     * Renders the default purchaseInfoView. Instantiate the models and views, and fetch model from backend;
     * upon model fetch success, renders purchase information views in designated regions.
     * @returns {View.PurchaseInformationLayout} view with populated data and child views ready to render
     */
    var purchaseInfoView = function (receiptLink) {
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
      PurchaseReceiptView: purchaseReceiptView,
      PurchaseDetailsView: purchaseDetailsView
    };
  }
);
