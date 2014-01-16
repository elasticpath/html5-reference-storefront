/**
 * Copyright Elastic Path Software 2014.
 *
 * Example controller template to create a new Storefront module .
 */
define(function (require) {
    var ep = require('ep');                 // import global app functions and variables
    var EventBus = require('eventbus');     // import event-bus communicating within module
    var Mediator = require('mediator');     // import global event-bus mediating communication between modules

    var pace = require('pace');             // import activity indicator function

    // import the module's model, view and template
    var Model = require('modules/_template/tmpl.models');
    var View = require('modules/_template/tmpl.views');
    var template = require('text!modules/base/_template/base.tmpl.templates.html');

    // Inject the template into TemplateContainer for the module's views to reference
    $('#TemplateContainer').append(template);

    // Create a namespace for the template to reference the model and viewHelpers
    _.templateSettings.variable = 'E';

    /**
     * Renders the DefaultLayout of template module, and fetch model from backend;
     * upon model fetch success, renders the views in the designated regions.
     */
    var defaultView = function(){

        //instantiate the modules View and Model
        var defaultLayout = new View.DefaultLayout();
        var templateModel = new Model.TmplModel();


        templateModel.fetch({
            success: function (response) {

            },
            error: function (response) {

            }
        });


    };



    return {
      DefaultView:defaultView
    };
  }
);
