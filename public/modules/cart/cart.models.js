/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 */
define(['ep','eventbus', 'backbone'],
  function(ep, EventBus, Backbone){


    var cartModel = Backbone.Model.extend({
      url:ep.app.config.cortexApi.path + '/carts/' + ep.app.config.store + '/default/?zoom=lineitems,total',
      parse:function(cart){
        ep.logger.info('CART ITEM PARSE:: ' + cart );
        return cart;
      }
    });

    var cartItemModel = Backbone.Model.extend({

    });
    var cartItemCollection = Backbone.Collection.extend({
      model:cartItemModel
    });



    return {
      CartModel:cartModel,
      CartItemCollection:cartItemCollection,
      CartItemModel:cartItemModel

    };
  }
);
