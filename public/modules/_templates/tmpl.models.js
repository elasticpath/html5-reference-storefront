/**
 * Copyright Elastic Path Software 2014.
 *
 */
define(function (require) {
    var Backbone = require('backbone');
    var ModelHelper = require('modelHelpers');

    // Array of zoom parameters to pass to Cortex
    var zoomArray = [
      'addresses:element',
      'paymentmethods:element'
    ];

    var tmplModel = Backbone.Model.extend({
      // url to READ data from cortex, can include zoom, take example below
      // ep.app.config.cortexApi.path   prefix contex path to request to Cortex (e.g. integrator, cortex), configured in ep.config.json,
      // ep.app.config.cortexApi.scope  store scope (e.g. mobee, telcooperative), configured in ep.config.json,
      url: ep.io.getApiContext() + '/CORTEX_RESOURCE_NAME/' + ep.app.config.cortexApi.scope + '/default?zoom=' + zoomArray.join(),

      parse: function (response) {
        // parsing the raw JSON data from cortex server using jsonPath
      }
    });

    /**
     * Collection of helper functions to parse the model.
     * @type Object collection of modelHelper functions
     */
    var modelHelpers = ModelHelper.extend({});


    return {
      TmplModel: tmplModel
    };
  }
);
