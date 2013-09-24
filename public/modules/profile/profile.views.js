/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 */
define(['marionette'],
  function(Marionette){


    // Default Profile Layout
    var defaultLayout = Backbone.Marionette.Layout.extend({
      template:'#ProfileMainTemplate',
      regions:{
        profileSummaryRegion:'[data-region="profileSummaryRegion"]',
        profileSubscriptionSummaryRegion:'[data-region="profileSubscriptionSummaryRegion"]',
        profileShippingAddressRegion:'[data-region="profileShippingAddressRegion"]',
        profileBillingAddressRegion:'[data-region="profileBillingAddressRegion"]',
        profilePaymentMethodRegion:'[data-region="profilePaymentMethodRegion"]'
      }
    });

    var profileSubscriptionSummaryView = Backbone.Marionette.ItemView.extend({
      template:'#ProfileSubscriptionSummaryTemplate'
    });

    // Profile Summary View
    var profileSummaryView = Backbone.Marionette.ItemView.extend({
      template:'#ProfileSummaryViewTemplate'
    });



    return {
      DefaultLayout:defaultLayout,
      ProfileSubscriptionSummaryView:profileSubscriptionSummaryView,
      ProfileSummaryView:profileSummaryView

    };
  }
);
