/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 * Controller Test Factories.
 */

define(function (require) {
  var ep = require('ep');

  return {
    /**
     * Creates a sinon.fakeServer for use with controller tests where a fetch from Cortex needs to be simulated.
     *
     * @param opts An options object - see the default options in the function for supported properties
     * @returns {sinon.fakeServer} A fake server object
     */
    getFakeServer: function(opts) {
      // Default options
      var options = {
        method: 'GET',
        // the fake data response that the server should return
        response: {},
        responseCode: 200,
        // the URL to which the fake server should respond
        requestUrl: "/fakeSubmitUrl",
        // a string of zoom parameters to append to the link
        zoom: ""
      };

      // Merge default options and external options
      if (opts) {
        options = _.extend({}, options, opts);
      }

      ep.io.localStore.setItem('oAuthToken', 'fakeToken');

      var fakeServer = sinon.fakeServer.create();
      fakeServer.autoRespond = true;

      fakeServer.respondWith(
        options.method,
        options.requestUrl + options.zoom,
        [
          options.responseCode,
          {"Content-Type": "application/json"},
          JSON.stringify(options.response)
        ]
      );

      return fakeServer;
    }
  };
});