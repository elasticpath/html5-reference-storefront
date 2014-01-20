/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 * Default Checkout Views
 * The MVC Views defines checkout views that displays
 *  - checkout confirmation information,
 *  - billing information selection,
 *  - shipping information selection,
 *  - and, payment information selection.
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
        // FIXME could this function be abstracted to be shared by cartSubmitBtn, itemAddToCartBtn, checkoutSubmitBtn etc etc?
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

        if (obj && obj.chosen === true) {
          checkedAttr = 'checked="checked"';
        }

        return checkedAttr;
      },

      /**
       * Generate an unique Id value for form input. Taking 1 parameter for prefix to append to the ID.
       * @param prefix text to prepend to the generated ID
       * @returns String an unique ID.
       */
      getUniqueIdForFormInput: function(prefix) {
        var uniqueId;

        if (prefix) {
          uniqueId = _.uniqueId(prefix);
        }
        else {
          uniqueId = _.uniqueId();
        }

        return uniqueId;
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
        shippingOptionsRegion: '[data-region="shippingOptionsRegion"]',
        paymentMethodsRegion: '[data-region="paymentMethodsRegion"]',
        checkoutOrderRegion: '[data-region="checkoutOrderRegion"]'
      }
    });

    /**
     * Renders the checkout page title.
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
    var checkoutAddressSelectorLayout = Marionette.Layout.extend({
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
          var eventName = 'checkout.' + this.options.addressType + 'AddressRadioChanged';
          EventBus.trigger(eventName, this.model.get('selectAction'));
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
    var billingAddressesCompositeView = Marionette.CompositeView.extend({
      template: '#BillingAddressesTemplate',
      templateHelpers: viewHelpers,
      itemView: checkoutAddressSelectorLayout,
      emptyView: billingAddressesEmptyView,
      // Make the type of address available to the itemView
      itemViewOptions: {
        addressType: 'billing'
      },
      itemViewContainer: '[data-region="billingAddressSelectorsRegion"]',
      events: {
        'click [data-el-label="checkout.newBillingAddressBtn"]': function(event) {
          event.preventDefault();
          EventBus.trigger('checkout.addNewAddressBtnClicked');
        }
      }
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
    var shippingAddressesCompositeView = Marionette.CompositeView.extend({
      template: '#ShippingAddressesTemplate',
      templateHelpers: viewHelpers,
      itemView: checkoutAddressSelectorLayout,
      emptyView: shippingAddressesEmptyView,
      // Make the type of address available to the itemView
      itemViewOptions: {
        addressType: 'shipping'
      },
      itemViewContainer: '[data-region="shippingAddressSelectorsRegion"]',
      events: {
        'click [data-el-label="checkout.newShippingAddressBtn"]': function(event) {
          event.preventDefault();
          EventBus.trigger('checkout.addNewAddressBtnClicked');
        }
      }
    });

    /**
     * A layout for rendering shipping option radio buttons and their labels.
     * @type Marionette.ItemView
     */
    var shippingOptionsSelectorView = Marionette.ItemView.extend({
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
    var shippingOptionsCompositeView = Marionette.CompositeView.extend({
      template: '#ShippingOptionsTemplate',
      templateHelpers: viewHelpers,
      itemView: shippingOptionsSelectorView,
      emptyView: shippingOptionsEmptyView,
      itemViewContainer: '[data-region="shippingOptionSelectorsRegion"]'
    });


    /**
     * A layout for rendering payment method radio buttons and their labels.
     * @type Marionette.Layout
     */
    var paymentMethodSelectorView = Marionette.Layout.extend({
      template: '#PaymentMethodSelectorTemplate',
      templateHelpers: viewHelpers,
      regions: {
        checkoutPaymentRegion: '[data-region="checkoutPaymentMethodRegion"]'
      },
      events: {
        'change input[type="radio"]': function () {
          EventBus.trigger('checkout.paymentMethodRadioChanged', this.model.get('selectAction'));
        }
      },
      onShow: function () {
        // Fire event to load the address itemView from component
        Mediator.fire('mediator.loadPaymentMethodViewRequest', {
          region: this.checkoutPaymentRegion,
          model: this.model
        });
      }
    });

    /**
     * Rendered by PaymentMethodCompositeView when there are no payment method to be displayed.
     * @type Marionette.ItemView
     */
    var paymentMethodEmptyView = Marionette.ItemView.extend({
      template: '#EmptyPaymentMethodsTemplate',
      templateHelpers: viewHelpers
    });

    /**
     * Renders a heading and a list of payment methods.
     * @type Marionette.CompositeView
     */
    var paymentMethodsCompositeView = Marionette.CompositeView.extend({
      template: '#PaymentMethodsTemplate',
      templateHelpers: viewHelpers,
      itemView: paymentMethodSelectorView,
      emptyView: paymentMethodEmptyView,
      itemViewContainer: '[data-region="paymentMethodSelectorsRegion"]',
      ui: {
        // A jQuery selector for the DOM element to which an activity indicator should be applied.
        activityIndicatorEl: '[data-region="paymentMethodSelectorsRegion"]'
      }
    });


    /**
     * Renders the shipping total (used in the checkout summary view)
     * @type Marionette.ItemView
     */
    var checkoutShippingTotalView = Marionette.ItemView.extend({
      template: '#CheckoutShippingTotalTemplate',
      className: 'checkout-shipping-total',
      templateHelpers: viewHelpers
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
     * Renders the tax total (used in the checkout summary view)
     * @type Marionette.ItemView
     */
    var checkoutTaxTotalView = Marionette.ItemView.extend({
      template: "#CheckoutTaxTotalTemplate",
      className: 'checkout-tax-total',
      templateHelpers: viewHelpers
    });

    /**
     * Renders a collection of taxes.
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
      templateHelpers: viewHelpers,
      regions: {
        checkoutShippingTotalRegion: '[data-region="checkoutShippingTotalRegion"]',
        checkoutTaxTotalRegion: '[data-region="checkoutTaxTotalRegion"]',
        checkoutTaxBreakDownRegion: '[data-region="checkoutTaxBreakDownRegion"]'
      },
      ui: {
        // A jQuery selector for the DOM element to which an activity indicator should be applied.
        activityIndicatorEl: '.checkout-sidebar-inner'
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
      PaymentMethodsCompositeView: paymentMethodsCompositeView,
      CheckoutSummaryView: checkoutSummaryView,
      CheckoutShippingTotalView: checkoutShippingTotalView,
      CheckoutTaxTotalView: checkoutTaxTotalView,
      CheckoutTaxesCollectionView: checkoutTaxesCollectionView,
      setCheckoutButtonProcessing: setCheckoutButtonProcessing,
      resetCheckoutButtonText: resetCheckoutButtonText,
      testVariables: {
        viewHelpers: viewHelpers,
        PaymentMethodSelectorView: paymentMethodSelectorView
      }
    };
  }
);