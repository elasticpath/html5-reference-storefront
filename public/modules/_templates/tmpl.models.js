/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
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
      // url to READ data from cortex, includes the zoom
      // ep.app.config.cortexApi.path   prefix contex path to request to Cortex (e.g. integrator, cortex), configured in ep.config.json,
      // ep.app.config.cortexApi.scope  store scope (e.g. mobee, telcooperative), configured in ep.config.json,
      url: ep.io.getApiContext() + '/CORTEX_RESOURCE_NAME/' + ep.app.config.cortexApi.scope + '/default?zoom=' + zoomArray.join(),

      parse: function (response) {
        // parsing the raw JSON data from Cortex using JSONPath and set your model values
       var tmplObj = {
           data: undefined
       };
          if(response)
          {
              tmplObj.propertyName = jsonPath(response, 'CortexJSONFieldName')[0];
          }
          //log the error
          else {
              ep.logger.error("tmpl model wasn't able to fetch valid data for parsing.");
          }

          //return the object
          return tmplObj;
      }
    });

    /**
     * Collection of helper functions to parse the model.
     * @type Object collection of modelHelper functions
     */
    var modelHelpers = ModelHelper.extend({});

    //return the model
    return {
      TmplModel: tmplModel
    };
  }
);
