/**
 * Model Test Factories.
 */

define(function (require) {
  var ep = require('ep');

  return {
    /**
     * Create a simple test that expect empty array when tested raw data is unavailable.
     *
     * @param jsonData          the raw json data
     * @param stubbingDataName  name of part of raw data to be stubbed out
     * @param model             model under testing
     * @param arrayName         name of array expected to be empty
     * @returns {Function}      a simple test expecting empty array when raw data is unavailable
     */
    simpleExpectEmptyArrayTestFactory: function (jsonData, stubbingDataName, model, arrayName) {
      return function() {
        var isSpying = false;

        before(function() {
          // make sure EventBus.trigger isn't spied already outside
          if (ep.logger.error.toString() !== 'error') {
            sinon.spy(ep.logger, 'error');
            isSpying = true;
          }

          var rawData = _.extend({}, jsonData);
          rawData[stubbingDataName] = [];
          this.model = model.parse(rawData);
        });

        after(function () {
          delete(this.model);

          if (isSpying) {
            ep.logger.error.restore();
          }
        });

        it('does not raise an error', function () {
          expect(ep.logger.error).to.be.not.called;
        });
        it('returns an empty ' + arrayName + ' array', function () {
          expect(this.model[arrayName]).to.have.length(0);
        });
      };
    }
  };
});