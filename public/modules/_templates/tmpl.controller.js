/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 * 
 */
define(['app', 'eventbus', 'modules/_template/tmpl.models', 'modules/_template/tmpl.views', 'text!modules/_template/tmpl.templates.html'],
  function(App, EventBus, Model, View, template){

    $('#TemplateContainer').append(template);

    _.templateSettings.variable = 'E';

    var init = function(){



    };



    return {
      init:init

    };
  }
);
