/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 *
 */
define(['ep', 'app', 'eventbus', 'mediator', 'cortex', 'modules/cart/cart.models', 'modules/cart/cart.views', 'text!modules/cart/cart.templates.html','pace'],
  function (ep, App, EventBus, Mediator, Cortex, Model, View, template,pace) {
    pace.start();
    $('#TemplateContainer').append(template);

    _.templateSettings.variable = 'E';


    var defaultView = function () {
      pace.start();
      var cartLayout = new View.DefaultView();
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
          cartCheckoutMasterView.on('show',function(){
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

    // Purchase Confirmation View
    var purchaseConfirmationView = function(uri){


      if (ep.app.isUserLoggedIn()) {
        var purchaseConfirmationModel = new Model.PurchaseConfirmationModel();
        var purchaseConfirmationLayout = new View.PurchaseConfirmationLayout();
        var confirmationRegion = new Marionette.Region({
          el:'[data-region="purchaseConfirmationRegion"]'
        });
        var purchaseConfirmationView = new View.PurchaseConfirmationView({
          model:purchaseConfirmationModel
        });
        purchaseConfirmationModel.fetch({
          url:ep.ui.decodeUri(uri),
          success:function(response){

            confirmationRegion.show(purchaseConfirmationView);

          },
          error:function(response){
            ep.logger.error('Error retrieving purchase confirmation response');
          }
        });
        return purchaseConfirmationLayout;
      }
      else{
        // trigger login
        EventBus.trigger('layout.loadRegionContentRequest', {
          region: 'appModalRegion',
          module: 'auth',
          view: 'LoginFormView'
        });

      }



    };

    /*
     *
     *
     * EVENT LISTENERS
     *
     */
    // Reload Cart View Request
    EventBus.on('cart.reloadCartViewRequest', function () {
      ep.logger.info('Refreshing view...');
      EventBus.trigger('layout.loadRegionContentRequest', {
        region: 'appMainRegion',
        module: 'cart',
        view: 'DefaultView'
      });
    });

    // Remove Line Item Success
    EventBus.on('cart.removeLineItemSuccess', function () {
      // EventBus.trigger('cart.DisplayCartLineItemRemovedSuccessMsg');
      EventBus.trigger('cart.reloadCartViewRequest');
    });

    // Remove Line Item Failed
    EventBus.on('cart.removeLineItemFailed', function (response) {
      ep.logger.error('error deleting lineitem from cart: ' + response);
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
    EventBus.on('cart.checkoutBtnClicked', function (model) {

      View.setCheckoutButtonProcessing();
      EventBus.trigger('cart.checkoutRequest', model);
    });

    // Checkout Request
    EventBus.on('cart.checkoutRequest', function (model) {
      // if cortex says it's ok
      if (model.get('submitOrderActionUri')) {

        // submit request to uri
        EventBus.trigger('cart.submitOrderRequest', model.get('submitOrderActionUri'));
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
        EventBus.on('ui.modalWindowClosed',function(){
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
          contentType:'application/json',
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
      if (orderSummaryUri){
        Mediator.fire('mediator.orderProcessSuccess',orderSummaryUri);
        pace.stop();
      }
      var t = orderSummaryUri;
      ep.logger.info('ORDER SUMMARY URL - ' + t);
    });

    return {
      DefaultView: defaultView,
      PurchaseConfirmationView:purchaseConfirmationView
    };
  }
);
