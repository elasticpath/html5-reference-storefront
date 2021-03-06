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
 * Functional Storefront Unit Test - Paynment Component Views
 */
define(function (require) {
  var ep = require('ep');
  var Backbone = require('backbone');

  var EventTestFactory = require('testfactory.event');

  var paymentView = require('payment.views');
  var paymentTemplate = require('text!modules/base/components/payment/base.component.payment.template.html');


  describe('Payment Module: View:', function () {
    describe('DefaultPaymentFormView', function () {
      var StandardPaymentFormModel = Backbone.Model.extend({
        defaults: {
          href: "fakeActionUrl"
        }
      });
      before(function () {
        // append templates
        $("#Fixtures").append(paymentTemplate);

        this.model = new StandardPaymentFormModel();
        this.view = new paymentView.DefaultPaymentFormView({model: this.model});
      });

      after(function () {
        delete(this.model);
        delete(this.view);
        $("#Fixtures").empty();
      });

      it('should be an instance of ItemView object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.ItemView);
      });
      it('has valid templateHelpers', function () {
        expect(this.view.templateHelpers).to.be.ok;
      });
      it('render() should return the view object', function () {
        expect(this.view.render()).to.be.equal(this.view);
      });

      describe('when the referring module is profile', function () {
        before(function () {
          // Stub the sessionStorage retrieval function to simulate a shopper arriving at the form from profile
          sinon.stub(ep.io.sessionStore, 'getItem', function (param) {
            return 'profile';
          });
          this.profileReferredView = this.view.render();
        });
        after(function () {
          ep.io.sessionStore.getItem.restore();
        });
        it('on render, a "hidden" class is added to the saveToProfileFormGroup', function () {
          expect(this.profileReferredView.ui.saveToProfileFormGroup.hasClass('hidden')).to.be.true;
        });
      });

      describe('when the referring module is NOT profile', function () {
        before(function () {
          // Stub the sessionStorage retrieval function to simulate a shopper arriving at the form from checkout
          sinon.stub(ep.io.sessionStore, 'getItem', function (param) {
            return 'checkout';
          });
          this.profileReferredView = this.view.render();
        });
        after(function () {
          ep.io.sessionStore.getItem.restore();
        });
        it('on render, a "hidden" class is NOT added to the saveToProfileFormGroup', function () {
          expect(this.profileReferredView.ui.saveToProfileFormGroup.hasClass('hidden')).to.be.false;
        });
      });

      describe('renders required elements:', function () {
        it('a title element', function () {
          expect(this.view.$el.find('h1')).to.be.length(1);
        });
        it('a feedback region', function () {
          expect(this.view.$el.find('[data-region="componentPaymentFeedbackRegion"]')).to.be.length(1);
        });
        it('2 buttons (Save & Cancel)', function () {
          expect(this.view.$el.find('button')).to.be.length(2);
        });
        it("form input fields", function () {
          expect(this.view.$el.find('input')).to.be.length(4);
          expect(this.view.$el.find('select')).to.be.length(3);
        });
      });

      describe('save new payment method button clicked',
        EventTestFactory.simpleBtnClickTest('payment.savePaymentMethodBtnClicked',
          '[data-el-label="paymentForm.save"]'));

      describe('cancel new payment method form button clicked',
        EventTestFactory.simpleBtnClickTest('payment.cancelFormBtnClicked',
          '[data-el-label="paymentForm.cancel"]'));


    });
  });

});