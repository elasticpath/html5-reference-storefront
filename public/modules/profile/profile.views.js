/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 */
define(['marionette','i18n'],
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

      }
    };

    // Default Profile Layout
    var defaultLayout = Backbone.Marionette.Layout.extend({
      template:'#ProfileMainTemplate',
      regions:{
        profileSummaryRegion:'[data-region="profileSummaryRegion"]',
        profileSubscriptionSummaryRegion:'[data-region="profileSubscriptionSummaryRegion"]',
        profileShippingAddressRegion:'[data-region="profileShippingAddressRegion"]',
        profileBillingAddressRegion:'[data-region="profileBillingAddressRegion"]',
        profilePaymentMethodRegion:'[data-region="profilePaymentMethodRegion"]'
      },
      className:'container',
      templateHelpers:viewHelpers

    });

    var profileSubscriptionItemView = Backbone.Marionette.ItemView.extend({
      template:'#SubscriptionItemTemplate',
      tagName:'tr',
      templateHelpers:viewHelpers
    });
    var profileSubscriptionSummaryView = Backbone.Marionette.CompositeView.extend({
      template:'#ProfileSubscriptionSummaryTemplate',
      itemView:profileSubscriptionItemView,
      itemViewContainer:'tbody',
      className:'table-responsive',
      templateHelpers:viewHelpers

    });

    // Profile Summary View
    var profileSummaryView = Backbone.Marionette.ItemView.extend({
      template:'#ProfileSummaryViewTemplate',
      templateHelpers:viewHelpers

  });

    // Profile Payment Method Item View
    var paymentMethodItemView = Backbone.Marionette.ItemView.extend({
      template:'#ProfilePaymentMethodTemplate',
      templateHelpers:viewHelpers

    });

    // Profile Payment Method View
    var paymentMethodsView = Backbone.Marionette.CompositeView.extend({
      template:'#ProfilePaymentMethodsTemplate',
      itemView:paymentMethodItemView,
      itemViewContainer:'ul',
      templateHelpers:viewHelpers
    });


    return {
      DefaultLayout:defaultLayout,
      ProfileSubscriptionSummaryView:profileSubscriptionSummaryView,
      ProfileSummaryView:profileSummaryView,
      PaymentMethodsView:paymentMethodsView

    };
  }
);
