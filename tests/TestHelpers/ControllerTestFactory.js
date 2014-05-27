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

      ep.io.localStore.setItem(ep.app.config.cortexApi.scope + '_oAuthToken', 'fakeToken');

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