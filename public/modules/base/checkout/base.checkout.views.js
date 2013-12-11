/**
 * Copyright Elastic Path Software 2013.
 *
 * Storefront - Checkout Views
 */
define(function (require) {
    var EventBus = require('eventbus');
    var Mediator = require('mediator');
    var Marionette = require('marionette');
    var ViewHelpers = require('viewHelpers');

    var viewHelpers = ViewHelpers.extend({
      /**
       * Determine if checkout button should be disabled, and return a disabled attribute or empty string respectively.
       * Assuming must be authenticated to view the page if anonymous checkout is not allowed.
       *
       * @param submitOrderActionLink The action-link to which the submit order request is posted.
       * @returns {string} HTML disabled attribute or empty string
       */
      getSubmitOrderButtonDisabledAttr: function (submitOrderActionLink) {
        // complete purchase disabled by default
        var retVar = 'disabled="disabled"';

        if (submitOrderActionLink) {
          retVar = '';
        }

        return retVar;
      },

      /**
       * Determines if this is the chosen billing address and if so, returns the HTML checked attribute
       * to be applied to the chosen billing address radio button in BillingAddressSelectorTemplate.
       *
       * @param model The billing address model being rendered
       * @returns {string} HTML checked attribute or empty string
       */
      getBillingAddressCheckedAttr: function(model) {
        var checkedAttr = '';

        if (model.chosen === true) {
          checkedAttr = 'checked="checked"';
        }

        return checkedAttr;
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
        billingAddressesRegion: '[data-region="billingAddressesRegion"]',
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
     * Checkout Billing Address Selector Layout
     * Makes a mediator request to load an address view in region: billingAddressRegion,
     * will render a wrapper around an address view
     * @type Marionette.Layout
     */
    var billingAddressSelectorLayout = Backbone.Marionette.Layout.extend({
      template: '#BillingAddressSelectorTemplate',
      templateHelpers: viewHelpers,
      regions: {
        billingAddressRegion: '[data-region="billingAddressRegion"]'
      },
      events: {
        'change input[name="billingAddress"]': function () {

          EventBus.trigger('checkout.billingAddressRadioChanged', this.model.get('selectAction'));
        }
      },
      onShow: function () {
        // fire event to load the address itemView from component
        Mediator.fire('mediator.loadAddressesViewRequest', {
          region: this.billingAddressRegion,
          model: this.model
        });
      }
    });

    /**
     * Checkout Billing Address Composite View
     * will render a wrapper with heading around a list of billing addresses
     * @type Marionette.CompositeView
     */
    var billingAddressesCompositeView = Backbone.Marionette.CompositeView.extend({
      template: '#BillingAddressesTemplate',
      templateHelpers: viewHelpers,
      itemView: billingAddressSelectorLayout,
      itemViewContainer: '[data-region="billingAddressSelectorsRegion"]'
    });

    /**
     * Default Cancel Checkout Action View, will render cancel checkout button.
     * @type Marionette.ItemView
     */
    var cancelCheckoutActionView = Marionette.ItemView.extend({
      template: '#CancelCheckoutActionTemplate',
      templateHelpers: viewHelpers,
      events: {
        'click .btn-cancel-order': function() {
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

    var checkoutTaxTotalView = Marionette.ItemView.extend({
      template: "#CheckoutTaxTotalTemplate",
      className: 'checkout-tax-total',
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
        checkoutTaxTotalRegion: '[data-region="checkoutTaxTotalRegion"]',
        checkoutTaxBreakDownRegion: '[data-region="checkoutTaxBreakDownRegion"]'
      },
      events: {
        'click .btn-cmd-submit-order': function () {
          EventBus.trigger('checkout.submitOrderBtnClicked', this.model.get('submitOrderActionLink'));
        }
      }
    });

    return {
      DefaultLayout: defaultLayout,
      CheckoutTitleView: checkoutTitleView,
      BillingAddressSelectorLayout: billingAddressSelectorLayout,
      BillingAddressesCompositeView: billingAddressesCompositeView,
      CancelCheckoutActionView: cancelCheckoutActionView,
      CheckoutSummaryView: checkoutSummaryView,
      CheckoutTaxTotalView: checkoutTaxTotalView,
      CheckoutTaxesCollectionView: checkoutTaxesCollectionView,
      setCheckoutButtonProcessing: setCheckoutButtonProcessing,
      resetCheckoutButtonText: resetCheckoutButtonText
    };
  }
);
