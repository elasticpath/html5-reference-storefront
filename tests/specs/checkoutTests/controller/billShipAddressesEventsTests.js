/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 * Functional Storefront Unit Test - Checkout Controller
 */
define(function (require) {
  var ep = require('ep');
  var Mediator = require('mediator');
  var EventBus = require('eventbus');
  var EventTestHelpers = require('testhelpers.event');

  describe('Billing / Shipping Address (Option) Events', function () {
    require('checkout');

    describe('Responds to event: checkout.billingAddressRadioChanged',
      selectionChangedEventTestFactory('checkout.billingAddressRadioChanged', 'checkout.updateChosenBillingAddressRequest'));

    describe('Responds to event: checkout.shippingAddressRadioChanged',
      selectionChangedEventTestFactory('checkout.shippingAddressRadioChanged', 'checkout.updateChosenShippingAddressRequest'));

    describe('Responds to event: checkout.shippingOptionRadioChanged',
      selectionChangedEventTestFactory('checkout.shippingOptionRadioChanged', 'checkout.updateChosenShippingOptionRequest'));

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

    describe('Responds to event: checkout.deleteAddressBtnClicked', function() {
      before(function () {
        sinon.stub(Mediator, 'fire');
        EventBus.trigger('checkout.deleteAddressBtnClicked', 'someHref');
      });

      after(function () {
        Mediator.fire.restore();
      });

      it('fires the correct mediator strategy' ,function () {
        expect(Mediator.fire).to.be.calledWith('mediator.deleteAddressRequest');
      });
    });

    describe('Responds to event: checkout.editAddressBtnClicked', function() {
      before(function () {
        sinon.stub(Mediator, 'fire');
        EventBus.trigger('checkout.editAddressBtnClicked', 'someHref');
      });

      after(function () {
        Mediator.fire.restore();
      });

      it('fires the correct mediator strategy' ,function () {
        expect(Mediator.fire).to.be.calledWith('mediator.editAddressRequest');
      });
    });

    describe('Responds to event: checkout.updateAddresses', function() {
      before(function () {
        this.fakeView = new Marionette.View();
        sinon.stub(ep.ui, 'stopActivityIndicator');
        sinon.stub(Backbone.history, 'loadUrl');
        EventBus.trigger('checkout.updateAddresses', this.fakeView);
      });

      after(function () {
        ep.ui.stopActivityIndicator.restore();
        Backbone.history.loadUrl.restore();
      });

      it('stops the activity indicator for the given view and triggers a full page refresh' ,function () {
        expect(ep.ui.stopActivityIndicator).to.be.calledWithExactly(this.fakeView);
        expect(Backbone.history.loadUrl).to.be.calledOnce;
      });
    });

  });

  function selectionChangedEventTestFactory (eventListener, eventToTrigger) {
    return function () {
      before(function () {
        sinon.spy(EventBus, 'trigger');
        EventTestHelpers.unbind(eventToTrigger);
        EventBus.trigger(eventListener, 'fakeSelectAction');
      });

      after(function () {
        EventBus.trigger.restore();
        EventTestHelpers.reset();
      });

      it('triggers event: checkout.updateChosenSelectionRequest', function() {
        expect(EventBus.trigger).to.be.calledWithExactly(eventToTrigger, 'fakeSelectAction');
      });
    };
  }
});