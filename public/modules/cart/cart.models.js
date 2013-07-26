/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 */
define(['eventbus', 'backbone'],
  function(EventBus, Backbone){


    var cartModel = Backbone.Model.extend();
    var cartItemModel = Backbone.Model.extend();
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
