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
      var cartUrl = ep.app.config.cortexApi.path + '/carts/' + ep.app.config.store + '/default/?zoom=total,lineitems:element,lineitems:element:price,lineitems:element:availability,lineitems:element:item:definition,lineitems:element:item:definition:assets:element,lineitems:element:item:price';

      cartModel.fetch({
        url: cartUrl,
        success:function(response){

          var lineItemList = new Model.CartItemCollection(response.attributes.lineItem);

          var summaryView = new View.CartSummaryView({
            model: cartModel
          });

          var mainCartView = new View.MainCartView({
            collection: lineItemList
          });

          cartLayout.cartTitleRegion.show(new View.CartTitleView());
          cartLayout.mainCartRegion.show(mainCartView);
          cartLayout.cartSummaryRegion.show(summaryView);
          cartLayout.cartCheckoutActionRegion.show(new View.CartCheckoutActionView());

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
    EventBus.on('cart.ReloadCartView', function() {
      ep.logger.info('Refreshing view...');
      document.location.reload();
    });

    EventBus.on('cart.CartLineItemRemoved', function(){
      // EventBus.trigger('cart.DisplayCartLineItemRemovedSuccessMsg');
      EventBus.trigger('cart.ReloadCartView');
    });

    EventBus.on('cart.CartLineItemRemoveFailed', function(response) {
      ep.logger.error('error deleting lineitem from cart: ' + response);
    });

    EventBus.on('cart.removeLineItemBtnClicked', function(event){
      var oAuthToken = window.localStorage.getItem('oAuthToken');
      var deleteActionLink = $(event.target).data('actionlink');

      if (oAuthToken && deleteActionLink) {
        ep.io.ajax({
          type:'DELETE',
          beforeSend:function(request)
          {
            request.setRequestHeader("Authorization", oAuthToken);
          },
          contentType:'application/json',
          url:deleteActionLink,
          success:function(response, x, y){
            ep.logger.info('Success deleting lineitem - refreshing cart view');
            ep.logger.info('RESPONSE ' + x);
            EventBus.trigger('cart.CartLineItemRemoved');
          },
          error:function(response){
            EventBus.trigger('cart.CartLineItemRemoveFailed', response);
          }
        });
      }
    });

    return {
      DefaultView:defaultLayout
    };
  }
);
