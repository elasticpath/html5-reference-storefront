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
          var cartCheckoutMasterView = new View.CartCheckoutMasterView();
          cartCheckoutMasterView.on('show', function () {
            cartCheckoutMasterView.cartSummaryRegion.show(summaryView);
            cartCheckoutMasterView.cartCheckoutActionRegion.show(new View.CartCheckoutActionView({
              model: cartModel
            }));
          });
          cartLayout.cartCheckoutMasterRegion.show(cartCheckoutMasterView);


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
    function updateLineItemQty (actionLink, qty) {
      if (actionLink && qty) {
        ep.io.ajax({
          type: 'PUT',
          contentType: 'application/json',
          url: actionLink,
          data: "{quantity:" + qty + "}",
          success: function (data, textStatus, XHR) {
            EventBus.trigger('cart.updateLineItemQtySuccess');
          },
          error: function (response) {
            if (response.status === 404) {  // lineItem to update doesn't exist
              EventBus.trigger('cart.updateLineItemQtyFailed.ItemDeleted');
            }
            else {
              EventBus.trigger('cart.updateLineItemQtyFailed.OtherErr');
            }
            EventBus.trigger('cart.updateLineItemQtyFailed', response.status, response.responseText);
          }
        });
      }
      else {
        var missingQty = !qty ? 'quantity' : '';
        var missingActionLink = !actionLink ? ' actionLink' : '';
        ep.logger.error('update lineItem quantity request missing ' + missingQty + missingActionLink);
      }
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
    EventBus.on('cart.updateLineItemQtyFailed.ItemDeleted', function () {
      var cartViewWithCallBack = _.extend({callback: itemDeletedErrMsg}, cartView);

      EventBus.trigger('layout.loadRegionContentRequest', cartViewWithCallBack);
    });

    /**
     * Listening to update lineItem quantity failed signal(technical reasons do not want to surface for user),
     * will reset the quantity to original, & display error message
     */
    EventBus.on('cart.updateLineItemQtyFailed.OtherErr', function() {
      View.resetQuantity(); // reset quantity
      stickyErrMsg(i18n.t('cart.genericUpdateErrMsg'));
    });

    /**
     * Listening to update lineItem quantity failed signal(for any reasons)
     * will log error in console
     */
    EventBus.on('cart.updateLineItemQtyFailed', function (errCode, errMsg) {
      // log error in console
      ep.logger.error('response code ' + errCode + ': ' + errMsg);
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
    EventBus.on('cart.removeLineItemRequest', function (deleteActionLink) {
      // FIXME move logic to a method
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

    // Checkout Button Clicked
    EventBus.on('cart.checkoutBtnClicked', function (submitOrderActionUri) {

      View.setCheckoutButtonProcessing();
      EventBus.trigger('cart.checkoutRequest', submitOrderActionUri);
    });

    // Checkout Request
    EventBus.on('cart.checkoutRequest', function (submitOrderActionUri) {
      // if cortex says it's ok
      if (submitOrderActionUri) {

        // submit request to uri
        EventBus.trigger('cart.submitOrderRequest', submitOrderActionUri);
      }
      // or
      // user not logged and config set to require login
      else if (ep.app.config.requireAuthToCheckout && (!ep.app.isUserLoggedIn())) {
        // trigger login
        // Mediator.fire('mediator.showLoginModalRequest');
        EventBus.trigger('layout.loadRegionContentRequest', {
          region: 'appModalRegion',
          module: 'auth',
          view: 'LoginFormView'
        });
        EventBus.on('ui.modalWindowClosed', function () {
          View.resetCheckoutButtonText();
        });
      }
    });

    // Submit Order Request
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
      DefaultView: defaultView
    };
  }
);
