/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 */
define(['marionette'],
  function(Marionette){

    var viewHelpers = {
      wtf:function(model){
        var x = model;
        return x;
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
      className:'container'
    });

    var profileSubscriptionSummaryView = Backbone.Marionette.ItemView.extend({
      template:'#ProfileSubscriptionSummaryTemplate'
    });

    // Profile Summary View
    var profileSummaryView = Backbone.Marionette.ItemView.extend({
      template:'#ProfileSummaryViewTemplate'
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
