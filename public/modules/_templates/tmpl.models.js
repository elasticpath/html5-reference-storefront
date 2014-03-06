/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
define(function (require) {
    var ep = require('ep');
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
