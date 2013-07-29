/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 * 
 */
define(['app', 'eventbus', 'cortex', 'modules/profile/tmpl.models', 'modules/profile/tmpl.views', 'text!modules/_template/tmpl.templates.html'],
  function(App, EventBus, Cortex, Model, View, template){

    $('#TemplateContainer').append(template);

    _.templateSettings.variable = 'E';

    var defaultView = function(){
      var defaultLayout = new View.DefaultLayout();

      return defaultLayout

    };



    return {
      DefaultView:defaultLayout

    };
  }
);
