/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.
 *
 * Functional Storefront Unit Test - Checkout Controller
 */
define(function (require) {
  var ep = require('ep');
  var Backbone = require('backbone');
  var EventBus = require('eventbus');
  var Mediator = require('mediator');
  var EventTestHelpers = require('testhelpers.event');
  var EventTestFactory = require('EventTestFactory');

  describe('Checkout Module: Controller', function () {
    var controller = require('checkout');
    var view = require('checkout.views');
    var template = require('text!modules/base/checkout/base.checkout.templates.html');

    describe("DefaultView", function () {
      before(function () {
        sinon.stub(Backbone.Model.prototype, 'fetch');

        $("#Fixtures").append(template); // append templates
        this.view = new controller.DefaultView();
        this.view.render();
      });

      after(function () {
        $("#Fixtures").empty();
        Backbone.Model.prototype.fetch.restore();
      });

      it('returns an instance of cart View.DefaultLayout', function () {
        expect(this.view).to.be.an.instanceOf(view.DefaultLayout);
      });
      it('Model should have fetched info from server once', function () {
        expect(Backbone.Model.prototype.fetch).to.be.calledOnce;
      });
      it('view\'s DOM is rendered (view content rendered)', function () {
        expect(this.view.el.childElementCount).to.be.equal(1);
      });
    });

    // Event Listener: cart.cancelOrderBtnClicked
    describe('Responds to event: checkout.cancelOrderBtnClicked', function() {
      var actionLink = 'ActionLinkTrue';

      before(function () {
        ep.router = new Marionette.AppRouter();
        sinon.spy(ep.router, 'navigate');

        EventBus.trigger('checkout.cancelOrderBtnClicked', actionLink);
      });

      it('routes the user to the checkout view', sinon.test(function () {
        expect(ep.router.navigate).to.be.calledWithExactly(ep.app.config.routes.cart, true);
      }));
    });

    // Event Listener: cart.submitOrderBtnClicked
    describe("Responds to event: checkout.submitOrderBtnClicked", function () {
      var unboundEventKey = 'checkout.submitOrderRequest';
      var actionLink = 'ActionLinkTrue';

      before(function () {
        sinon.spy(EventBus, 'trigger');
        sinon.spy(view, 'setCheckoutButtonProcessing');

        EventTestHelpers.unbind(unboundEventKey);
        EventBus.trigger('checkout.submitOrderBtnClicked', actionLink);
      });

      after(function () {
        EventBus.trigger.restore();
        view.setCheckoutButtonProcessing.restore();

        EventTestHelpers.reset();
      });

      it("triggers event: checkout.submitOrderRequest", sinon.test(function () {
        expect(EventBus.trigger).to.be.calledWithExactly(unboundEventKey, actionLink);
      }));
      it('calls View.setCheckoutButtonProcessing function', sinon.test(function () {
        expect(view.setCheckoutButtonProcessing).to.be.called;
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
              expect(EventBus.trigger).to.be.calledWithExactly(testEventName);
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
        sinon.stub(view, 'resetCheckoutButtonText');
        EventBus.trigger('checkout.submitOrderFailed');
      });

      after(function () {
        view.resetCheckoutButtonText.restore();
      });

      it('calls View function resetCheckoutButtonText', function() {
        expect(view.resetCheckoutButtonText).to.be.calledOnce;
      });
    });
  });

});