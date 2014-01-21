/**
 * Controller Test Factories.
 */

define(function (require) {
  var ep = require('ep');

  return {
    /**
     * Creates a sinon.fakeServer for use with controller tests where a fetch from Cortex needs to be simulated.
     * @param zoom A string of zoom parameters to append to the link
     * @param response The fake data response that the server should return
     * @param link The URL to which the fake server should respond
     * @returns {sinon.fakeServer} A fake server object
     */
    getFakeServer: function (zoom, response, link) {
      var fakeGetLink = link || "/integrator/module/fakeUrl";
      var fakeServer = sinon.fakeServer.create();

      ep.io.localStore.setItem('oAuthToken', 'fakeToken');

      fakeServer.autoRespond = true;

      fakeServer.respondWith(
        "GET",
        fakeGetLink + zoom,
        [
          200,
          {"Content-Type": "application/json"},
          JSON.stringify(response)
        ]
      );

      return fakeServer;
    }
  };
});