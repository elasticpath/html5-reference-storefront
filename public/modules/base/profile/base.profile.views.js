/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 *
 * Default Profile Views
 * The HTML5 Reference Storefront's MVC Views for displaying user's basic information, subscription items information,
 * addresses, and payment methods. Address and payment methods views are just wrappers, and calls address.component and
 * payment.component respectively to display address and payment information.
 */
define(function (require) {
    var Marionette = require('marionette');
    var EventBus = require('eventbus');
    var Mediator = require('mediator');
    var ViewHelpers = require('viewHelpers');
    var utils = require('utils');

    /**
     * Template helper functions
     */
    var viewHelpers = ViewHelpers.extend({
      /**
       * Get date's display value
       * @param dateObj date object
       * @returns string display value of date
       */
      getDate: function (dateObj) {
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
      getTotal: function (totalObj) {
        var total = '';

        if (totalObj) {
          total = totalObj.display;
        }

        return total;
      }
    });

    function getPersonalInfoFormValue() {
      return {
        "family-name": $('#FamilyName').val(),
        "given-name": $('#GivenName').val()
      };
    }

    function translatePersonalInfoFormErrorMessage(rawMsg) {
      var cortexMsgToKeyMap = {
        "Required fields 'family-name' or 'given-name' are missing" : 'generic',
        "given-name: attribute is required"                         : 'missingFirstName',
        "family-name: attribute is required"                        : 'missingLastName'
      };

      return utils.translateErrorMessage(rawMsg, cortexMsgToKeyMap, {
        localePrefix: 'profile.personalInfo.errorMsg.'
      });
    }

    // Default Profile Layout
    var defaultLayout = Marionette.Layout.extend({
      template: '#ProfileMainTemplate',
      regions: {
        profileTitleRegion: '[data-region="profileTitleRegion"]',
        profilePersonalInfoRegion: '[data-region="profilePersonalInfoRegion"]',
        profileSubscriptionSummaryRegion: '[data-region="profileSubscriptionSummaryRegion"]',
        profilePurchaseHistoryRegion: '[data-region="profilePurchaseHistoryRegion"]',
        profileAddressesRegion: '[data-region="profileAddressesRegion"]',
        profilePaymentMethodsRegion: '[data-region="profilePaymentMethodsRegion"]'
      },
      className: 'container',
      templateHelpers: viewHelpers

    });

    /**
     * Title View, will render profile page title.
     * @type Marionette.ItemView
     */
    var profileTitleView = Marionette.ItemView.extend({
      template: '#ProfileTitleTemplate',
      tagName: 'h1',
      templateHelpers: viewHelpers
    });


    /**
     * Profile Personal Info View
     * will render a user's personal information including first and last name,
     * and a button to edit these information.
     * @type Marionette.ItemView
     */
    var profilePersonalInfoView = Marionette.ItemView.extend({
      template: '#ProfilePersonalInfoViewTemplate',
      templateHelpers: viewHelpers,
      ui: {
        editBtn: '[data-el-label="profile.editPersonalInfoBtn"]'
      },
      modelEvents: {
        'change': 'render'
      },
      events: {
        'click @ui.editBtn': function (event) {
          event.preventDefault();
          EventBus.trigger('profile.editPersonalInfoBtnClicked', this.model);  // checkin personalInfo
        }
      }
    });

    /**
     * Personal Information Form View
     * will render a form to edit user's personal info such as first and last name.
     * @type Marionette.ItemView
     */
    var personalInfoFormView = Marionette.ItemView.extend({
      template: '#ProfilePersonalInfoFormTemplate',
      templateHelpers: viewHelpers,
      ui: {
        saveBtn: '[data-el-label="profile.personalInfo.saveBtn"]',
        cancelBtn: '[data-el-label="profile.personalInfo.cancelBtn"]'
      },
      events: {
        'click @ui.saveBtn': function (event) {
          event.preventDefault();
          EventBus.trigger('profile.personalInfoFormSaveBtnClicked', this.model.get('actionLink'));
        },
        'click @ui.cancelBtn': function (event) {
          event.preventDefault();
          EventBus.trigger('profile.personalInfoFormCancelBtnClicked');
        }
      }
    });

    /**
     * Renders individual validation errors as list items (used by registrationErrorCollectionView).
     * @type Marionette.ItemView
     */
    var errorItemView = Marionette.ItemView.extend({
      tagName: 'li',
      template: '#PersonalInfoFormErrorItemTemplate'
    });

    /**
     * Personal Info Form Error Collection
     * will render the error(s) from personal info form submission.
     * @type Marionette.CollectionView
     */
    var personalInfoFormErrorCollectionView = Marionette.CollectionView.extend({
      className: 'error-list',
      itemView: errorItemView,
      tagName: 'ul'
    });

    var profileSubscriptionItemView = Marionette.ItemView.extend({
      template: '#SubscriptionItemTemplate',
      tagName: 'tr',
      templateHelpers: viewHelpers
    });

    var profileSubscriptionSummaryView = Marionette.CompositeView.extend({
      template: '#ProfileSubscriptionSummaryTemplate',
      itemView: profileSubscriptionItemView,
      itemViewContainer: 'tbody',
      className: 'table-responsive',
      templateHelpers: viewHelpers,
      onShow: function () {
        if (this.collection && this.collection.length <= 0) {
          $('[data-region="profileSubscriptionSummaryRegion"]').hide();
        }
      }
    });

    /**
     * Profile Purchase Detail Item View
     * will render 1 purchase record with its purchase number, date, total, status
     * @type Marionette.Layout
     */
    var profilePurchaseDetailView = Marionette.ItemView.extend({
      template: '#DefaultProfilePurchaseDetailTemplate',
      tagName: 'tr',
      templateHelpers: viewHelpers
    });

    /**
     * Profile Purchases History Empty View
     * will render a no-purchase-history-message when purchases collection is empty
     * @type Marionette.ItemView
     */
    var profilePurchasesHistoryEmptyView = Marionette.ItemView.extend({
      template: '#DefaultProfilePurchasesEmptyViewTemplate',
      className: 'profile-no-purchase-history-msg-container',
      templateHelpers: viewHelpers,
      attributes: {
        'data-el-label': 'profile.noPurchaseHistoryMsg'
      }
    });

    /**
     * Profile Purchase History View
     * will render wrappers with region title and table header around a collection of purchase records,
     * will render emptyView if collection empty.
     * @type Marionette.CompositeView
     */
    var profilePurchasesHistoryView = Marionette.CompositeView.extend({
      template: '#DefaultProfilePurchasesHistoryTemplate',
      itemViewContainer: 'tbody',
      itemView: profilePurchaseDetailView,
      emptyView: profilePurchasesHistoryEmptyView,
      className: 'table-responsive',
      templateHelpers: viewHelpers,
      onRender: function () {
        if (this.collection.length === 0) {
          $('thead', this.$el).hide();
        }
      }
    });


    /**
     * Profile Payment Method Item View
     * make mediator request to load an paymentMethod view in region: profilePaymentMethodComponentRegion,
     * will render a wrapper around the paymentMethod view
     * @type Marionette.Layout
     */
    var profilePaymentMethodItemView = Marionette.Layout.extend({
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
    var profilePaymentMethodEmptyView = Marionette.ItemView.extend({
      template: '#DefaultProfilePaymentMethodEmptyViewTemplate',
      tagName: 'li',
      className: 'profile-no-payment-method-msg-container',
      templateHelpers: viewHelpers,
      attributes: {
        'data-el-label': 'profile.noPaymentMethodMsg'
      }
    });

    /**
     * Profile Payment Methods View
     * will render a collection of payment methods with surrounding element such as heading,
     * will render emptyView if collection empty.
     * @type Marionette.CompositeView
     */
    var profilePaymentMethodsView = Marionette.CompositeView.extend({
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
    var profileAddressItemView = Marionette.Layout.extend({
      template: '#DefaultProfileAddressLayoutTemplate',
      tagName: 'li',
      className: 'profile-address-container',
      regions: {
        profileAddressComponentRegion: '[data-region="profileAddressComponentRegion"]'
      },
      templateHelpers: viewHelpers,
      onShow: function () {
        Mediator.fire('mediator.loadAddressesViewRequest', {
          region: this.profileAddressComponentRegion,
          model: this.model
        });
      },
      events: {
        'click [data-el-label="profile.deleteAddressBtn"]': function (event) {
          event.preventDefault();
          EventBus.trigger('profile.deleteAddressBtnClicked', this.model.get('href'));
        },
        'click [data-el-label="profile.editAddressBtn"]': function (event) {
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
    var profileAddressesEmptyView = Marionette.ItemView.extend({
      template: '#DefaultProfileAddressesEmptyViewTemplate',
      tagName: 'li',
      className: 'profile-no-address-msg-container container',
      templateHelpers: viewHelpers,
      attributes: {
        'data-el-label': 'profile.noAddressMsg'
      }
    });

    /**
     * Profile Addresses View
     * will render a collection of addresses with surrounding element such as heading,
     * will render emptyView if collection empty.
     * @type Marionette.CompositeView
     */
    var profileAddressesView = Marionette.CompositeView.extend({
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
        'click [data-el-label="profile.addNewAddressBtn"]': function (event) {
          event.preventDefault();
          EventBus.trigger('profile.addNewAddressBtnClicked');
        }
      }
    });


    var __test_only__ = {
      viewHelpers: viewHelpers,
      ProfileSubscriptionItemView: profileSubscriptionItemView,
      ProfilePurchaseDetailView: profilePurchaseDetailView,
      ProfilePaymentMethodItemView: profilePaymentMethodItemView,
      ProfilePaymentMethodsEmptyView: profilePaymentMethodEmptyView,
      ProfileAddressItemView: profileAddressItemView,
      ProfileAddressesEmptyView: profileAddressesEmptyView,
      ErrorItemView: errorItemView
    };

    return {
      /* test-code */
      __test_only__: __test_only__,
      /* end-test-code */

      DefaultLayout: defaultLayout,
      ProfileTitleView: profileTitleView,
      ProfilePersonalInfoView: profilePersonalInfoView,
      PersonalInfoFormView: personalInfoFormView,
      PersonalInfoFormErrorCollectionView: personalInfoFormErrorCollectionView,
      ProfileSubscriptionSummaryView: profileSubscriptionSummaryView,
      ProfilePurchasesHistoryView: profilePurchasesHistoryView,
      ProfilePaymentMethodsView: profilePaymentMethodsView,
      ProfileAddressesView: profileAddressesView,

      getPersonalInfoFormValue: getPersonalInfoFormValue,
      translatePersonalInfoFormErrorMessage: translatePersonalInfoFormErrorMessage
    };
  }
);
