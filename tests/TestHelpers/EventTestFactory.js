/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 * EventBus Test Factory.
 */

define(function (require) {
  var EventBus = require('eventbus');
  var EventTestHelpers = require('testhelpers.event');
  var ep = require('ep');

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
     * @param listenerName  name of event triggering test function.
     * @returns {Function}          a simple EventBus listen and trigger unit test.
     */
    simpleEventTriggersEventTest: function (expectedEvent, listenerName) {
      return this.simpleTriggerEventTest(expectedEvent, function () {

        it("registers correct event listener", function () {
          expect(EventBus._events[listenerName]).to.have.length(1);
        });

        it('should trigger event: ' + expectedEvent, function () {
          // trigger callback function on ajax call success
          EventBus.trigger(listenerName);

          expect(EventBus.trigger).to.be.calledWith(expectedEvent);
        });
      });
    },

    // FIXME check with arguments
    // test triggered with event name, and other options, triggering with exact parameter
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
    },

    /**
     * Create a test that triggers an EventBus event and watches to see if
     * one of the enable or disable button functions are called.
     *
     * @param {String} eventBusEventName The name of the EventBus event to trigger
     * @param {String} btnEnablementFnName The name of the button enablement function to spy - supported values are
     *                 'enableButton' and 'disableButton'
     * @returns {Function} A sinon/Mocha unit test function that can be supplied to a describe statement
     */
    createEventBusBtnEnablementTest: function (eventBusEventName, btnEnablementFnName) {
      return function() {
        before(function () {
          sinon.spy(EventBus, 'trigger');
          sinon.stub(ep.ui, btnEnablementFnName);

          EventBus.trigger(eventBusEventName);
        });

        after(function () {
          EventBus.trigger.restore();
          ep.ui[btnEnablementFnName].restore();
        });

        it('should call the ' + btnEnablementFnName + ' function', function () {
          expect(ep.ui[btnEnablementFnName]).to.be.calledOnce;
        });
      };
    }
  };
});