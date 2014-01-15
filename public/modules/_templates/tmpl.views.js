/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 */
define(function (require) {
    var Marionette = require('marionette');
    var ViewHelpers = require('viewHelpers');


    /**
     * Template helper functions
     */
    var viewHelpers = ViewHelpers.extend({});

    var defaultLayout = Marionette.Layout.extend({
      template:'#[tmpl]MainTemplate',
      regions:{
        templateRegion:'[data-region="ATemplateExampleRegion"]'
      },
      className:'container',
      templateHelpers:viewHelpers
    });


    return {
      DefaultLayout: defaultLayout
    };
  }
);
