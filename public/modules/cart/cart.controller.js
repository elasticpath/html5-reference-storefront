/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 * 
 */
define(['ep', 'app', 'eventbus', 'cortex', 'modules/cart/cart.models', 'modules/cart/cart.views', 'text!modules/cart/cart.templates.html'],
  function(ep, App, EventBus, Cortex, Model, View, template){

    $('#TemplateContainer').append(template);

    _.templateSettings.variable = 'E';


    var defaultLayout = function(){
      var cartLayout =  new View.DefaultLayout();
      var cartModel = new Model.CartModel();

      cartModel.fetch({
        success:function(response){

          var summaryView = new View.CartSummaryView({
            model: cartModel
          });

          // collection (attributes.lineitems) coming from parse method of cartModel
          var mainCartView = new View.MainCartView({
            collection: new Model.CartItemCollection(response.attributes.lineItems)
          });

          cartLayout.cartTitleRegion.show(new View.CartTitleView());
          cartLayout.cartSummaryRegion.show(summaryView);
          cartLayout.cartCheckoutActionRegion.show(new View.CartCheckoutActionView());

          if (response.attributes.lineItems.length > 0) {
            cartLayout.mainCartRegion.show(mainCartView);
          } else {
            cartLayout.mainCartRegion.show(new View.EmptyCartView());
          }
        },
        error:function(response){
          ep.logger.error('error fetching my cart model: ' + response);
        }
      });
      return cartLayout;
    };

    /*
     *
     *
     * EVENT LISTENERS
     *
     */
    EventBus.on('cart.ReloadCartViewRequest', function() {
      ep.logger.info('Refreshing view...');
      EventBus.trigger('layout.loadRegionContentRequest',{
        region:'appMainRegion',
        module:'cart',
        view:'DefaultView'
      });
    });

    EventBus.on('cart.CartLineItemRemoved', function(){
      // EventBus.trigger('cart.DisplayCartLineItemRemovedSuccessMsg');
      EventBus.trigger('cart.ReloadCartViewRequest');
    });

    EventBus.on('cart.CartLineItemRemoveFailed', function(response) {
      ep.logger.error('error deleting lineitem from cart: ' + response);
    });

    EventBus.on('cart.removeLineItemRequest', function(event){
      var deleteActionLink = $(event.target).data('actionlink');


        ep.io.ajax({
          type:'DELETE',
          contentType:'application/json',
          url:deleteActionLink,
          success:function(response, x, y){
            EventBus.trigger('cart.CartLineItemRemoved');
          },
          error:function(response){
            EventBus.trigger('cart.CartLineItemRemoveFailed', response);
          }
        });

    });

    EventBus.on('cart.removeLineItemBtnClicked', function(event){
      var confirmation = window.confirm("Do you really want to delete this item");
      if (confirmation) {
        EventBus.trigger('cart.removeLineItemRequest', event);
      }
    });

    return {
      DefaultView:defaultLayout
    };
  }
);
