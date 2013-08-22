/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 * 
 */
define(['app', 'eventbus', 'cortex', 'modules/auth/tmpl.models', 'modules/auth/tmpl.views', 'text!modules/auth/tmpl.templates.html'],
  function(App, EventBus, Cortex, Model, View, template){

    $('#TemplateContainer').append(template);

    _.templateSettings.variable = 'E';

    var init = function(){



    };



    return {
      init:init

    };
  }
);
