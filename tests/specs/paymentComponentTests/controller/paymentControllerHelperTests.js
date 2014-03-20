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
 *
 * Functional Storefront Unit Test - Payment component controller helper functions
 */
define(function (require) {
  var ep = require('ep');

  var controller = require('payment');

  describe('Payment Controller:', function () {
    describe('showMissingSubmitUrlToastMessage', function () {

      before(function () {
        sinon.stub(ep.logger, 'error');
        sinon.stub($.fn, 'toastmessage');
        controller.__test_only__.showMissingSubmitUrlToastMessage();
      });

      after(function () {
        ep.logger.error.restore();
        $.fn.toastmessage.restore();
      });

      it('logs an error and shows a toast message', function () {
        expect(ep.logger.error).to.be.calledOnce;
        expect($.fn.toastmessage).to.be.calledWith('showToast');
      });
    });
  });
});