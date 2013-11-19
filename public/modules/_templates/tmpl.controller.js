/**
 * Copyright Elastic Path Software 2013.
 *
 * Example controller template to creating a new module on Storefront.
 */
define(function (require) {
    var ep = require('ep');                 // import global app functions and variables
    var EventBus = require('eventbus');     // import event-bus communicating within module
    var Mediator = require('mediator');     // import global event-bus mediating communication between modules

    var pace = require('pace');             // import activity indicator function

    // import model, view and template
    var Model = require('modules/_template/tmpl.models');
    var View = require('modules/_template/tmpl.views');
    var template = require('text!modules/base/_template/base.tmpl.templates.html');

    // Inject the address template into TemplateContainer for the views to reference
    $('#TemplateContainer').append(template);

    // Creates namespace to template to reference model and viewHelpers
    _.templateSettings.variable = 'E';

    /**
     * Renders the DefaultLayout of template module, and fetch model from backend;
     * upon model fetch success, renders the views in destinated regions.
     */
    var defaultView = function(){


    };



    return {
      DefaultView:defaultView
    };
  }
);
