/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 * Functional Storefront Unit Test - Profile Controller
 */
define(function (require) {
  var Backbone = require('backbone');
  var EventBus = require('eventbus');
  var Mediator = require('mediator');
  var ep = require('ep');

  describe('Profile Module: Address Events', function () {
    require('profile');

    describe('Responds to event: profile.addNewAddressBtnClicked', function () {
      before(function () {
        sinon.stub(Mediator, 'fire');
        EventBus.trigger('profile.addNewAddressBtnClicked');
      });

      after(function () {
        Mediator.fire.restore();
      });

      it('registers correct event listener', function () {
        expect(EventBus._events['profile.addNewAddressBtnClicked']).to.have.length(1);
      });
      it('and call correct mediator strategy to add new address', function () {
        expect(Mediator.fire).to.be.calledWithExactly('mediator.addNewAddressRequest', 'profile');
      });
    });

    describe('Responds to event: profile.editAddressBtnClicked', function () {
      var fakeHref = 'fakeHrefForTest';

      before(function () {
        sinon.stub(Mediator, 'fire');
        EventBus.trigger('profile.editAddressBtnClicked', fakeHref);
      });

      after(function () {
        Mediator.fire.restore();
      });

      it('registers correct event listener', function () {
        expect(EventBus._events['profile.editAddressBtnClicked']).to.have.length(1);
      });
      it('and call correct mediator strategy to edit an address', function () {
        expect(Mediator.fire).to.be.calledWith('mediator.editAddressRequest');
      });
    });

    describe('Responds to event: profile.deleteAddressBtnClicked', function () {
      before(function () {
        sinon.stub(Mediator, 'fire');
        EventBus.trigger('profile.deleteAddressBtnClicked');
      });

      after(function () {
        Mediator.fire.restore();
      });

      it('calls the correct mediator strategy', function() {
        expect(Mediator.fire).to.be.calledWith('mediator.deleteAddressRequest');
      });
    });

    describe('Responds to event: profile.updateAddresses', function () {
      before(function () {
        sinon.stub(Backbone.Model.prototype, 'fetch');
        EventBus.trigger('profile.updateAddresses');
      });
      after(function () {
        Backbone.Model.prototype.fetch.restore();
      });
      it('calls Backbone.Model.fetch to update the profile model', function () {
        expect(Backbone.Model.prototype.fetch).to.be.called;
      });
    });
  });

});