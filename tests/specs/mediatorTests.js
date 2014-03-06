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
 */
define(function (require) {
  var ep = require('ep');
  var EventBus = require('eventbus');
  var Mediator = require('mediator');

  describe('EP Mediator', function() {

    // Trouble testing because ep not stubbed properly & test completes before require statement finish
    describe('Strategies', function() {
      var strategies = Mediator.testVariable.MediatorStrategies;

      describe('mediator.navigateToCheckoutRequest', function() {
        var link = 'checkoutUrl';

        before(function () {
          ep.router = new Marionette.AppRouter();
          sinon.stub(ep.router, 'navigate');

          strategies['mediator.navigateToCheckoutRequest'](link);
        });

        after(function () {
          ep.router.navigate.restore();
        });

        it('routes the user to the checkout view', function () {
          expect(ep.router.navigate).to.be.called;
        });
      });

      // Test cannot pass because sinon unable to stub the instance of ep used by code.
      describe('mediator.addNewAddressRequest', function() {
        describe('given a valid token', function() {
          var token = 'profile';

          before(function() {
            ep.router = new Marionette.AppRouter();
            sinon.stub(ep.router, 'navigate');
            sinon.stub(ep.io.sessionStore, 'setItem');

            strategies['mediator.addNewAddressRequest'](token);
          });

          after(function() {
            ep.router.navigate.restore();
            ep.io.sessionStore.setItem.restore();
          });

          it ('set session variable value to token', function() {
            expect(ep.io.sessionStore.setItem).to.be.calledWithExactly('addressFormReturnTo', token);
          });
          it ('redirect to addressForm view', function() {
          });
        });

      describe('given no token', function () {
        before(function () {
          sinon.stub(ep.logger, 'error');
          strategies['mediator.addNewAddressRequest'](undefined);
        });

        after(function () {
          ep.logger.error.restore();
        });

        it('logs error', function () {
          expect(ep.logger.error).to.be.called;
        });
      });
    });

    });
  });

});