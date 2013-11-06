/**
 * EventBus Test Factory.
 */

define(function (require) {
  var EventBus = require('eventbus'),
    EventTestHelpers = require('EventTestHelpers');

  return {
    /**
     * Create a simple test to test if another Event is triggered.
     *
     * @param eventToTrigger  event expected to be triggered.
     * @param testFn          test function (include assertions & test triggering action.
     * @returns {Function}    a simple EventBus unit test.
     */
    simpleTriggerEventTest: function (eventToTrigger, testFn) {
      return function () {
        var isSpied = false;

        before(function () {
          // make sure EventBus.trigger isn't spied already outside
          if (EventBus.trigger.toString() !== 'trigger') {
            sinon.spy(EventBus, 'trigger');
            isSpied = true;
          }

          // isolate unit by unbinding subsequent triggered events
          EventTestHelpers.unbind(eventToTrigger);
        });

        after(function () {
          EventTestHelpers.reset();

          if (isSpied) {
            EventBus.trigger.restore();
          }
        });

        testFn();
      };
    },

    /**
     * Create a simple test to test if tested event listener triggers another event.
     * @param eventToTrigger        event expected to be triggered in listener
     * @param testTriggerEventName  name of event triggering test function.
     * @returns {Function}          a simple EventBus listen and trigger unit test.
     */
    simpleEventChainTest: function (eventToTrigger, testTriggerEventName) {
      return this.simpleTriggerEventTest(eventToTrigger, function () {

        it("registers correct event listener", function () {
          expect(EventBus._events[testTriggerEventName]).to.have.length(1);
        });

        it('should trigger event: ' + eventToTrigger, function () {
          // trigger callback function on ajax call success
          EventBus.trigger(testTriggerEventName);

          expect(EventBus.trigger).to.be.calledWithExactly(eventToTrigger);
        });
      });
    }

    // test triggered with event name, and other options, triggering with exact parameter
  };
});