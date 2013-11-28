/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.
 *
 * Functional Storefront Unit Test - Checkout Controller
 */
define(function (require) {
  var Backbone = require('backbone');
  var EventBus = require('eventbus');
  var Mediator = require('mediator');
  var EventTestHelpers = require('testhelpers.event');
  var ep = require('ep');

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
    describe('cart.cancelOrderBtnClicked event works', function() {
      var actionLink = 'ActionLinkTrue';

      before(function () {
        ep.router = new Marionette.AppRouter();
        sinon.spy(ep.router, 'navigate');

        EventBus.trigger('cart.cancelOrderBtnClicked', actionLink);
      });

      it('routes the user to the checkout view', sinon.test(function () {
        expect(ep.router.navigate).to.be.calledWithExactly('mycart', true);
      }));
    });

    // Event Listener: cart.submitOrderBtnClicked
    describe("cart.submitOrderBtnClicked event works", function () {
      var unboundEventKey = 'cart.submitOrderRequest';
      var actionLink = 'ActionLinkTrue';

      before(function () {
        sinon.spy(EventBus, 'trigger');
        sinon.spy(view, 'setCheckoutButtonProcessing');

        EventTestHelpers.unbind(unboundEventKey);
        EventBus.trigger('cart.submitOrderBtnClicked', actionLink);
      });

      after(function () {
        EventBus.trigger.restore();
        view.setCheckoutButtonProcessing.restore();

        EventTestHelpers.reset();
      });

      it("fires cart.submitOrderRequest", sinon.test(function () {
        expect(EventBus.trigger).to.be.calledWithExactly(unboundEventKey, actionLink);
      }));
      it('called View.setCheckoutButtonProcessing', sinon.test(function () {
        expect(cartView.setCheckoutButtonProcessing).to.be.called;
      }));
    });

    describe('log in modal loaded if user is not logged in', function() {
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

      it('fires an authentication request to the mediator', sinon.test(function () {
        expect(Mediator.fire).to.be.calledWithExactly('mediator.getAuthentication');
      }));
    });

  });

});