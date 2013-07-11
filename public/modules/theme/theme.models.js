/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 26/04/13
 * Time: 2:53 PM
 *
 */
define(['backbone','eventbus'],
  function(Backbone,EventBus){

    var config = {

    };
    var themeModel = Backbone.Model.extend();
    var themeCollection = Backbone.Collection.extend({
      model:themeModel
    });
    var themeVariableModel = Backbone.Model.extend();
    var themeVariableCollection = Backbone.Collection.extend({
      model:themeVariableModel
    })


    return{
      ThemeCollection:themeCollection,
      ThemeVariableCollection:themeVariableCollection
    };

  }
);
