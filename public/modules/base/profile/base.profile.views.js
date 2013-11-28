/**
 * Copyright Elastic Path Software 2013.
 *
 * Default Profile Views & viewHelpers
 */
define(['marionette','i18n', 'mediator', 'eventbus', 'viewHelpers'],
  function(Marionette, i18n, Mediator, EventBus, ViewHelpers){

    /**
     * Template helper functions
     */
    var viewHelpers = ViewHelpers.extend({});

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

    /**
     * Profile Address Item View
     * make mediator request to load an address view in region: profileAddressComponentRegion,
     * will render a wrapper around an address view
     * @type Marionette.Layout
     */
    var profileAddressItemView = Backbone.Marionette.Layout.extend({
      template: '#DefaultProfileAddressLayoutTemplate',
      tagName: 'li',
      className: 'profile-address-container',
      regions: {
        profileAddressComponentRegion: '[data-region="profileAddressComponentRegion"]'
      },
      onShow: function() {
        Mediator.fire('mediator.loadAddressesViewRequest', {
          region: this.profileAddressComponentRegion,
          model: this.model
        });
      }
    });

    /**
     * Profile Addresses Empty View
     * will render a no-address-message when addresses collection is empty
     * @type Marionette.ItemView
     */
    var profileAddressesEmptyView = Backbone.Marionette.ItemView.extend({
      template: '#DefaultProfileAddressesEmptyViewTemplate',
      tagName: 'li',
      className: 'profile-no-address-msg-container container',
      templateHelpers: viewHelpers,
      attributes: {
        'data-el-label' : 'profile.noAddressMsg'
      }
    });

    /**
     * Profile Addresses View
     * will render a collection of addresses with surrounding element such as heading,
     * will render emptyView if collection empty.
     * @type Marionette.CompositeView
     */
    var profileAddressesView = Backbone.Marionette.CompositeView.extend({
      template: '#DefaultProfileAddressesTemplate',
      emptyView: profileAddressesEmptyView,
      itemView: profileAddressItemView,
      itemViewContainer: 'ul',
      templateHelpers: viewHelpers,
      events: {
        'click [data-el-label="profile.addNewAddressBtn"]': function(event) {
          event.preventDefault();
          EventBus.trigger('profile.addNewAddressBtnClicked');
        }
      }
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
