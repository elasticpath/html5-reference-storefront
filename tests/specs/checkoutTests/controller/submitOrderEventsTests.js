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
 * Functional Storefront Unit Test - Checkout Controller
 */
define(function (require) {
  var ep = require('ep');
  var EventBus = require('eventbus');
  var Mediator = require('mediator');
  var EventTestHelpers = require('testhelpers.event');
  var EventTestFactory = require('testfactory.event');

  describe('Submit Order Events', function () {
    require('checkout');
    var view = require('checkout.views');

    describe("Responds to event: checkout.submitOrderBtnClicked", function () {
      var unboundEventKey = 'checkout.submitOrderRequest';
      var actionLink = 'ActionLinkTrue';

      before(function () {
        sinon.spy(EventBus, 'trigger');
        sinon.stub(ep.ui, 'disableButton');

        EventTestHelpers.unbind(unboundEventKey);
        EventBus.trigger('checkout.submitOrderBtnClicked', actionLink);
      });

      after(function () {
        EventBus.trigger.restore();
        ep.ui.disableButton.restore();
        EventTestHelpers.reset();
      });

      it("triggers event: checkout.submitOrderRequest", sinon.test(function () {
        expect(EventBus.trigger).to.be.calledWithExactly(unboundEventKey, actionLink);
      }));
    });

    describe('Responds to event: checkout.submitOrderRequest', function () {
      it('registers correct event listener', function () {
        expect(EventBus._events['checkout.submitOrderRequest']).to.be.length(1);
      });

      describe('with out valid arguments', function() {
        before(function () {
          sinon.stub(ep.logger, 'warn');
          sinon.stub(ep.io, 'ajax');
          EventBus.trigger('checkout.submitOrderRequest');
        });

        after(function () {
          ep.logger.warn.restore();
          ep.io.ajax.restore();
        });

        it('should log the error', function() {
          expect(ep.logger.warn).to.be.calledOnce;
        });
        it('should return early and skip ajax call', function() {
          expect(ep.io.ajax.callCount).to.be.equal(0);
        });
      });

      describe('with valid arguments', function() {
        var actionLink = 'submitOrderLink';

        before(function () {
          sinon.stub(ep.io, 'ajax');
          sinon.stub(ep.logger, 'error');
          EventBus.trigger('checkout.submitOrderRequest', actionLink);

          // get first argument passed to ep.io.ajax,
          // args[0] gets arguments passed in the first time ep.io.ajax is called
          // args[0][0] gets the first argument of the first time arguments
          this.ajaxArgs = ep.io.ajax.args[0][0];
        });

        after(function () {
          ep.io.ajax.restore();
          ep.logger.error.restore();
        });

        describe('should submit order to Cortex', function () {
          it('exactly once', function () {
            expect(ep.io.ajax).to.be.calledOnce;
          });
          it('with a valid request', function () {
            expect(this.ajaxArgs.type).to.be.string('POST');
            expect(this.ajaxArgs.contentType).to.be.string('application/json');
            expect(this.ajaxArgs.url).to.be.equal(actionLink);
          });
          it('with required callback functions', function () {
            expect(this.ajaxArgs.success).to.exist;
            expect(this.ajaxArgs.error).to.exist;
          });
        });

        describe('and on success',
          EventTestFactory.simpleTriggerEventTest('checkout.submitOrderSuccess', function () {
            var testEventName = 'checkout.submitOrderSuccess';

            it('should trigger ' + testEventName + ' event', function () {
              this.ajaxArgs.success(); // trigger callback function on ajax call success
              expect(EventBus.trigger).to.be.calledWith(testEventName);
            });
          }));

        describe('and on failure',
          EventTestFactory.simpleTriggerEventTest('checkout.submitOrderFailed', function () {
            var testEventName = 'checkout.submitOrderFailed';

            it('should trigger ' + testEventName + ' event', function () {
              ep.logger.error.reset();  // make sure other test's logger call doesn't interfere
              this.ajaxArgs.error({
                status: 'any error code'
              });
              expect(EventBus.trigger).to.be.calledWith(testEventName);
              expect(ep.logger.error).to.be.calledOnce
                .and.to.be.calledWithMatch('any error code');
            });
          }));
      });

    });

    describe('Responds to event: checkout.submitOrderSuccess', function() {
      var response = {
        XHR: {
          getResponseHeader: function(option){
            var responseHeader = {
              Location: 'follow location'
            };
            return responseHeader[option];
          }
        }
      };

      before(function () {
        sinon.stub(Mediator, 'fire');
        EventBus.trigger('checkout.submitOrderSuccess', response);
      });

      after(function () {
        Mediator.fire.restore();
      });

      it('fires correct mediator event to notify submit order successful', sinon.test(function () {
        expect(Mediator.fire).to.be.calledWithExactly('mediator.orderProcessSuccess', 'follow location');
      }));

    });

    describe('Responds to event: checkout.submitOrderFailed', function() {
      before(function () {
        sinon.stub($.fn, 'toastmessage'); // underlying function of $().toastmessage
        EventBus.trigger('checkout.submitOrderFailed');
      });

      after(function () {
        $.fn.toastmessage.restore();
      });

      it('calls the toastmessage plugin to report the error to the user', function() {
        expect($.fn.toastmessage).to.be.calledOnce;
      });
    });

  });

});