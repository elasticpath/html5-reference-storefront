/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 */
define(['eventbus', 'backbone'],
  function(EventBus, Backbone){

    var tmplModel = Backbone.Model.extend({
      // url to READ data from cortex, can include zoom, take example below
      // ep.app.config.cortexApi.path   prefix contex path to request to Cortex (e.g. integrator, cortex), configured in ep.config.json,
      // ep.app.config.cortexApi.scope  store scope (e.g. mobee, telcooperative), configured in ep.config.json,
      url: ep.app.config.cortexApi.path + '/profiles/' + ep.app.config.cortexApi.scope + '/default?zoom=purchases:element',

      parse: function (response) {
        // parsing the raw JSON data from cortex server using jsonPath
      }
    });


    return {
      TmplModel: tmplModel
    };
  }
);
