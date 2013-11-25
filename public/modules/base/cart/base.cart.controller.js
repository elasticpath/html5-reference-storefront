/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 *
 */

define(function (require) {
    var ep = require('ep'),
      EventBus = require('eventbus'),
      Mediator = require('mediator'),
      pace = require('pace'),
      i18n = require('i18n'),

      Model = require('cart.models'),
      View = require('cart.views'),
      template = require('text!modules/base/cart/base.cart.templates.html');


    pace.start();

    $('#TemplateContainer').append(template);

    _.templateSettings.variable = 'E';


    var defaultView = function () {
      pace.start();
      var cartLayout = new View.DefaultLayout();
      var cartModel = new Model.CartModel();

      cartModel.fetch({
        success: function (response) {

          var summaryView = new View.CartSummaryView({
            model: cartModel
          });

          // collection (attributes.lineitems) coming from parse method of cartModel
          var mainCartView = new View.MainCartView({
            collection: new Model.CartItemCollection(response.attributes.lineItems)
          });

          cartLayout.cartTitleRegion.show(new View.CartTitleView());
          var cartCheckoutMasterLayout = new View.CartCheckoutMasterLayout();
          cartCheckoutMasterLayout.on('show', function () {
            cartCheckoutMasterLayout.cartSummaryRegion.show(summaryView);
            cartCheckoutMasterLayout.cartCheckoutActionRegion.show(new View.CartCheckoutActionView({
              model: cartModel
            }));
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

    /*
     * Checkout View
     */
    var checkoutView = function() {
      pace.start();
      var checkoutLayout = new View.CartCheckoutLayout();
      var cartModel = new Model.CartModel();

      cartModel.fetch({
        success: function (response) {
          checkoutLayout.cartCheckoutTitleRegion.show(new View.CartCheckoutTitleView());

          checkoutLayout.chosenBillingAddressRegion.show(new View.CartBillingAddressLayout({
            model: new Backbone.Model(cartModel.get('billingAddresses').chosenBillingAddress)
          }));

          checkoutLayout.cartCancelActionRegion.show(new View.CartCancelActionView({
            model: cartModel
          }));

          var cartOrderSummaryLayout = new View.CartOrderSummaryLayout();
          cartOrderSummaryLayout.on('show', function () {
            cartOrderSummaryLayout.cartSummaryRegion.show(
              new View.CartSummaryView({
                model: cartModel
              })
            );
            cartOrderSummaryLayout.cartTaxTotalRegion.show(
              new View.CartTaxTotalView({
                model: cartModel
              })
            );
            cartOrderSummaryLayout.cartSubmitOrderRegion.show(
              new View.CartSubmitOrderActionView({
                model: cartModel
              })
            );
          });
          checkoutLayout.cartOrderSummaryRegion.show(cartOrderSummaryLayout);
        },
        error: function (response) {
          ep.logger.error('error fetching my cart model: ' + response);
        }
      });



      return checkoutLayout;
    };

    /* ************** EVENT LISTENER FUNCTIONS ***************** */
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
      // FIXME decouple specific callback from event (set a flag which is processed regardless how/when the page is reloaded)
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

    /* ********** EVENT LISTENERS ************ */
    /**
     * Listening to requests to reload cartView,
     * will reload the entire cartView.
     */
    EventBus.on('cart.reloadCartViewRequest', function () {
      // FIXME: finer refresh to reload just the necessary parts
      EventBus.trigger('layout.loadRegionContentRequest', cartView);
    });

    // Remove Line Item Success
    EventBus.on('cart.removeLineItemSuccess', function () {
      // EventBus.trigger('cart.DisplayCartLineItemRemovedSuccessMsg');
      EventBus.trigger('cart.reloadCartViewRequest');
    });

    // Remove Line Item Failed
    EventBus.on('cart.removeLineItemFailed', function (response) {
      // should use the toastMsg to inform user
      ep.logger.error('error deleting lineItem from cart: ' + response);
    });

    // Remove Line Item Request
    // FIXME use ep.io.ajaxModel
    // FIXME move logic to a method
    EventBus.on('cart.removeLineItemRequest', function (deleteActionLink) {
      ep.io.ajax({
        type: 'DELETE',
        contentType: 'application/json',
        url: deleteActionLink,
        success: function (data, textStatus, XHR) {
          EventBus.trigger('cart.removeLineItemSuccess');
        },
        error: function (response) {
          EventBus.trigger('cart.removeLineItemFailed', response);
        }
      });

    });

    // Remove Line Item Button Clicked
    EventBus.on('cart.removeLineItemBtnClicked', function (actionLink) {
      var confirmation = window.confirm("Do you really want to delete this item");
      if (confirmation) {
        EventBus.trigger('cart.removeLineItemRequest', actionLink);
      }
    });

    // Submit Order Button Clicked
    EventBus.on('cart.submitOrderBtnClicked', function (submitOrderActionUri) {
      View.setCheckoutButtonProcessing();
      // if cortex says it's ok
      if (submitOrderActionUri) {
        EventBus.trigger('cart.submitOrderRequest', submitOrderActionUri);
      }
    });

    // Proceed to checkout button checks if the user is logged in and loads the checkout summary
    EventBus.on('cart.checkoutBtnClicked', function() {
      // User not logged in and config set to require login
      if (ep.app.config.requireAuthToCheckout && (!ep.app.isUserLoggedIn())) {
        EventBus.trigger('layout.loadRegionContentRequest', {
          region: 'appModalRegion',
          module: 'auth',
          view: 'LoginFormView'
        });
      } else {
        // Route to the checkout view
        ep.router.navigate('checkout', true);
      }
    });

    // Cancel button will reload the default cart view
    EventBus.on('cart.cancelOrderBtnClicked', function() {
      // Route to the default cart view
      ep.router.navigate('mycart', true);
    });

    // Submit Order Request
    // FIXME use ep.io.ajaxModel
    EventBus.on('cart.submitOrderRequest', function (uri) {
      if (uri) {
        uri = ep.app.config.cortexApi.path + uri;
        ep.logger.info('SUBMIT ORDER REQUEST: ' + uri);
        ep.io.ajax({
          type: 'POST',
          contentType: 'application/json',
          url: uri,
          success: function (data, textStatus, XHR) {
            var obj = {
              data: data,
              textStatus: textStatus,
              XHR: XHR
            };
            EventBus.trigger('cart.submitOrderSuccess', obj);
          },
          error: function (response) {
            ep.logger.error('Error submitting order: ' + response);
            View.resetCheckoutButtonText();
          }
        });
      }
      else {
        ep.logger.warn('cart.submitOrderRequest called with no uri');
      }
    });
    EventBus.on('cart.submitOrderSuccess', function (obj) {

      var orderSummaryUri = obj.XHR.getResponseHeader('Location');
      if (orderSummaryUri) {
        Mediator.fire('mediator.orderProcessSuccess', orderSummaryUri);
        pace.stop();
      }
      var t = orderSummaryUri;
      ep.logger.info('ORDER SUMMARY URL - ' + t);
    });

    return {
      DefaultView: defaultView,
      CheckoutView: checkoutView
    };
  }
);
