/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 */
define(['marionette','i18n', 'mediator'],
  function(Marionette, i18n, Mediator){

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
        profileTitleRegion:'[data-region="profileTitleRegion"]',
        profileSummaryRegion:'[data-region="profileSummaryRegion"]',
        profileSubscriptionSummaryRegion:'[data-region="profileSubscriptionSummaryRegion"]',
        profileAddressesRegion:'[data-region="profileAddressesRegion"]',
        profilePaymentMethodsRegion:'[data-region="profilePaymentMethodsRegion"]'
      },
      className:'container',
      templateHelpers:viewHelpers

    });

    var profileTitleView = Backbone.Marionette.ItemView.extend({
      template:'#ProfileTitleTemplate',
      tagName:'h1',
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

    // Profile Address Item View (layout)
    var profileAddressItemView = Backbone.Marionette.Layout.extend({
      template: '#DefaultProfileAddressLayoutTemplate',
      tagName: 'li',
      className: 'profile-address-container',
      regions: {
        profileAddressComponentRegion: '[data-region="profileAddressComponentRegion"]'
      },
      onShow: function() {
        // fire event to load the address itemView from component
        Mediator.fire('mediator.loadAddressesViewRequest', {
          region: this.profileAddressComponentRegion,
          model: this.model
        });
      }
    });

    // Profile Addresses Empty View
    var profileAddressesEmptyView = Backbone.Marionette.ItemView.extend({
      template: '#DefaultProfileAddressesEmptyViewTemplate',
      tagName: 'li',
      className: 'profile-no-address-msg-container container',
      templateHelpers: viewHelpers
    });

    // Profile Addresses View (compositeView)
    var profileAddressesView = Backbone.Marionette.CompositeView.extend({
      template: '#DefaultProfileAddressesTemplate',
      emptyView: profileAddressesEmptyView,
      itemView: profileAddressItemView,
      itemViewContainer: 'ul',
      templateHelpers: viewHelpers
    });

    return {
      DefaultLayout:defaultLayout,
      ProfileTitleView: profileTitleView,
      ProfileSubscriptionSummaryView:profileSubscriptionSummaryView,
      ProfileSubscriptionItemView: profileSubscriptionItemView,
      ProfileSummaryView:profileSummaryView,
      PaymentMethodsView:paymentMethodsView,
      ProfileAddressesView: profileAddressesView,
      ProfileAddressItemView: profileAddressItemView
    };
  }
);
