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
    var checkoutTemplates = require('text!modules/base/checkout/base.checkout.templates.html');
    var addressTemplate = require('text!modules/base/components/address/base.component.address.template.html');

    describe("DefaultView", function () {
      before(function (done) {
        // Append templates to the DOM
        $("#Fixtures").append(checkoutTemplates, addressTemplate);

        var parsedJSONData = JSON.parse(_.clone(dataJSON));
        this.parsedResponse = parsedJSONData.response;

        this.server = getFakeCheckoutServer(parsedJSONData.zoom, this.parsedResponse);

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
        delete(this.parsedResponse);
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
          .to.be.equal(this.parsedResponse._tax[0].total.display);
      });

      it('renders the BillingAddressesCompositeView view', function() {
        // There are billing addresses in the fake JSON response, so this region should be rendered
        expect(this.view.$el.find('[data-region="billingAddressSelectorsRegion"]')).to.have.length(1);
      });

      it('renders the ShippingAddressesCompositeView view', function() {
        // There are shipping addresses in the fake JSON response, so this region should be rendered
        expect(this.view.$el.find('[data-region="shippingAddressSelectorsRegion"]')).to.have.length(1);
      });

      it('renders the ShippingOptionsCompositeView view', function() {
        // There are shipping options in the fake JSON response, so this region should be rendered
        expect(this.view.$el.find('[data-region="shippingOptionSelectorsRegion"]')).to.have.length(1);
      });

      describe("Given there is no tax data, billing addresses or shipping addresses/options", function() {
        // Fake a server response with missing data
        before(function (done) {
          $("#Fixtures").append(checkoutTemplates, addressTemplate);

          var parsedJSONData = JSON.parse(_.clone(dataJSON));
          var parsedFakeResponse = parsedJSONData.response;

          // Remove tax, billing address, shipping address and shipping option data in the fake response JSON
          parsedFakeResponse._tax = [];
          parsedFakeResponse._billingaddressinfo = [];
          parsedFakeResponse._deliveries[0]._element[0]._destinationinfo = [];
          parsedFakeResponse._deliveries[0]._element[0]._shippingoptioninfo = [];

          this.server = getFakeCheckoutServer(parsedJSONData.zoom, parsedFakeResponse);

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

        it('renders the billingAddressesEmptyView view', function() {
          expect(this.view.$el.find('[data-el-value="checkout.noBillingAddressesMsg"]')).to.have.length(1);
        });

        it('renders the shippingAddressesEmptyView view', function() {
          expect(this.view.$el.find('[data-el-value="checkout.noShippingAddressesMsg"]')).to.have.length(1);
        });

        // If there are no shipping addresses, then we should not display the 'no shipping addresses' message
        it('does not render the shippingOptionsEmptyView view', function() {
          expect(this.view.$el.find('[data-el-value="checkout.noShippingOptionsMsg"]')).to.have.length(0);
        });

      });

      describe("Given there are no chosen billing addresses, shipping addresses or shipping options", function() {
        // Fake a server response without chosen address and shipping entities
        before(function (done) {
          $("#Fixtures").append(checkoutTemplates, addressTemplate);

          sinon.spy(EventBus, 'trigger');
          sinon.stub(ep.io, 'ajax');

          var parsedJSONData = JSON.parse(_.clone(dataJSON));
          var parsedFakeResponse = parsedJSONData.response;

          // Remove any chosen attributes from the test data
          delete(parsedFakeResponse._billingaddressinfo[0]._selector[0]._chosen);
          delete(parsedFakeResponse._deliveries[0]._element[0]._destinationinfo[0]._selector[0]._chosen);
          delete(parsedFakeResponse._deliveries[0]._element[0]._shippingoptioninfo[0]._selector[0]._chosen);

          this.parsedFakeResponse = parsedFakeResponse;

          this.server = getFakeCheckoutServer(parsedJSONData.zoom, parsedFakeResponse);

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
          delete(this.fakeJSONResponse);
        });

        it('triggers the checkout.updateChosenAddressRequest event to set a chosen billing address', function() {
          var firstChoiceBillingAddress = jsonPath(this.parsedFakeResponse, '$.._billingaddressinfo[0].._choice')[0][0];
          var firstChoiceBillingAddressSelectAction =
            jsonPath(firstChoiceBillingAddress, '$..links[?(@.rel=="selectaction")].href')[0];

          // Expect the event to be triggered with the selectAction of the first choice billing address
          expect(EventBus.trigger).to.be.calledWith(
            'checkout.updateChosenAddressRequest',
            firstChoiceBillingAddressSelectAction
          );
        });

        it('triggers the checkout.updateChosenAddressRequest event to set a chosen shipping address', function() {
          var firstChoiceShippingAddress = jsonPath(this.parsedFakeResponse, '$.._deliveries[0].._choice')[0][0];
          var firstChoiceShippingAddressSelectAction =
            jsonPath(firstChoiceShippingAddress, '$..links[?(@.rel=="selectaction")].href')[0];

          // Expect the event to be triggered with the selectAction of the first choice shipping address
          expect(EventBus.trigger).to.be.calledWith(
            'checkout.updateChosenAddressRequest',
            firstChoiceShippingAddressSelectAction
          );
        });

        it('triggers the checkout.updateChosenShippingOptionRequest event to set a chosen shipping option', function() {
          var firstChoiceShippingOption = jsonPath(this.parsedFakeResponse, '$.._shippingoptioninfo[0].._choice')[0][0];
          var firstChoiceShippingOptionSelectAction =
            jsonPath(firstChoiceShippingOption, '$..links[?(@.rel=="selectaction")].href')[0];

          // Expect the event to be triggered with the selectAction of the first choice shipping option
          expect(EventBus.trigger).to.be.calledWith(
            'checkout.updateChosenShippingOptionRequest',
            firstChoiceShippingOptionSelectAction
          );
        });

      });

      describe("Given there are no physical items requiring shipment in the cart", function() {
        // Fake a server response without a deliveryType of "SHIPMENT"
        before(function (done) {
          $("#Fixtures").append(checkoutTemplates, addressTemplate);

          sinon.spy(EventBus, 'trigger');
          sinon.stub(ep.io, 'ajax');

          var parsedJSONData = JSON.parse(_.clone(dataJSON));
          var parsedFakeResponse = parsedJSONData.response;

          // Remove the deliveryType attribute
          delete(parsedFakeResponse._deliveries[0]._element[0]['delivery-type']);

          this.server = getFakeCheckoutServer(parsedJSONData.zoom, parsedFakeResponse);

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

        it("does not show shipping addresses or shipping options", function() {
          // The shipping addresses region from the checkout summary template is not populated
          expect(this.view.$el.find('[data-region="shippingAddressesRegion"]').children().length).to.be.eql(0);
          // The shipping options region from the checkout summary template is not populated
          expect(this.view.$el.find('[data-region="shippingOptionsRegion"]').children().length).to.be.eql(0);
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

    describe('Responds to event: checkout.addNewAddressBtnClicked', function() {
      before(function () {
        sinon.stub(Mediator, 'fire');
        EventBus.trigger('checkout.addNewAddressBtnClicked');
      });

      after(function () {
        Mediator.fire.restore();
      });

      it('registers correct event listener', function () {
        expect(EventBus._events['checkout.addNewAddressBtnClicked']).to.have.length(1);
      });
      it('and call correct mediator strategy to add new address', function () {
        expect(Mediator.fire).to.be.calledWithExactly('mediator.addNewAddressRequest', 'checkout');
      });

    });

  });

  /**
   * Helper function to create a sinon fakeServer object to fake the checkout model fetch in the controller code.
   * @param zoom A zoom string to append to the fake URL.
   * @param parsedJSONResponse A parsed JSON response with which the fake server will respond.
   * @returns {Object} A sinon fakeServer object.
   */
  function getFakeCheckoutServer (zoom, response) {
    var fakeGetLink = "/integrator/orders/fakeUrl";
    var fakeCheckoutServer = sinon.fakeServer.create();

    ep.io.localStore.setItem('oAuthToken', 'fakeToken');

    fakeCheckoutServer.autoRespond = true;

    fakeCheckoutServer.respondWith(
      "GET",
      fakeGetLink + zoom,
      [
        200,
        {"Content-Type": "application/json"},
        JSON.stringify(response)
      ]
    );

    ep.io.sessionStore.setItem('orderLink', fakeGetLink);

    return fakeCheckoutServer;
  }
});