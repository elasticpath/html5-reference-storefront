/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 * Storefront - Cart Controller
 */

define(function (require) {
    var ep = require('ep');
    var EventBus = require('eventbus');
    var Mediator = require('mediator');
    var pace = require('pace');
    var i18n = require('i18n');

    var Model = require('cart.models');
    var View = require('cart.views');
    var template = require('text!modules/base/cart/base.cart.templates.html');

    pace.start();

    $('#TemplateContainer').append(template);

    _.templateSettings.variable = 'E';

    // Instantiate a cart DefaultLayout view
    var cartLayout = new View.DefaultLayout();

    /**
     * Instantiate the cart model and item collection here so they can be modified
     * by the EventBus event handlers when the items in the cart are changed.
     */
    var cartModel = new Model.CartModel();
    var cartItemCollection = new Model.CartItemCollection();

    /**
     * Loads views into corresponding regions of the DefaultLayout view.
     * @returns {View.DefaultLayout} fully rendered cart DefaultLayout
     */
    var defaultView = function () {
      pace.start();

      cartModel.fetch({
        success: function (response) {
          // Populate the cart item collection with the line items parsed in the cart model
          cartItemCollection = new Model.CartItemCollection(response.get('lineItems'));

          var mainCartView = new View.MainCartView({
            collection: cartItemCollection
          });

          cartLayout.cartTitleRegion.show(new View.CartTitleView());
          var cartCheckoutMasterLayout = new View.CartCheckoutMasterLayout();
          cartCheckoutMasterLayout.on('show', function () {
            cartCheckoutMasterLayout.cartSummaryRegion.show(
              new View.CartSummaryView({
                model: cartModel
              })
            );
            cartCheckoutMasterLayout.cartCheckoutActionRegion.show(
              new View.CartCheckoutActionView({
                model: cartModel
              })
            );
          });

          cartLayout.cartCheckoutMasterRegion.show(cartCheckoutMasterLayout);

          if (response.attributes.lineItems.length > 0) {
            cartLayout.mainCartRegion.show(mainCartView);

          } else {
            cartLayout.mainCartRegion.show(new View.EmptyCartView());
          }
        },
        error: function (response) {
          ep.logger.error('error fetching my cart model: ' + response);
        }
      });
      return cartLayout;
    };


    /* ************** EVENT LISTENER FUNCTIONS ***************** */
    // FIXME [CU-184] global notification center
    /**
     * A sticky (will not disappear on itself) toast error message
     * @param errMsg Error message to display on toast message
     */
    function stickyErrMsg(errMsg) {
      $().toastmessage('showToast', {
        text: errMsg,
        sticky: true,
        position: 'middle-center',
        type: 'error'
      });
    }

    /**
     * Wrap error message function to pass as callback function.
     */
    function itemDeletedErrMsg() {
      stickyErrMsg(i18n.t('cart.deletedLineItemUpdateErrMsg'));
    }

    /**
     * Make request to server to update cart-lineItem quantity.
     * @param actionLink  link to post request to.
     * @param qty         new qty to update with.
     */
    function updateLineItemQty(actionLink, qty) {
      if (reportMissingArgs(arguments, ['actionLink', 'quantity'])) {
        return;
      }

      var ajaxModel = new ep.io.defaultAjaxModel({
        type: 'PUT',
        url: actionLink,
        data: "{quantity:" + qty.changeTo + "}",
        success: function () {
          EventBus.trigger('cart.updateLineItemQtySuccess');
        },
        customErrorFn: function (response) {
          if (response.status === 404) {  // lineItem to update doesn't exist
            EventBus.trigger('cart.updateLineItemQtyFailed.ItemDeleted');
          }
          else {
            EventBus.trigger('cart.updateLineItemQtyFailed', qty.original);
          }
        }
      });

      ep.io.ajax(ajaxModel.toJSON());
    }

    // FIXME make this a global helper function
    /**
     * log missing arguments in console, and set flag to terminate function if missing arguments.
     * @param args  arguments to check.
     * @param argNames  corresponding names of the arguments.
     * @returns {boolean} if function should be terminated.
     */
    function reportMissingArgs(args, argNames) {
      var terminateFn = false;
      var missing = [];

      for (var i = 0; i < args.length; i++) {
        if (!args[i]) {
          missing.push(argNames[i]);
        }
      }

      if (missing.length > 0) {
        ep.logger.error('request missing ' + missing.join());
        terminateFn = true;
      }

      return terminateFn;
    }

    /**
     * Modify this if you are extending the cart controller
     * @type {{region: string, module: string, view: string}}
     */
    var cartView = {
      region: 'appMainRegion',
      module: 'cart',
      view: 'DefaultView'
    };


    /* ********** Update LineItem Quantity EVENT LISTENERS ************ */
    /**
     * Listening to cart-lineItem quantity changed event,
     * will trigger update quantity request.
     */
    EventBus.on('cart.lineItemQuantityChanged', function (actionLink, Qty) {
      EventBus.trigger('cart.updateLineItemQtyRequest', actionLink, Qty);
    });

    /**
     * Listening to request to update cart-lineItem quantity,
     * will make ajax call to update quantity to server.
     */
    EventBus.on('cart.updateLineItemQtyRequest', updateLineItemQty);

    /**
     * Listening to update lineItem quantity success signal,
     * will make request to refresh cart view.
     */
    EventBus.on('cart.updateLineItemQtySuccess', function () {
      EventBus.trigger('cart.reloadCartViewRequest');
    });

    /**
     * Listening to update lineItem quantity failed signal(reason: lineItem deleted),
     * will make request to load cart view, and display error message after page refresh.
     */
      // FIXME [CU-184] decouple specific callback from event (set a flag which is processed regardless how/when the page is reloaded)
    EventBus.on('cart.updateLineItemQtyFailed.ItemDeleted', function () {
      var cartViewWithCallBack = _.extend({callback: itemDeletedErrMsg}, cartView);

      EventBus.trigger('layout.loadRegionContentRequest', cartViewWithCallBack);
    });

    /**
     * Listening to update lineItem quantity failed signal(technical reasons do not want to surface for user),
     * will reset the quantity to original, & display error message
     */
    EventBus.on('cart.updateLineItemQtyFailed', function (originalQty) {
      // FIXME more efficient way of accessing the original quantity from model, currently this value travel a long winded way from model -> controller (DefaultView) -> view -> Events
      if (reportMissingArgs(arguments, ['original quantity'])) {
        return;
      }
      View.resetQuantity(originalQty); // reset quantity
      stickyErrMsg(i18n.t('cart.genericUpdateErrMsg'));
    });

    /* ********** Remove line item EVENT LISTENERS ********** */
    // On successful removal of line item, trigger a fetch of the cart model and update the cart item collection.
    // The checkout summary view will be updated separately by model change listeners on the view.
    EventBus.on('cart.removeLineItemSuccess', function () {
      cartModel.fetch({

        success: function(response) {
          // Update the collection of cart item products with the new array of line items from the cart model
          var newCartLineItems = response.get('lineItems');

          cartItemCollection.update(newCartLineItems);

          if (newCartLineItems.length === 0 && cartLayout.mainCartRegion) {
            cartLayout.mainCartRegion.show(new View.EmptyCartView());
          }

          // Stop the activity indicators on the cart regions that are being updated
          ep.ui.stopActivityIndicator(cartLayout.mainCartRegion.currentView);
          ep.ui.stopActivityIndicator(cartLayout.cartCheckoutMasterRegion.currentView);
        }
      });
    });

    // Logs an error when the request to remove a line item fails and stops the relevant activity indicators.
    EventBus.on('cart.removeLineItemFailed', function (response) {
      ep.ui.stopActivityIndicator(cartLayout.mainCartRegion.currentView);
      ep.ui.stopActivityIndicator(cartLayout.cartCheckoutMasterRegion.currentView);
      // should use the toastMsg to inform user
      ep.logger.error('error deleting lineItem from cart: ' + response);
    });

    // Remove Line Item Request
    // FIXME [CU-195] move logic to a method
    EventBus.on('cart.removeLineItemRequest', function (deleteActionLink) {
      var ajaxModel = new ep.io.defaultAjaxModel({
        type: 'DELETE',
        url: deleteActionLink,
        success: function () {
          EventBus.trigger('cart.removeLineItemSuccess');
        },
        customErrorFn: function (response) {
          EventBus.trigger('cart.removeLineItemFailed', response);
        }
      });

      ep.io.ajax(ajaxModel.toJSON());
    });

    /**
     * Called when the yes button in the confirm modal is clicked. This handler closes any open modal windows,
     * starts the activity indicator for the regions to be updated and triggers the remove item request to Cortex.
     */
    EventBus.on('cart.removeLineItemConfirmYesBtnClicked', function(actionLink) {
      $.modal.close();
      ep.ui.startActivityIndicator(cartLayout.mainCartRegion.currentView);
      ep.ui.startActivityIndicator(cartLayout.cartCheckoutMasterRegion.currentView);
      EventBus.trigger('cart.removeLineItemRequest', actionLink);
    });

    /**
     * Prompts the user to confirm deletion with a JavaScript confirmation alert and then
     * starts activity indicators on those cart regions that contain data which could
     * change following a successful cart item deletion.
     */
    EventBus.on('cart.removeLineItemConfirm', function (actionLink) {
      EventBus.trigger('layout.loadRegionContentRequest', {
        region: 'appModalRegion',
        module: 'cart',
        view: 'CartRemoveLineItemConfirmView',
        data: {
          href: actionLink
        }
      });
    });

    /**
     * Handler for the remove line item button clicked signal, which triggers a request for confirmation from the user.
     */
    EventBus.on('cart.removeLineItemBtnClicked', function(actionLink) {
      EventBus.trigger('cart.removeLineItemConfirm', actionLink);
    });

    /**
     * Listening to requests to reload cartView,
     * will reload the entire cartView.
     */
    EventBus.on('cart.reloadCartViewRequest', function () {
      // FIXME: [CU-93] finer refresh to reload just the necessary parts
      ep.router.controller.cart();
    });

    // Proceed to checkout button checks if the user is logged in and loads the checkout summary
    EventBus.on('cart.checkoutBtnClicked', function(checkoutLink) {
      // User not logged in and config set to require login
      if (ep.app.config.requireAuthToCheckout && (!ep.app.isUserLoggedIn())) {
        // Fire event to get authenticated (e.g. load the login form in a modal)
        Mediator.fire('mediator.getAuthentication');
      } else {
        Mediator.fire('mediator.navigateToCheckoutRequest', checkoutLink);
      }
    });

    return {
      DefaultView: defaultView,
      CartRemoveLineItemConfirmView: function(options) {
        return new View.CartRemoveLineItemConfirmView(options);
      }
    };
  }
);