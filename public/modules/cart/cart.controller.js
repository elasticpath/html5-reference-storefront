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
      var cartUrl = ep.app.config.cortexApi.path + '/carts/' + ep.app.config.store + '/default/?zoom=total,lineitems:element,lineitems:element:price,lineitems:element:availability,lineitems:element:item:definition,lineitems:element:item:definition:assets:element';

      cartModel.fetch({
        url: cartUrl,
        success:function(response){
          cartLayout.cartTitleRegion.show(new View.CartTitleView());
          cartLayout.mainCartRegion.show(new View.MainCartView({
            collection:response
          }));
          cartLayout.cartSummaryRegion.show(new View.CartSummaryView());
          cartLayout.cartCheckoutActionRegion.show(new View.CartCheckoutActionView());

        },
        error:function(response){
          ep.logger.error('error fetching my cart model: ' + response);
        }
      });
      return cartLayout;
    };


    return {
      DefaultView:defaultLayout
    };
  }
);
