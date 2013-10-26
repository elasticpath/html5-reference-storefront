/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.

 * User: sbrookes
 * Date: 26/07/13
 * Time: 7:31 AM
 *
 */
define(function (require) {

  describe('UI Storefront Cart Module  ', function () {

    describe('Cart Controller', function () {
      var EventBus = require('eventbus');
      var Backbone = require('backbone');
      var cartController = require('cart');
      var View = require('cart.views');

      describe("DefaultView", function () {
        var cartTemplate = require('text!modules/base/cart/base.cart.templates.html');

        before(function () {
          sinon.stub(Backbone, 'sync');

          $("#Fixtures").append(cartTemplate);
          this.viewLayout = new cartController.DefaultView();
          this.viewLayout.render();
        });

        after(function() {
          $("#Fixtures").empty();
          Backbone.sync.restore();
        });

        it('DefaultView should exist', function () {
          expect(this.viewLayout).to.exist;
        });
        it('should be an instance of Marionette Layout object', function () {
          expect(this.viewLayout).to.be.an.instanceOf(Marionette.Layout);
        });
        it('render() should return the view object', function () {
          expect(this.viewLayout.render()).to.be.equal(this.viewLayout);
        });
        it('view\'s DOM is rendered with 1 child (view content rendered)', function() {
          expect(this.viewLayout.el.childElementCount).to.be.equal(1);
        });
        it('Model should have fetched info from server once', function () {
          expect(Backbone.sync).to.be.calledOnce;
        });
      });

      describe("cart.checkoutBtnClicked event works", function () {
        var eventKey = 'cart.checkoutRequest';
        var unboundEvent = {};
        var actionLink = 'ActionLinkTrue';

        before(function () {
          sinon.spy(EventBus, 'trigger');
          sinon.spy(View, 'setCheckoutButtonProcessing');

          unboundEvent[eventKey] = EventBus._events[eventKey];
          EventBus.unbind(eventKey);  // isolate event
          EventBus.trigger('cart.checkoutBtnClicked', actionLink);
        });

        after(function () {
          EventBus.trigger.restore();
          View.setCheckoutButtonProcessing.restore();
          EventBus._events[eventKey] = unboundEvent[eventKey];
        });

        it("fires cart.checkoutRequest", sinon.test(function () {
          expect(EventBus.trigger).to.be.calledWithExactly('cart.checkoutRequest', actionLink);
        }));
        // # of event triggered in cart.checkoutBtnClicked + itself
        it('called eventbus right number of times', sinon.test(function () {
          expect(EventBus.trigger).to.be.calledTwice;
        }));

        it('called View.setCheckoutButtonProcessing', sinon.test(function () {
          expect(View.setCheckoutButtonProcessing).to.be.called;
        }));
      });

      describe("cart.checkoutRequest event works", function () {
        var eventKey1 = 'cart.submitOrderRequest';
        var eventKey2 = 'layout.loadRegionContentRequest';
        var unbindedEvents = {};

        before(function () {
          sinon.spy(EventBus, 'trigger'); // find out why this.spy doesn't work

          unbindedEvents[eventKey1] = EventBus._events[eventKey1];
          EventBus.unbind(eventKey1);
          unbindedEvents[eventKey2] = EventBus._events[eventKey2];
          EventBus.unbind(eventKey2);
        });

        after(function () {
          EventBus.trigger.restore();
          EventBus._events[eventKey1] = unbindedEvents[eventKey1];
          EventBus._events[eventKey2] = unbindedEvents[eventKey2];
        });

        describe('with an actionLink', function () {
          before(function () {
            var actionLink = 'hasActionLinkTrue';
            EventBus.trigger('cart.checkoutRequest', actionLink);
          });

          after(function () {
            EventBus.trigger.reset();
          });

          it("fires cart.submitOrderRequest", sinon.test(function () {
            expect(EventBus.trigger).to.be.calledWith('cart.submitOrderRequest');
          }));
        });

        describe('without an actionLink', function () {
          before(function () {
            EventBus.trigger('cart.checkoutRequest');
          });

          after(function () {
            EventBus.trigger.reset();
          });

          it("fires layout.loadRegionContentRequest", sinon.test(function () {
            expect(EventBus.trigger).to.be.calledWith('layout.loadRegionContentRequest');
          }));
          it('called eventbus right number of times', sinon.test(function () {
            expect(EventBus.trigger).to.be.calledTwice;
          }));
        });
      });

    });

    describe('Cart Views', function () {
      var cartViews = require('cart.views');
      describe('DefaultView ', function () {
        var defaultView = new cartViews.DefaultView();
        it('DefaultView should exist', function () {
          expect(defaultView).to.exist;
        });
        it('DefaultView should have a cartTitleRegion region', function () {
          expect(defaultView.cartTitleRegion).to.exist;
        });
        it('DefaultView should have a mainCartRegion region', function () {
          expect(defaultView.mainCartRegion).to.exist;
        });
        it('DefaultView should have a cartCheckoutMasterRegion region', function () {
          expect(defaultView.cartCheckoutMasterRegion).to.exist;
        });

      });
      it('CartTitleView should exist', function () {
        expect(cartViews.CartTitleView).to.exist;
      });
      it('MainCartView should exist', function () {
        expect(cartViews.MainCartView).to.exist;
      });
      it('CartLineItemView should exist', function () {
        expect(cartViews.CartLineItemView).to.exist;
      });
      it('CartSummaryView should exist', function () {
        expect(cartViews.CartSummaryView).to.exist;
      });
      it('CartCheckoutMasterView should exist', function () {
        expect(cartViews.CartCheckoutMasterView).to.exist;
      });
      it('CartCheckoutActionView should exist', function () {
        expect(cartViews.CartCheckoutActionView).to.exist;
      });
      it('EmptyCartView should exist', function () {
        expect(cartViews.EmptyCartView).to.exist;
      });


    });

    describe("Cart Models", function () {
      var cartModel = require('cart.models');
      it("CartModel should exist", function () {
        expect(cartModel.CartModel).to.exist;
      });
      it("CartItemCollection should exist", function () {
        expect(cartModel.CartItemCollection).to.exist;
      });
      it("CartItemModel should exist", function () {
        expect(cartModel.CartItemModel).to.exist;
      });

    });

  });
});
