/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.
 *
 * Functional Storefront Unit Test - Address Component Controller
 */
define(function (require) {
  var EventBus = require('eventbus');
  var Backbone = require('backbone');
  var EventTestHelpers = require('EventTestHelpers');
  var EventTestFactory = require('EventTestFactory');
  var ep = require('ep');

  describe('Address Component: Controller', function () {
    var addressController = require('address');
    var addressView = require('address.views');
    var addressTemplate = require('text!modules/base/components/address/base.component.address.template.html');

    describe('DefaultCreateAddressView', function () {
      before(function () {
        $("#Fixtures").append(addressTemplate); // append templates

        this.view = addressController.DefaultCreateAddressView();
      });

      after(function () {
        $("#Fixtures").empty();
      });

      it('exists', function () {
        expect(addressController.DefaultCreateAddressView).to.exist;
      });
      it('is an instance of function', function () {
        expect(addressController.DefaultCreateAddressView).to.be.instanceOf(Function);
      });
      it('returns an instance of DefaultCreateAddressLayout', function () {
        expect(this.view).to.be.instanceOf(addressView.DefaultCreateAddressLayout);
      });
      it('renders content (ul element) into addressFormRegion', function () {
        this.view.render().trigger('show');
        expect(this.view.$el.find('[data-region="componentAddressFormRegion"] ul')).to.be.length(1);
      });
    });

    describe('responds to event: address.loadAddressesViewRequest', function () {
      before(function () {
        sinon.spy(EventBus, 'trigger');
      });

      after(function () {
        EventBus.trigger.restore();
      });

      it("registers correct event listener", function () {
        expect(EventBus._events['address.loadAddressesViewRequest']).to.be.length(1);
      });

      describe('handles valid data', function () {
        before(function () {
          $("#Fixtures").append(addressTemplate); // append templates
          $("#Fixtures").append('<div id="testingRegion"></div>'); // append an region to render tested view into

          EventBus.trigger('address.loadAddressesViewRequest', {
            region: new Marionette.Region({el: '#testingRegion'}),
            model: new Backbone.Model()
          });
        });

        after(function () {
          $('#Fixtures').empty();
        });

        it("by rendering DefaultAddressItemView into provided region", function () {
          expect($('#testingRegion ul[class="address-container"]')).to.be.length(1);
        });
      });

      describe('handles invalid data', function () {
        before(function () {
          this.errorlogger = sinon.stub(ep.logger, 'error');
          EventBus.trigger('address.loadAddressesViewRequest', undefined);
        });

        after(function () {
          ep.logger.error.restore();
        });

        it("by logging the error in console", function () {
          expect(this.errorlogger).to.be.calledWithMatch('failed to load Address View');
        });
      });
    });

    describe('responds to event: address.createAddressBtnClicked',
      EventTestFactory.simpleEventChainTest('address.getAddressFormRequest', 'address.createAddressBtnClicked'));

    describe('responds to event: address.getAddressFormRequest', function() {
      before(function () {
        sinon.spy(EventBus, 'trigger');
        sinon.stub(ep.io, 'ajax');
        EventBus.trigger('address.getAddressFormRequest');

        // get first argument passed to ep.io.ajax,
        // args[0] gets arguments passed in the first time ep.io.ajax is called
        // args[0][0] gets the first argument of the first time arguments
        this.ajaxArgs = ep.io.ajax.args[0][0];
      });

      after(function () {
        EventBus.trigger.restore();
        ep.io.ajax.restore();
      });

      it('registers correct event listener', function () {
        expect(EventBus._events['address.getAddressFormRequest']).to.be.length(1);
      });

      describe('should request address form from Cortex', function () {
        it('exactly once', function () {
          expect(ep.io.ajax).to.be.calledOnce;
        });
        it('with a valid request', function () {
          var actionLink = '/default?zoom=addresses:addressform';
          expect(this.ajaxArgs.type).to.be.string('GET');
          expect(this.ajaxArgs.contentType).to.be.string('application/json');
          expect(this.ajaxArgs.url).to.have.string(actionLink);
        });
        it('with required callback functions', function () {
          expect(this.ajaxArgs.success).to.be.ok;
          expect(this.ajaxArgs.error).to.be.ok;
        });
      });

      describe('and on success',
        EventTestFactory.simpleTriggerEventTest('address.createNewAddressRequest', function () {
          var testEventName = 'address.createNewAddressRequest';

          it('should trigger ' + testEventName + ' event', function () {
            this.ajaxArgs.success('response'); // trigger callback function on ajax call success
            expect(EventBus.trigger).to.be.calledWith(testEventName);
          });
        }));

      describe('and on failure',
        EventTestFactory.simpleTriggerEventTest('address.submitAddressFormFailed', function () {
          var testEventName = 'address.submitAddressFormFailed';

          it('should trigger ' + testEventName + ' event', function () {
            this.ajaxArgs.error({
              status: 'any error code'
            });
            expect(EventBus.trigger).to.be.calledWithExactly(testEventName);
          });
        }));
    });

    describe('responds to event: address.createNewAddressRequest', function() {
      var actionLink = 'linkToPostAddressForm';
      var fakeAddressModel = {address: 'address properties'};

      before(function () {
        sinon.stub(addressView, 'getAddressModel', function() {return fakeAddressModel;});
        sinon.stub(ep.io, 'ajax');
        EventBus.trigger('address.createNewAddressRequest', actionLink);

        // get first argument passed to ep.io.ajax,
        // args[0] gets arguments passed in the first time ep.io.ajax is called
        // args[0][0] gets the first argument of the first time arguments
        this.ajaxArgs = ep.io.ajax.args[0][0];
      });

      after(function () {
        addressView.getAddressModel.restore();
        ep.io.ajax.restore();
      });

      it('registers correct event listener', function () {
        expect(EventBus._events['address.createNewAddressRequest']).to.be.length(1);
      });
      it('should get an address form model', function() {
        expect(addressView.getAddressModel).to.be.calledOnce;
      });

      describe('should submit new address to Cortex', function () {
        it('exactly once', function () {
          expect(ep.io.ajax).to.be.calledOnce;
        });
        it('with a valid request', function () {
          expect(this.ajaxArgs.type).to.be.string('PUT');
          expect(this.ajaxArgs.contentType).to.be.string('application/json');
          expect(this.ajaxArgs.data).to.be.equal(JSON.stringify(addressView.getAddressModel()));
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
            this.ajaxArgs.error({
              status: 400,
              responseText: 'some error message'
            });
            expect(EventBus.trigger).to.be.calledWithExactly(testEventName, 'some error message');
          });
        }));

      describe('and on failure with any other status code',
        EventTestFactory.simpleTriggerEventTest('address.submitAddressFormFailed', function () {
          var testEventName = 'address.submitAddressFormFailed';

          it('should trigger ' + testEventName + ' event', function () {
            this.ajaxArgs.error({
              status: 'any error code'
            });
            expect(EventBus.trigger).to.be.calledWithExactly(testEventName);
          });
        }));
    });

    describe('responds to event: address.submitAddressFormFailed', function() {
      before(function(){
        sinon.stub(addressView, 'displayAddressFormErrorMsg');
        EventBus.trigger('address.submitAddressFormFailed');
      });

      after(function(){
        addressView.displayAddressFormErrorMsg.restore();
      });

      it('called method from view to display error message', function(){
        expect(addressView.displayAddressFormErrorMsg).to.be.calledOnce;
      });
    });

    describe('responds to event: address.submitAddressFormFailed.invalidFields', function() {
      var errMsg = 'some error message';
      before(function(){
        sinon.stub(addressView, 'displayAddressFormErrorMsg');
        EventBus.trigger('address.submitAddressFormFailed.invalidFields', errMsg);
      });

      after(function(){
        addressView.displayAddressFormErrorMsg.restore();
      });

      it('called method from view to display error message', function(){
        expect(addressView.displayAddressFormErrorMsg).to.be.calledWith(errMsg);
      });
    });
  });

});