/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 * 
 */
define(['app', 'eventbus', 'cortex', 'modules/auth/auth.models', 'modules/auth/auth.views', 'text!modules/auth/auth.templates.html'],
  function(App, EventBus, Cortex, Model, View, template){

    $('#TemplateContainer').append(template);

    _.templateSettings.variable = 'E';

    var init = function(){



    };


    var defaultLayout = function() {

    };

    return {
      init:init,
      AuthModel:Model.AuthModel,
      DefaultViews:View.DefaultLayout,
      DefaultLayout:defaultLayout

    };
  }
);
