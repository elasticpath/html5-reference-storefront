/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 *
 * Default Profile Views
 * The HTML5 Reference Storefront's MVC Views for displaying user's basic information, subscription items information,
 * addresses, and payment methods. Address and payment methods views are just wrappers, and calls address.component and
 * payment.component respectively to display address and payment information.
 */
define(['marionette','i18n', 'mediator', 'eventbus', 'viewHelpers'],
  function(Marionette, i18n, Mediator, EventBus, ViewHelpers){

    /**
     * Template helper functions
     */
    var viewHelpers = ViewHelpers.extend({
      /**
       * Get date's display value
       * @param dateObj date object
       * @returns string display value of date
       */
      getDate: function(dateObj) {
        var value = '';

        if (dateObj) {
          value = dateObj.displayValue;
        }

        return value;
      },

      /**
       * Get display value of total cost.
       * @param totalObj  total cost object
       * @returns string  display value of total cost
       */
      getTotal: function(totalObj) {
        var total = '';

        if(totalObj) {
          total = totalObj.display;
        }

        return total;
      }
    });

    // Default Profile Layout
    var defaultLayout = Backbone.Marionette.Layout.extend({
      template:'#ProfileMainTemplate',
      regions:{
        profileTitleRegion:'[data-region="profileTitleRegion"]',
        profileSummaryRegion:'[data-region="profileSummaryRegion"]',
        profileSubscriptionSummaryRegion:'[data-region="profileSubscriptionSummaryRegion"]',
        profilePurchaseHistoryRegion:'[data-region="profilePurchaseHistoryRegion"]',
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

    /**
     * Profile Purchase Detail Item View
     * will render 1 purchase record with its purchase number, date, total, status
     * @type Marionette.Layout
     */
    var profilePurchaseDetailView = Marionette.ItemView.extend({
      template:'#DefaultProfilePurchaseDetailTemplate',
      tagName:'tr',
      templateHelpers:viewHelpers
    });

    /**
     * Profile Purchases History Empty View
     * will render a no-purchase-history-message when purchases collection is empty
     * @type Marionette.ItemView
     */
    var profilePurchasesHistoryEmptyView = Backbone.Marionette.ItemView.extend({
      template: '#DefaultProfilePurchasesEmptyViewTemplate',
      className: 'profile-no-purchase-history-msg-container',
      templateHelpers: viewHelpers,
      attributes: {
        'data-el-label' : 'profile.noPurchaseHistoryMsg'
      }
    });

    /**
     * Profile Purchase History View
     * will render wrappers with region title and table header around a collection of purchase records,
     * will render emptyView if collection empty.
     * @type Marionette.CompositeView
     */
    var profilePurchasesHistoryView = Marionette.CompositeView.extend({
      template:'#DefaultProfilePurchasesHistoryTemplate',
      itemViewContainer:'tbody',
      itemView: profilePurchaseDetailView,
      emptyView: profilePurchasesHistoryEmptyView,
      className:'table-responsive',
      templateHelpers:viewHelpers,
      onRender: function() {
        if (this.collection.length === 0) {
          $('thead', this.$el).hide();
        }
      }
    });


    // Profile Summary View
    var profileSummaryView = Backbone.Marionette.ItemView.extend({
      template: '#ProfileSummaryViewTemplate',
      templateHelpers: viewHelpers

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
      className: 'profile-no-payment-method-msg-container',
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
     * Makes a mediator request to load an address view in region: profileAddressComponentRegion
     * and will render a wrapper around an address view with edit button.
     * @type Marionette.Layout
     */
    var profileAddressItemView = Backbone.Marionette.Layout.extend({
      template: '#DefaultProfileAddressLayoutTemplate',
      tagName: 'li',
      className: 'profile-address-container',
      regions: {
        profileAddressComponentRegion: '[data-region="profileAddressComponentRegion"]'
      },
      templateHelpers: viewHelpers,
      onShow: function() {
        Mediator.fire('mediator.loadAddressesViewRequest', {
          region: this.profileAddressComponentRegion,
          model: this.model
        });
      },
      events: {
        'click [data-el-label="profile.deleteAddressBtn"]': function(event) {
          event.preventDefault();
          EventBus.trigger('profile.deleteAddressBtnClicked', this.model.get('href'));
        },
        'click [data-el-label="profile.editAddressBtn"]': function(event) {
          event.preventDefault();
          EventBus.trigger('profile.editAddressBtnClicked', this.model.get('href'));
        }
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
      ui: {
        // A jQuery selector for the DOM element to which an activity indicator should be applied.
        activityIndicatorEl: '.profile-addresses-listing'
      },
      events: {
        'click [data-el-label="profile.addNewAddressBtn"]': function(event) {
          event.preventDefault();
          EventBus.trigger('profile.addNewAddressBtnClicked');
        }
      }
    });

    /**
     * This view is rendered in the modal region to obtain confirmation from the user before proceeding
     * with a request to delete an address.
     */
    var profileDeleteAddressConfirmationView = Backbone.Marionette.ItemView.extend({
      className:'profile-delete-confirm-modal',
      template:'#ProfileDeleteConfirmationModalTemplate',
      templateHelpers:viewHelpers,
      events:{
        'click .btn-yes':function(event) {
          event.preventDefault();
          EventBus.trigger('profile.deleteAddressConfirmYesBtnClicked', this.options.href);
        },
        'click .btn-no':function(event) {
          event.preventDefault();
          $.modal.close();
        }
      }
    });

    return {
      DefaultLayout:defaultLayout,
      ProfileTitleView: profileTitleView,
      ProfileSubscriptionSummaryView:profileSubscriptionSummaryView,
      ProfilePurchasesHistoryView: profilePurchasesHistoryView,
      ProfileSummaryView:profileSummaryView,
      ProfilePaymentMethodsView:profilePaymentMethodsView,
      ProfileAddressesView: profileAddressesView,
      ProfileDeleteAddressConfirmationView: profileDeleteAddressConfirmationView,
      testVariables: {
        viewHelpers: viewHelpers,
        ProfileSubscriptionItemView: profileSubscriptionItemView,
        ProfilePurchaseDetailView: profilePurchaseDetailView,
        ProfilePaymentMethodItemView: profilePaymentMethodItemView,
        ProfilePaymentMethodsEmptyView: profilePaymentMethodEmptyView,
        ProfileAddressItemView: profileAddressItemView,
        ProfileAddressesEmptyView: profileAddressesEmptyView
      }
    };
  }
);
