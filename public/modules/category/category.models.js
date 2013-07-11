/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 05/04/13
 * Time: 1:32 PM
 *
 */
define(['eventbus','backbone'],
  function(EventBus,Backbone){

    var categoryTreeModelData = {};

    var RelModel = Backbone.Model.extend({});
    var ChildItemLayoutModel = Backbone.Model.extend({});
    var LinkModel = Backbone.Model.extend({});
    var LinkCollection = Backbone.Collection.extend({
      model:LinkModel
    });

    var CategoryModel = Backbone.Model.extend({});



    return{
      CategoryModel:CategoryModel,
      LinkCollection:LinkCollection,
      RelModel:RelModel,
      ChildItemLayoutModel:ChildItemLayoutModel
    };
  }
);
