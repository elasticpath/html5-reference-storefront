/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
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
