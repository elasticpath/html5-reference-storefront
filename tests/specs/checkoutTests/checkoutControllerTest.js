/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.
 *
 * Functional Storefront Unit Test - Checkout Controller
 */
define(function (require) {
  var ep = require('ep');
  var EventBus = require('eventbus');
  var Mediator = require('mediator');
  var EventTestHelpers = require('testhelpers.event');
  var EventTestFactory = require('EventTestFactory');
  var dataJSON = require('text!/tests/data/checkout.json');

  describe('Checkout Module: Controller', function () {
    var controller = require('checkout');
    var view = require('checkout.views');
    var template = require('text!modules/base/checkout/base.checkout.templates.html');

    describe("DefaultView", function () {
      before(function (done) {
        $("#Fixtures").append(template); // append templates

        this.parsedData = JSON.parse(dataJSON).response;

        var fakeGetLink = "/integrator/orders/fakeUrl";
        var fakeResponse = JSON.stringify(this.parsedData);

        ep.io.localStore.setItem('oAuthToken', 'fakeToken');

        this.server = sinon.fakeServer.create();
        this.server.autoRespond = true;

        this.server.respondWith(
          "GET", fakeGetLink + JSON.parse(dataJSON).zoom,
          [200, {"Content-Type":"application/json"}, fakeResponse]
        );

        ep.io.sessionStore.setItem('orderLink', fakeGetLink);

        this.view = new controller.DefaultView();

        this.view.render();

        // Notify Mocha that the 'before' hook is complete when the checkout order region is shown
        this.view.checkoutOrderRegion.on('show', function() {
          done();
        });
      });

      after(function () {
        $("#Fixtures").empty();
        ep.io.localStore.removeItem('oAuthToken');
        ep.io.sessionStore.removeItem('orderLink');
        delete(this.parsedData);
        this.server.restore();
      });

      it('returns an instance of cart View.DefaultLayout', function () {
        expect(this.view).to.be.an.instanceOf(view.DefaultLayout);
      });

      it('view\'s DOM is rendered (view content rendered)', function () {
        expect(this.view.el.childElementCount).to.be.equal(1);
      });

      it('the TaxesCollectionView is rendered', function() {
        // Test for the presence of the unordered list rendered by TaxesCollectionView
        expect(this.view.$el.find('ul.checkout-tax-list')).to.have.length(1);
      });

      it('renders the tax total', function() {
        expect($('[data-el-value="checkout.taxTotal"]', this.view.$el).text())
          .to.be.equal(this.parsedData._tax[0].total.display);
      });

      it('renders the BillingAddressesCompositeView view', function() {
        // There are billing addresses in the fake JSON response, so this region should be rendered
        expect(this.view.$el.find('[data-region="billingAddressSelectorsRegion"]')).to.have.length(1);
      });

      it('renders the ShippingAddressesCompositeView view', function() {
        // There are shipping addresses in the fake JSON response, so this region should be rendered
        expect(this.view.$el.find('[data-region="shippingAddressSelectorsRegion"]')).to.have.length(1);
      });

      describe("Given there is no tax data, billing addresses or shipping addresses", function() {
        // Fake a server response with missing data
        before(function (done) {
          $("#Fixtures").append(template); // append templates

          // FIXME: create a helper function for these fakeServer tests
          var fakeGetLink = "/integrator/orders/fakeUrl";
          var parsedFakeResponse = JSON.parse(dataJSON).response;

          // Remove tax, billing address and shipping address data in the fake response JSON
          parsedFakeResponse._tax = [];
          parsedFakeResponse._billingaddressinfo = [];
          parsedFakeResponse._deliveries = [];

          var fakeResponseStr = JSON.stringify(parsedFakeResponse);

          ep.io.localStore.setItem('oAuthToken', 'fakeToken');

          var server = sinon.fakeServer.create();
          server.autoRespond = true;

          server.respondWith(
            "GET", fakeGetLink + JSON.parse(dataJSON).zoom,
            [200, {"Content-Type":"application/json"}, fakeResponseStr]
          );

          ep.io.sessionStore.setItem('orderLink', fakeGetLink);

          this.view = new controller.DefaultView();

          this.view.render();

          // Notify Mocha that the 'before' hook is complete when the checkout order region is shown
          this.view.checkoutOrderRegion.on('show', function() {
            done();
          });
        });

        after(function () {
          $("#Fixtures").empty();
          ep.io.localStore.removeItem('oAuthToken');
          ep.io.sessionStore.removeItem('orderLink');
          this.server.restore();
        });

        it('does not render the TaxesCollectionView view', function() {
          expect(this.view.$el.find('ul.checkout-tax-list')).to.have.length(0);
        });

        it('does not render the BillingAddressesCompositeView view', function() {
          expect(this.view.$el.find('[data-region="billingAddressSelectorsRegion"]')).to.have.length(0);
        });

        it('does not render the ShippingAddressesCompositeView view', function() {
          expect(this.view.$el.find('[data-region="shippingAddressSelectorsRegion"]')).to.have.length(0);
        });

      });

      describe("Given there are no chosen billing or shipping addresses", function() {
        // Fake a server response without tax data
        before(function (done) {
          $("#Fixtures").append(template); // append templates

          sinon.spy(EventBus, 'trigger');
          sinon.stub(ep.io, 'ajax');

          var fakeGetLink = "/integrator/orders/fakeUrl";
          var parsedFakeResponse = JSON.parse(dataJSON).response;

          // Remove any chosen attributes from the billing addresses in the test data
          delete(parsedFakeResponse._billingaddressinfo[0]._selector[0]._chosen);
          delete(parsedFakeResponse._deliveries[0]._element[0]._destinationinfo[0]._selector[0]._chosen);

          this.fakeJSONResponse = parsedFakeResponse;

          var fakeResponseStr = JSON.stringify(this.fakeJSONResponse);

          ep.io.localStore.setItem('oAuthToken', 'fakeToken');

          var server = sinon.fakeServer.create();
          server.autoRespond = true;

          server.respondWith(
            "GET", fakeGetLink + JSON.parse(dataJSON).zoom,
            [200, {"Content-Type":"application/json"}, fakeResponseStr]
          );

          ep.io.sessionStore.setItem('orderLink', fakeGetLink);

          this.view = new controller.DefaultView();

          this.view.render();

          // Notify Mocha that the 'before' hook is complete when the checkout order region is shown
          this.view.checkoutOrderRegion.on('show', function() {
            done();
          });

        });

        after(function () {
          $("#Fixtures").empty();
          EventBus.trigger.restore();
          ep.io.ajax.restore();
          ep.io.localStore.removeItem('oAuthToken');
          ep.io.sessionStore.removeItem('orderLink');
          this.server.restore();
        });

        it('triggers the checkout.updateChosenAddressRequest event to set a chosen billing address', function() {
          var firstChoiceAddress = jsonPath(this.fakeJSONResponse, '$.._billingaddressinfo[0].._choice')[0][0];
          var firstChoiceAddressSelectAction = jsonPath(firstChoiceAddress, '$..links[?(@.rel=="selectaction")].href')[0];

          // Expect the event to be triggered with the selectAction of the first choice billing address
          expect(EventBus.trigger).to.be.calledWith('checkout.updateChosenAddressRequest', firstChoiceAddressSelectAction);
        });

        it('triggers the checkout.updateChosenAddressRequest event to set a chosen shipping address', function() {
          var firstChoiceAddress = jsonPath(this.fakeJSONResponse, '$.._deliveries[0].._choice')[0][0];
          var firstChoiceAddressSelectAction = jsonPath(firstChoiceAddress, '$..links[?(@.rel=="selectaction")].href')[0];

          // Expect the event to be triggered with the selectAction of the first choice shipping address
          expect(EventBus.trigger).to.be.calledWith('checkout.updateChosenAddressRequest', firstChoiceAddressSelectAction);
        });

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

    describe('Responds to event: checkout.addressRadioChanged', function() {
      before(function () {
        sinon.spy(EventBus, 'trigger');
        EventTestHelpers.unbind('checkout.updateChosenAddressRequest');
        EventBus.trigger('checkout.addressRadioChanged', 'fakeSelectAction');
      });

      after(function () {
        EventTestHelpers.reset();
      });

      it('calls View function resetCheckoutButtonText', function() {
//      expect(EventBus.trigger).to.be.calledWithExactly('checkout.updateChosenAddressRequest');
        expect(EventBus.trigger).to.be.calledWithExactly('checkout.updateChosenAddressRequest', 'fakeSelectAction');
      });
    });
  });
});