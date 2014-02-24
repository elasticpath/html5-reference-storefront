/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 * Functional Storefront Unit Test - Address Component
 */
define(function(require) {
  var ep = require('ep');
  var EventBus = require('eventbus');
  var Mediator = require('mediator');

  var EventTestFactory = require('testfactory.event');

  var controller = require('address'); // load controller file
  var view = require('address.views');
  var model = require('address.models');
  var template = require('text!modules/base/components/address/base.component.address.template.html');
  var utils = require('utils');

  describe('Submit Address Enable/Disable Button Tests', function() {
    before(function() {
      sinon.stub(ep.io, 'ajax');
      sinon.stub(view, 'translateErrorMessage');
      sinon.stub(utils, 'renderMsgToPage');
    });

    after(function() {
      ep.io.ajax.restore();
      view.translateErrorMessage.restore();
      utils.renderMsgToPage.restore();
    });

    describe('responds to event: address.createAddressBtnClicked',
      EventTestFactory.createEventBusBtnEnablementTest('address.createAddressBtnClicked', 'disableButton'));

    describe('responds to event: address.editAddressBtnClicked',
      EventTestFactory.createEventBusBtnEnablementTest('address.editAddressBtnClicked', 'disableButton'));

    describe('responds to event: address.submitAddressFormFailed',
      EventTestFactory.createEventBusBtnEnablementTest('address.submitAddressFormFailed', 'enableButton'));

    describe('responds to event: address.submitAddressFormFailed.invalidFields',
      EventTestFactory.createEventBusBtnEnablementTest('address.submitAddressFormFailed.invalidFields', 'enableButton'));
  });

  describe('Submit Address Events Tests', function () {
    before(function() {
      // Stub the enable/disable button functions as they will be tested separately
      sinon.stub(ep.ui, 'disableButton');
      sinon.stub(ep.ui, 'enableButton');
    });

    after(function() {
      ep.ui.disableButton.restore();
      ep.ui.enableButton.restore();
    });

    describe('responds to event: address.createAddressBtnClicked',
      simpleAddressBtnClickedEventTest('address.submitAddressRequest', 'address.createAddressBtnClicked', 'POST'));

    describe('responds to event: address.editAddressBtnClicked',
      simpleAddressBtnClickedEventTest('address.submitAddressRequest', 'address.editAddressBtnClicked', 'PUT'));

    describe('responds to event: address.submitAddressRequest', function () {
      var actionLink = 'linkToPostAddressForm';
      var method = 'POST';
      var fakeForm = {address: 'address properties'};

      before(function () {
        sinon.stub(view, 'getAddressFormValues', function () {
          return fakeForm;
        });
        sinon.stub(ep.io, 'ajax');
        sinon.stub(ep.logger, 'error');
        EventBus.trigger('address.submitAddressRequest', method, actionLink);

        // get first argument passed to ep.io.ajax,
        // args[0] gets arguments passed in the first time ep.io.ajax is called
        // args[0][0] gets the first argument of the first time arguments
        this.ajaxArgs = ep.io.ajax.args[0][0];
      });

      after(function () {
        view.getAddressFormValues.restore();
        ep.io.ajax.restore();
        ep.logger.error.restore();
      });

      it('registers correct event listener', function () {
        expect(EventBus._events['address.submitAddressRequest']).to.be.length(1);
      });
      it('should get an address form model', function () {
        expect(view.getAddressFormValues).to.be.calledOnce;
      });

      describe('should submit new address to Cortex', function () {
        it('exactly once', function () {
          expect(ep.io.ajax).to.be.calledOnce;
        });
        it('with a valid request', function () {
          expect(this.ajaxArgs.type).to.be.string('POST');
          expect(this.ajaxArgs.contentType).to.be.string('application/json');
          expect(this.ajaxArgs.data).to.be.equal(JSON.stringify(view.getAddressFormValues()));
          expect(this.ajaxArgs.url).to.be.equal(actionLink);
        });
        it('with required callback functions', function () {
          expect(this.ajaxArgs.success).to.exist;
          expect(this.ajaxArgs.error).to.exist;
        });
      });

      describe('and on success',
        EventTestFactory.simpleTriggerEventTest('address.submitAddressFormSuccess', function () {
          var testEventName = 'address.submitAddressFormSuccess';

          it('should trigger ' + testEventName + ' event', function () {
            this.ajaxArgs.success(); // trigger callback function on ajax call success
            expect(EventBus.trigger).to.be.calledWithExactly(testEventName);
          });
        }));

      describe('and on failure with 400 status code',
        EventTestFactory.simpleTriggerEventTest('address.submitAddressFormFailed.invalidFields', function () {
          var testEventName = 'address.submitAddressFormFailed.invalidFields';

          it('should trigger ' + testEventName + ' event', function () {
            ep.logger.error.reset();  // make sure other test's logger call doesn't interfere
            this.ajaxArgs.error({
              status: 400,
              responseText: 'some error message'
            });
            expect(EventBus.trigger).to.be.calledWithExactly(testEventName, 'some error message');
            expect(ep.logger.error).to.be.calledOnce
              .and.to.be.calledWithMatch('400');
          });
        }));

      describe('and on failure with any other status code',
        EventTestFactory.simpleTriggerEventTest('address.submitAddressFormFailed', function () {
          var testEventName = 'address.submitAddressFormFailed';

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

    describe('responds to submit address form failure events', function() {
      before(function (done) {
        // Define a DefaultEditAddressView so the renderAddressFormErrorState function
        // can use it when it's called by the address form failure events
        sinon.stub(Backbone.Model.prototype, 'fetch');
        sinon.stub(Backbone.Collection.prototype, 'fetch');

        var fakeGetLink = "/integrator/address/fakeUrl";
        this.view = controller.DefaultEditAddressView(fakeGetLink);

        // Short delay to allow the fake AJAX request to complete
        setTimeout(done, 200);

        sinon.stub(utils, 'renderMsgToPage');
      });

      after(function () {
        Backbone.Model.prototype.fetch.restore();
        Backbone.Collection.prototype.fetch.restore();

        utils.renderMsgToPage.restore();
      });

      describe('address.submitAddressFormFailed', function() {
        before(function() {
          EventBus.trigger('address.submitAddressFormFailed');
        });

        it('calls functions to enable the submit button and render errors to the page', function () {
          expect(ep.ui.enableButton).to.be.calledOnce;
          expect(utils.renderMsgToPage).to.be.calledOnce;
        });
      });

      describe('address.submitAddressFormFailed.invalidFields', function() {
        var errMsg = 'some error message';
        before(function () {
          sinon.stub(view, 'translateErrorMessage');
          EventBus.trigger('address.submitAddressFormFailed.invalidFields', errMsg);
        });

        after(function () {
          view.translateErrorMessage.restore();
        });

        it('calls functions to enable the submit button and render errors to the page', function () {
          expect(ep.ui.enableButton).to.be.called;
          expect(view.translateErrorMessage).to.be.calledWith(errMsg);
          expect(utils.renderMsgToPage).to.be.called;
        });
      });
    });

    describe('responds to event: address.submitAddressFormSuccess', function () {
      before(function () {
        sinon.stub(Mediator, 'fire');
        EventBus.trigger('address.submitAddressFormSuccess');
      });

      after(function () {
        Mediator.fire.restore();
      });

      it('registers correct event listener', function () {
        expect(EventBus._events['address.submitAddressFormSuccess']).to.have.length(1);
      });
      it('calls correct mediator strategy to notify storefront address form module is complete', function () {
        expect(Mediator.fire).to.be.calledWithExactly('mediator.addressFormComplete');
      });
    });

    describe('responds to event: address.cancelBtnClicked', function () {
      before(function () {
        sinon.stub(Mediator, 'fire');
        EventBus.trigger('address.cancelBtnClicked');
      });

      after(function () {
        Mediator.fire.restore();
      });
      it('registers correct event listener', function () {
        expect(EventBus._events['address.cancelBtnClicked']).to.have.length(1);
      });
      it('calls correct mediator strategy to notify storefront address form module is complete: ', function () {
        expect(Mediator.fire).to.be.calledWithExactly('mediator.addressFormComplete');
      });
    });

    function simpleAddressBtnClickedEventTest(expected, listener, method) {
      return EventTestFactory.simpleTriggerEventTest(expected, function () {

        it("registers correct event listener", function () {
          expect(EventBus._events[listener]).to.have.length(1);
        });

        it('should trigger event: ' + expected, function () {
          var href = 'fakeAddressSubmitHref';
          EventBus.trigger(listener, href);

          expect(EventBus.trigger).to.be.calledWith(expected, method, href);
        });
      });
    }
  });

});