/**
 * EventBus Test Factory.
 */

define(function (require) {
  var EventBus = require('eventbus');
  var EventTestHelpers = require('testhelpers.event');

  return {
    /**
     * Create a simple test that test a button click will trigger an event.
     *
     * @param expectedEvent  event expected to be triggered.
     * @param btnSelector     jquery selector pattern to find the button to trigger test.
     * @returns {Function}    a simple test of button trigger event
     */
    simpleBtnClickTest: function (expectedEvent, btnSelector) {
      return function() {
        before(function () {
          sinon.spy(EventBus, 'trigger');

          // isolate unit by unbinding subsequent triggered events
          // first argument should be event name
          EventTestHelpers.unbind(expectedEvent);

          // select a different value
          this.view.$el.find(btnSelector).trigger('click');
        });

        after(function () {
          EventBus.trigger.restore();
          EventTestHelpers.reset();
        });

        it('should trigger event: ' + expectedEvent, function () {
          expect(EventBus.trigger).to.be.calledWith(expectedEvent);
        });
      };
    },

    /**
     * Create a simple test that test a drop-down selection changed will trigger an event.
     *
     * @param expectedEvent  event expected to be triggered.
     * @param optionSelector     jquery selector pattern to find the option to trigger test.
     * @returns {Function}    a simple test of selection change trigger event
     */
    simpleSelectionChangedTest: function (expectedEvent, optionSelector) {
      return function() {
        before(function () {
          sinon.spy(EventBus, 'trigger');

          // isolate unit by unbinding subsequent triggered events
          // first argument should be event name
          EventTestHelpers.unbind(expectedEvent);

          // select a different value
          this.view.$el.find(optionSelector).trigger('change');
        });

        after(function () {
          EventBus.trigger.restore();
          EventTestHelpers.reset();
        });

        it('should trigger event: ' + expectedEvent, function () {
          expect(EventBus.trigger).to.be.calledWith(expectedEvent);
        });
      };
    },

    /**
     * Create a simple test to test if another Event is triggered.
     *
     * @param expectedEvent  event expected to be triggered.
     * @param testFn          test function (include assertions & test triggering action.
     * @returns {Function}    a simple EventBus unit test.
     */
    simpleTriggerEventTest: function (expectedEvent, testFn) {
      return function () {
        var isSpying = false;

        before(function () {
          // make sure EventBus.trigger isn't spied already outside
          if (EventBus.trigger.toString() !== 'trigger') {
            sinon.spy(EventBus, 'trigger');
            isSpying = true;
          }

          // isolate unit by unbinding subsequent triggered events
          EventTestHelpers.unbind(expectedEvent);
        });

        after(function () {
          EventTestHelpers.reset();

          if (isSpying) {
            EventBus.trigger.restore();
          }
        });

        testFn();
      };
    },

    /**
     * Create a simple test to test if tested event listener triggers another event.
     * @param expectedEvent        event expected to be triggered in listener
     * @param testTriggerEventName  name of event triggering test function.
     * @returns {Function}          a simple EventBus listen and trigger unit test.
     */
    simpleEventTriggersEventTest: function (expectedEvent, testTriggerEventName) {
      return this.simpleTriggerEventTest(expectedEvent, function () {

        it("registers correct event listener", function () {
          expect(EventBus._events[testTriggerEventName]).to.have.length(1);
        });

        it('should trigger event: ' + expectedEvent, function () {
          // trigger callback function on ajax call success
          EventBus.trigger(testTriggerEventName);

          expect(EventBus.trigger).to.be.calledWithExactly(expectedEvent);
        });
      });
    },

    // FIXME check with arguments
    simpleEventTriggersMultiArgsEventTest: function (expectedEvent, expectedArguments, testTriggerEventName) {
      return this.simpleTriggerEventTest(expectedEvent, function () {

        it("registers correct event listener", function () {
          expect(EventBus._events[testTriggerEventName]).to.have.length(1);
        });

        it('should trigger event: ' + expectedEvent, function () {
          // trigger callback function on ajax call success
          EventBus.trigger(testTriggerEventName);

          expect(EventBus.trigger).to.be.calledWith(expectedEvent);
          expectedArguments.forEach(function(expectedArgument) {
            expect(EventBus.trigger).to.be.calledWith(expectedArgument);
          });
        });
      });
    }
    // test triggered with event name, and other options, triggering with exact parameter
  };
});