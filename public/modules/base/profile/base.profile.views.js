/**
 * Copyright Elastic Path Software 2013.
 *
 * Default Profile Views
 *
 * The HTML5 Reference Storefront's MVC Views for displaying user's basic information, subscription items information,
 * addresses, and payment methods. Address and payment methods views are just wrappers, and calls address.component and
 * payment.component respectively to display address and payment information.
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

    /**
     * Profile Payment Method Item View
     * make mediator request to load an paymentMethod view in region: profilePaymentMethodComponentRegion,
     * will render a wrapper around the paymentMethod view
     * @type Marionette.Layout
     */
    var profilePaymentMethodItemView = Backbone.Marionette.Layout.extend({
      template: '#DefaultProfilePaymentMethodLayoutTemplate',
      tagName: 'li',
      className: 'profile-payment-method-container',
      regions: {
        profilePaymentMethodComponentRegion: '[data-region="profilePaymentMethodComponentRegion"]'
      },
      onShow: function () {
        Mediator.fire('mediator.loadPaymentMethodViewRequest', {
          region: this.profilePaymentMethodComponentRegion,
          model: this.model
        });
      }
    });

    /**
     * Profile Payment Methods Empty View
     * will render a no-payment-method-message when payment methods collection is empty
     * @type Marionette.ItemView
     */
    var profilePaymentMethodEmptyView = Backbone.Marionette.ItemView.extend({
      template: '#DefaultProfilePaymentMethodEmptyViewTemplate',
      tagName: 'li',
      className: 'profile-no-payment-method-msg-container container',
      templateHelpers: viewHelpers,
      attributes: {
        'data-el-label' : 'profile.noPaymentMethodMsg'
      }
    });

    /**
     * Profile Payment Methods View
     * will render a collection of payment methods with surrounding element such as heading,
     * will render emptyView if collection empty.
     * @type Marionette.CompositeView
     */
    var profilePaymentMethodsView = Backbone.Marionette.CompositeView.extend({
      template: '#DefaultProfilePaymentsTemplate',
      emptyView: profilePaymentMethodEmptyView,
      itemView: profilePaymentMethodItemView,
      itemViewContainer: 'ul',
      templateHelpers: viewHelpers
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
      ProfileSummaryView:profileSummaryView,
      ProfilePaymentMethodsView:profilePaymentMethodsView,
      ProfileAddressesView: profileAddressesView,
      testVariables: {
        ProfileSubscriptionItemView: profileSubscriptionItemView,
        ProfilePaymentMethodItemView: profilePaymentMethodItemView,
        ProfilePaymentMethodsEmptyView: profilePaymentMethodEmptyView,
        ProfileAddressItemView: profileAddressItemView,
        ProfileAddressesEmptyView: profileAddressesEmptyView
      }
    };
  }
);
