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
 * Functional Storefront Unit Test - Payment Component Views
 */
define(function (require) {
  var ep = require('ep');
  var EventTestFactory = require('testfactory.event');

  var paymentView = require('payment.views');
  var paymentTemplate = require('text!modules/base/components/payment/base.component.payment.template.html');


  describe('Payment Module: View:', function () {
    describe('DefaultDeletePaymentConfirmationView', function () {

      before(function () {
        // append templates
        $("#Fixtures").append(paymentTemplate);
      });

      after(function () {
        $("#Fixtures").empty();
        delete(this.view);
      });

      describe('can render', function () {
        before(function () {
          this.view = new paymentView.DefaultDeletePaymentConfirmationView();
          this.view.render();
        });

        it('should be an instance of ItemView object', function () {
          expect(this.view).to.be.an.instanceOf(Marionette.ItemView);
        });

        describe('Payment method delete confirmation yes button clicked',
          EventTestFactory.simpleBtnClickTest('payment.deleteConfirmYesBtnClicked', '.btn-yes'));

        describe("Payment method delete confirmation cancel button clicked", function() {
          before(function() {
            sinon.stub($.modal, 'close');
            this.view.$el.find('.btn-no').trigger('click');
          });

          after(function() {
            $.modal.close.restore();
          });

          it("closes the confirmation modal", function() {
            expect($.modal.close).to.be.calledOnce;
          });
        });
      });
    });
  });

});