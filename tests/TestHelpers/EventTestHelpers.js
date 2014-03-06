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