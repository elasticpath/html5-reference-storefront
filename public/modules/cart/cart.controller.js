/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 * 
 */
define(['app', 'eventbus', 'cortex', 'modules/cart/cart.models', 'modules/cart/cart.views', 'text!modules/cart/cart.templates.html'],
  function(App, EventBus, Cortex, Model, View, template){

    $('#TemplateContainer').append(template);

    _.templateSettings.variable = 'E';


    var defaultLayout = function(){
      return new View.DefaultLayout();
    };


    return {
      DefaultView:defaultLayout
    };
  }
);
