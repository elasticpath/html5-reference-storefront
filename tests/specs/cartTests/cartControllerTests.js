/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.
 *
 * Functional Storefront Unit Test - Cart Controller
 */
define(function (require) {
  var EventBus = require('eventbus');
  var Mediator = require('mediator');
  var Backbone = require('backbone');
  var ep = require('ep');
  var EventTestFactory = require('EventTestFactory');
  var EventTestHelpers = require('testhelpers.event');

  describe('Cart Module: Controller', function () {
    var cartController = require('cart');
    var cartView = require('cart.views');
    var cartTemplate = require('text!modules/base/cart/base.cart.templates.html');


    // Default View
    describe("DefaultView", function () {

        before(function () {
          $("#Fixtures").append(cartTemplate); // append templates

          sinon.stub(Backbone.Model.prototype, 'fetch');
          this.view = new cartController.DefaultView();
          this.view.render();
        });

        after(function () {
          $("#Fixtures").empty();
          Backbone.Model.prototype.fetch.restore();
        });

        it('returns an instance of cart View.DefaultLayout', function () {
          expect(this.view).to.be.an.instanceOf(cartView.DefaultLayout);
        });
        it('Model should have fetched info from server once', function () {
          expect(Backbone.Model.prototype.fetch).to.be.calledOnce;
        });
        it('view\'s DOM is rendered (view content rendered)', function () {
          expect(this.view.el.childElementCount).to.be.equal(1);
        });
    });

    // Event Listener: cart.lineItemQuantityChanged
    describe('Responds to event: cart.lineItemQuantityChanged', function () {
      var unboundEventKey = 'cart.updateLineItemQtyRequest';
      var actionLink = 'actionLinkIsLineItemUri';
      var quantities = {
        original: 2,
        changeTo: 5
      };

      before(function () {
        sinon.spy(EventBus, 'trigger');
        EventTestHelpers.unbind(unboundEventKey); // isolate event
        EventBus.trigger('cart.lineItemQuantityChanged', actionLink, quantities);  // trigger test event
      });

      after(function () {
        EventBus.trigger.restore();
        EventTestHelpers.reset();
      });

      it("has a callBack function", function () {
        expect(EventBus._events['cart.lineItemQuantityChanged']).to.have.length(1);
      });
      it("triggers " + unboundEventKey, sinon.test(function () {
        expect(EventBus.trigger).to.be.calledWithExactly(unboundEventKey, actionLink, quantities);
      }));
    });


    // Event Listener: cart.updateLineItemQtyRequest
    describe('Responds to event: cart.updateLineItemQtyRequest', function () {
      var actionLink = 'actionLinkIsLineItemUri';
      var quantities = {
        original: 2,
        changeTo: 5
      };

      before(function () {
        sinon.spy(EventBus, 'trigger');
        sinon.stub(ep.logger, 'error');
      });

      after(function () {
        EventBus.trigger.restore();
        ep.logger.error.restore();
      });

      it("registers correct event listener", function () {
        expect(EventBus._events['cart.updateLineItemQtyRequest']).to.have.length(1);
      });

      describe('handles invalid events', function () {
        afterEach(function () {
          EventBus.trigger.reset();
          ep.logger.error.reset();
        });

        it('should log error about missing quantity in request', function () {
          EventBus.trigger('cart.updateLineItemQtyRequest', actionLink, undefined);
          expect(ep.logger.error).to.be.calledOnce;
        });
        it('should log error about missing action in request', function () {
          EventBus.trigger('cart.updateLineItemQtyRequest', undefined, quantities);
          expect(ep.logger.error).to.be.calledOnce;
        });
        it('should log error about missing action & qty in request', function () {
          EventBus.trigger('cart.updateLineItemQtyRequest', undefined, undefined);
          expect(ep.logger.error).to.be.calledOnce;
        });
      });

      describe('handles valid event', function () {
        before(function () {
          sinon.stub(ep.io, 'ajax');
          EventBus.trigger('cart.updateLineItemQtyRequest', actionLink, quantities);
          // get first argument passed to ep.io.ajax,
          // args[0] gets arguments passed in the first time ep.io.ajax is called
          // args[0][0] gets the first argument of the first time arguments
          this.ajaxArgs = ep.io.ajax.args[0][0];
        });

        after(function () {
          EventBus.trigger.reset();
          ep.io.ajax.restore();
        });

        describe('should inform Cortex of quantity update', function () {
          it('exactly once', function () {
            expect(ep.io.ajax).to.be.calledOnce;
          });
          it('with a valid request', function () {
            expect(this.ajaxArgs.type).to.be.string('PUT');
            expect(this.ajaxArgs.contentType).to.be.string('application/json');
            expect(this.ajaxArgs.data).to.be.equal('{quantity:' + quantities.changeTo + '}');
            expect(this.ajaxArgs.url).to.be.equal(actionLink);
          });
          it('with required callback functions', function () {
            expect(this.ajaxArgs.success).to.exist;
            expect(this.ajaxArgs.error).to.exist;
          });
        });

        describe('and on success',
          EventTestFactory.simpleTriggerEventTest('cart.updateLineItemQtySuccess', function () {
            var testEventName = 'cart.updateLineItemQtySuccess';

            it('should trigger ' + testEventName + ' event', function () {
              // trigger callback function on ajax call success
              this.ajaxArgs.success();
              expect(EventBus.trigger).to.be.calledWithExactly(testEventName);
            });
          }));

        describe('and on failure with 404 status code',
          EventTestFactory.simpleTriggerEventTest('cart.updateLineItemQtyFailed.ItemDeleted', function () {
            var testEventName = 'cart.updateLineItemQtyFailed.ItemDeleted';

            it('should trigger ' + testEventName + ' event', function () {
              this.ajaxArgs.error({
                status: 404
              });
              expect(EventBus.trigger).to.be.calledWithExactly(testEventName);
            });
          }));

        describe('and on failure with other status code',
          EventTestFactory.simpleTriggerEventTest('cart.updateLineItemQtyFailed', function () {
            var testEventName = 'cart.updateLineItemQtyFailed';

            it('should trigger ' + testEventName + ' event', function () {
              this.ajaxArgs.error({
                status: 'any other error code'
              });
              expect(EventBus.trigger).to.be.calledWithExactly(testEventName, quantities.original);
            });
          }));
      });
    });


    // Event Listener: cart.updateLineItemQtySuccess
    describe('Responds to event: cart.updateLineItemQtySuccess',
      EventTestFactory.simpleEventTriggersEventTest('cart.reloadCartViewRequest', 'cart.updateLineItemQtySuccess'));


    // Event Listener: cart.updateLineItemQtyFailed.ItemDeleted
    describe('Responds to event: cart.updateLineItemQtyFailed.ItemDeleted', function () {
      before(function () {
        sinon.spy(EventBus, 'trigger');
        EventTestHelpers.unbind('layout.loadRegionContentRequest');
        EventBus.trigger('cart.updateLineItemQtyFailed.ItemDeleted');

        // get 2nd argument of 2nd call
        // 1st call is made to trigger tested listener, 2nd call is event triggered in listener
        // 1st argument is event name, subsequent ones are arguments passed in
        this.triggerArgs = EventBus.trigger.args[1][1];
      });

      after(function () {
        EventBus.trigger.restore();
        EventTestHelpers.reset();
      });

      it('should trigger layout.loadRegionContentRequest', function () {
        expect(EventBus.trigger).to.be.calledWith('layout.loadRegionContentRequest');
      });
      it('with valid data', function () {
        expect(this.triggerArgs.module).to.be.string('cart');
        expect(this.triggerArgs.view).to.be.string('DefaultView');
        expect(this.triggerArgs.region).to.be.string('appMainRegion');
      });
      it('and a callback function', function () {
        expect(this.triggerArgs.callback).to.be.instanceOf(Function);
      });
      // test content of callback function is calling sticky
    });


    // Event Listener: cart.updateLineItemQtyFailed
    describe('Responds to event: cart.updateLineItemQtyFailed', function () {
      var originalQty = 5;

      before(function () {
        sinon.spy(cartView, 'resetQuantity');
        sinon.stub($.fn, 'toastmessage'); // underlying function of $().toastmessage
        EventBus.trigger('cart.updateLineItemQtyFailed', originalQty);
      });

      after(function () {
        cartView.resetQuantity.restore();
        $.fn.toastmessage.restore();
      });

      it('should reset lineItem quantity', function () {
        expect(cartView.resetQuantity).to.be.calledWith(originalQty);
      });
      it('and display error message', function () {
        expect($().toastmessage).to.be.calledOnce;
      });
    });

    // Event Listener: cart.removeLineItemConfirm
    describe('Responds to event: cart.removeLineItemConfirmYesBtnClicked', function() {
      before(function () {
        sinon.stub(ep.ui, 'startActivityIndicator');
        sinon.spy(EventBus, 'trigger');
        sinon.spy($.modal, 'close');

        EventBus.trigger('cart.removeLineItemConfirmYesBtnClicked', 'someHref');
      });

      after(function () {
        ep.ui.startActivityIndicator.restore();
        EventBus.trigger.restore();
        $.modal.close.restore();
      });

      it('starts the activity indicators and triggers a remove line item request', function () {
        expect($.modal.close).to.be.called;
        expect(ep.ui.startActivityIndicator).to.be.calledTwice;
        expect(EventBus.trigger).to.be.calledWithExactly('cart.removeLineItemRequest', 'someHref');
      });
    });

    describe('Resonds to event: cart.removeLineItemSuccess', function() {
      before(function() {
        sinon.stub(Backbone.Model.prototype, 'fetch');

        EventBus.trigger('cart.removeLineItemSuccess');
      });
      after(function() {
        Backbone.Model.prototype.fetch.restore();
      });
      it('fetches the cart model', function() {
        expect(Backbone.Model.prototype.fetch).to.be.called;
      });
    });

    describe('Responds to event: cart.removeLineItemFailed', function() {
      before(function() {
        sinon.stub(ep.ui, 'stopActivityIndicator');
        sinon.stub(ep.logger, 'error');
        EventBus.trigger('cart.removeLineItemFailed');
      });
      after(function() {
        ep.ui.stopActivityIndicator.restore();
        ep.logger.error.restore();
      });
      it('stops the activity indicators and writes an error to the logger', function() {
        expect(ep.ui.stopActivityIndicator).to.be.calledTwice;
        expect(ep.logger.error).to.be.called;
      });
    });

    // Event Listener: cart.checkoutBtnClicked
    describe('Responds to event: cart.checkoutBtnClicked', function () {

      describe('when user is logged in', function() {
        var actionLink = 'ActionLinkTrue';

        before(function () {
          sinon.stub(ep.app, 'isUserLoggedIn', function() {
            return true;
          });
          sinon.stub(Mediator, 'fire');
          EventBus.trigger('cart.checkoutBtnClicked', actionLink);
        });

        after(function () {
          EventTestHelpers.reset();
          ep.app.isUserLoggedIn.restore();
          Mediator.fire.restore();
        });

        it('fire correct mediator event', sinon.test(function () {
          expect(Mediator.fire).to.be.calledWithExactly('mediator.navigateToCheckoutRequest', actionLink);
        }));
      });

    });

    describe('when user is not logged in', function() {
      var actionLink = 'ActionLinkTrue';

      before(function () {
        sinon.stub(Mediator, 'fire');
        sinon.stub(ep.app, 'isUserLoggedIn', function() {
          return false;
        });

        EventBus.trigger('cart.checkoutBtnClicked', actionLink);
      });

      after(function () {
        ep.app.isUserLoggedIn.restore();
        Mediator.fire.restore();
      });

      it('fires correct mediator event to load authentication view', sinon.test(function () {
        expect(Mediator.fire).to.be.calledWithExactly('mediator.getAuthentication');
      }));
    });


  });
});