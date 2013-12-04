/**
 * Copyright Elastic Path Software 2013.
 *
 * Storefront - Checkout Views
 */
define(function (require) {
    var ep = require('ep');
    var EventBus = require('eventbus');
    var Mediator = require('mediator');
    var Marionette = require('marionette');
    var ViewHelpers = require('viewHelpers');

    var viewHelpers = ViewHelpers.extend({
      /**
       * Determine if checkout button should be disabled, and return a disabled attribute or empty string respectively.
       * Assuming must be authenticated to view the page if anonymous checkout is not allowed.
       *
       * @param submitOrderActionLink action-link to post submit order request to, only present if allow submit order.
       * @returns {string} HTML disabled attribute or empty string
       */
      getSubmitOrderButtonDisabledAttrib: function (submitOrderActionLink) {
        // complete purchase disabled by default
        var retVar = 'disabled="disabled"';

        if (submitOrderActionLink) {
          retVar = '';
        }

        return retVar;
      }
    });

    /*
     * Functions
     *
     * */
    // Set Checkout Button to Processing State
    function setCheckoutButtonProcessing() {
      $('.btn-cmd-submit-order').html('<img src="images/activity-indicator-strobe.gif" />');
    }

    // Set Checkout Button to Ready State
    function resetCheckoutButtonText() {
      $('.btn-cmd-submit-order').html(viewHelpers.getI18nLabel('checkout.submitOrder'));
    }

    /**
     * Default Checkout Layout to be rendered into appMain Region.
     * Defines top level regions on checkout page.
     *
     * @type Marionette.Layout
     */
    var defaultLayout = Marionette.Layout.extend({
      template: '#DefaultCheckoutLayoutTemplate',
      templateHelpers: viewHelpers,
      className: 'checkout-container container',
      regions: {
        checkoutTitleRegion: '[data-region="checkoutTitleRegion"]',
        chosenBillingAddressRegion: '[data-region="chosenBillingAddressRegion"]',
        cancelCheckoutActionRegion: '[data-region="cancelCheckoutActionRegion"]',
        checkoutOrderRegion: '[data-region="checkoutOrderRegion"]'
      }
    });

    /**
     * Default Checkout Title View, will render checkout page title.
     * @type Marionette.ItemView
     */
    var checkoutTitleView = Marionette.ItemView.extend({
      template: '#DefaultCheckoutTitleTemplate',
      templateHelpers: viewHelpers
    });

    /**
     * Checkout Billing Address View
     * make mediator request to load an address view in region: billingAddressComponentRegion,
     * will render a wrapper around an address view
     * @type Marionette.Layout
     */
    var billingAddressLayout = Marionette.Layout.extend({
      template: '#DefaultBillingAddressTemplate',
      templateHelpers: viewHelpers,
      regions: {
        billingAddressComponentRegion: '[data-region="billingAddressComponentRegion"]'
      },
      onShow: function () {
        // fire event to load the address itemView from component
        Mediator.fire('mediator.loadAddressesViewRequest', {
          region: this.billingAddressComponentRegion,
          model: this.model
        });
      }
    });

    /**
     * Default Cancel Checkout Action View, will render cancel checkout button.
     * @type Marionette.ItemView
     */
    var cancelCheckoutActionView = Marionette.ItemView.extend({
      template: '#CancelCheckoutActionTemplate',
      templateHelpers: viewHelpers,
      events: {
        'click .btn-cancel-order': function (event) {
          EventBus.trigger('checkout.cancelOrderBtnClicked');
        }
      }
    });

    /**
     * Default Checkout Tax View, will render a tax.
     * @type Marionette.ItemView
     */
    var checkoutTaxView = Marionette.ItemView.extend({
      template: '#CheckoutTaxTemplate',
      tagName: 'li',
      className: 'checkout-tax',
      templateHelpers: viewHelpers
    });

    /**
     * Default Checkout Taxes Collection View, will render a collection of taxes
     * @type Marionette.CollectionView
     */
    var checkoutTaxesCollectionView = Marionette.CollectionView.extend({
      tagName: 'ul',
      className: 'checkout-tax-list',
      itemView: checkoutTaxView
    });

    /**
     * Default Checkout Summary View, will render order summary information & submit order button.
     * @type Marionette.Layout
     */
    var checkoutSummaryView = Marionette.Layout.extend({
      template: '#CheckoutSummaryTemplate',
      className: 'checkout-sidebar-inner',
      templateHelpers: viewHelpers,
      regions: {
        checkoutTaxBreakDownRegion: '[data-region="checkoutTaxBreakDownRegion"]'
      },
      events: {
        'click .btn-cmd-submit-order': function (event) {
          EventBus.trigger('checkout.submitOrderBtnClicked', this.model.get('submitOrderActionLink'));
        }
      }
    });

    return {
      DefaultLayout: defaultLayout,
      CheckoutTitleView: checkoutTitleView,
      BillingAddressLayout: billingAddressLayout,
      CancelCheckoutActionView: cancelCheckoutActionView,
      CheckoutSummaryView: checkoutSummaryView,
      CheckoutTaxesCollectionView: checkoutTaxesCollectionView,
      setCheckoutButtonProcessing: setCheckoutButtonProcessing,
      resetCheckoutButtonText: resetCheckoutButtonText
    };
  }
);
