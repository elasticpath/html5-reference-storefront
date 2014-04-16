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
    });

    after(function() {
      ep.io.ajax.restore();
      view.translateErrorMessage.restore();
    });

    describe('responds to event: address.createAddressBtnClicked',
      EventTestFactory.createEventBusBtnEnablementTest('address.createAddressBtnClicked', 'disableButton'));

    describe('responds to event: address.editAddressBtnClicked',
      EventTestFactory.createEventBusBtnEnablementTest('address.editAddressBtnClicked', 'disableButton'));
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
        })
      );

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
        })
      );

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
        })
      );
    });
  });

  describe('responds to submit address form failure events', function() {

    beforeEach(function () {
      sinon.stub(utils, 'getDescendedPropertyValue', function (obj, propArray) {
        return 'feedbackMsgRegion';
      });
      sinon.stub(ep.ui, 'enableButton');
      sinon.stub(utils, 'renderMsgToPage');
    });

    afterEach(function () {
      utils.getDescendedPropertyValue.restore();
        ep.ui.enableButton.restore();
      utils.renderMsgToPage.restore();
    });

    describe('responds to event: address.submitAddressFormFailed', function () {
      it('should re-enable the form submit button and render an error message to the page ', function () {
        EventBus.trigger('address.submitAddressFormFailed');
        expect(ep.ui.enableButton).to.be.calledOnce;
        expect(utils.renderMsgToPage).to.be.calledOnce;
      });
    });

    describe('responds to event: address.submitAddressFormFailed.invalidFields', function () {
      it('should re-enable the form submit button and render an error message to the page ', function () {
        EventBus.trigger('address.submitAddressFormFailed.invalidFields', 'someErrorMessage');
        expect(ep.ui.enableButton).to.be.calledOnce;
        expect(utils.renderMsgToPage).to.be.calledOnce;
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