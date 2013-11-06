/**
 * EventBus Test Helpers
 */

define(function (require) {
  // required variables
  var EventBus = require('eventbus');

  var unboundEvents = {};

  /**
   * Unbind a varied number of events from EventBus.
   * @param name of events to be unbound from EventBus
   */
  function unbind() {
    for (var i = 0; i < arguments.length; i++) {
      unboundEvents[arguments[i]] = EventBus._events[arguments[i]];
      EventBus.unbind(arguments[i]);
    }
  }

  /**
   * rebind all previously unbound events from EventBus.
   */
  function reset() {
    for (var eventName in unboundEvents) {
      EventBus._events[eventName] = unboundEvents[eventName];
    }
  }

  return{
    unbind: unbind,
    reset: reset
  };
});