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
       * Determines if the object (billing/shipping address or shipping option) being rendered has been marked as
       * chosen (selected). If so, returns the HTML checked attribute to be applied to the associated radio button.
       *
       * @param obj The checkout object being rendered (billing/shipping addresses and shipping options are supported)
       * @returns {string} HTML checked attribute or empty string
       */
      getCheckoutRadioCheckedAttr: function(obj) {
        var checkedAttr = '';

        if (obj.chosen === true) {
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
        shippingAddressesRegion: '[data-region="shippingAddressesRegion"]',
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
     * A layout for rendering address (billing or shipping) radio buttons and their labels.
     * Makes a mediator request to load an address view in region: billingAddressRegion.
     * @type Marionette.Layout
     */
    var checkoutAddressSelectorLayout = Backbone.Marionette.Layout.extend({
      template: '#CheckoutAddressSelectorTemplate',
      templateHelpers: viewHelpers,
      serializeData: function() {
        // Append an extra value to the model to distinguish which type of address is to be rendered.
        var data = this.model.toJSON();
        data.addressType = this.options.addressType;
        return data;
      },
      regions: {
        checkoutAddressRegion: '[data-region="checkoutAddressRegion"]'
      },
      events: {
        'change input[type="radio"]': function () {
          EventBus.trigger('checkout.addressRadioChanged', this.model.get('selectAction'));
        }
      },
      onShow: function () {
        // Fire event to load the address itemView from component
        Mediator.fire('mediator.loadAddressesViewRequest', {
          region: this.checkoutAddressRegion,
          model: this.model
        });
      }
    });

    /**
     * Rendered by BillingAddressesCompositeView when there are no billing addresses to be displayed.
     * @type Marionette.ItemView
     */
    var billingAddressesEmptyView = Marionette.ItemView.extend({
      template: '#EmptyBillingAddressesTemplate',
      templateHelpers: viewHelpers
    });

    /**
     * Renders a heading and a list of billing addresses.
     * @type Marionette.CompositeView
     */
    var billingAddressesCompositeView = Backbone.Marionette.CompositeView.extend({
      template: '#BillingAddressesTemplate',
      templateHelpers: viewHelpers,
      itemView: checkoutAddressSelectorLayout,
      emptyView: billingAddressesEmptyView,
      // Make the type of address available to the itemView
      itemViewOptions: {
        addressType: 'billing'
      },
      itemViewContainer: '[data-region="billingAddressSelectorsRegion"]'
    });

    /**
     * Rendered by ShippingAddressesCompositeView when there are no shipping addresses to be displayed.
     * @type Marionette.ItemView
     */
    var shippingAddressesEmptyView = Marionette.ItemView.extend({
      template: '#EmptyShippingAddressesTemplate',
      templateHelpers: viewHelpers
    });

    /**
     * Renders a heading and a list of shipping addresses.
     * @type Marionette.CompositeView
     */
    var shippingAddressesCompositeView = Backbone.Marionette.CompositeView.extend({
      template: '#ShippingAddressesTemplate',
      templateHelpers: viewHelpers,
      itemView: checkoutAddressSelectorLayout,
      emptyView: shippingAddressesEmptyView,
      // Make the type of address available to the itemView
      itemViewOptions: {
        addressType: 'shipping'
      },
      itemViewContainer: '[data-region="shippingAddressSelectorsRegion"]'
    });

    /**
     * A layout for rendering shipping option radio buttons and their labels.
     * @type Marionette.ItemView
     */
    var shippingOptionsSelectorView = Backbone.Marionette.ItemView.extend({
      template: '#ShippingOptionSelectorTemplate',
      templateHelpers: viewHelpers,
      events: {
        'change input[type="radio"]': function () {
          EventBus.trigger('checkout.shippingOptionRadioChanged', this.model.get('selectAction'));
        }
      }
    });

    /**
     * Rendered by ShippingOptionsCompositeView when there are no shipping options to be displayed.
     * @type Marionette.ItemView
     */
    var shippingOptionsEmptyView = Marionette.ItemView.extend({
      template: '#EmptyShippingOptionsTemplate',
      templateHelpers: viewHelpers
    });

    /**
     * Renders a heading and a list of shipping options.
     * @type Marionette.CompositeView
     */
    var shippingOptionsCompositeView = Backbone.Marionette.CompositeView.extend({
      template: '#ShippingOptionsTemplate',
      templateHelpers: viewHelpers,
      itemView: shippingOptionsSelectorView,
      emptyView: shippingOptionsEmptyView,
      itemViewContainer: '[data-region="shippingOptionSelectorsRegion"]'
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
      CheckoutAddressSelectorLayout: checkoutAddressSelectorLayout,
      BillingAddressesCompositeView: billingAddressesCompositeView,
      ShippingAddressesCompositeView: shippingAddressesCompositeView,
      ShippingOptionsCompositeView: shippingOptionsCompositeView,
      CancelCheckoutActionView: cancelCheckoutActionView,
      CheckoutSummaryView: checkoutSummaryView,
      CheckoutTaxTotalView: checkoutTaxTotalView,
      CheckoutTaxesCollectionView: checkoutTaxesCollectionView,
      setCheckoutButtonProcessing: setCheckoutButtonProcessing,
      resetCheckoutButtonText: resetCheckoutButtonText
    };
  }
);
