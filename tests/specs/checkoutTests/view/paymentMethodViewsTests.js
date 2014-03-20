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
 * Functional Storefront Unit Test - Checkout Views
 */
define(function (require) {
  var ep = require('ep');

  var Backbone = require('backbone');
  var Mediator = require('mediator');
  var EventTestFactory = require('testfactory.event');

  describe('Checkout Module: Views: ', function () {
    describe('Payment Method Views', function () {
      var views = require('checkout.views');
      var template = require('text!modules/base/checkout/base.checkout.templates.html');

      var StandardPayment = Backbone.Model.extend({
        defaults: {
          displayValue: "**********6754",
          href: 'fakeActionLink'
        }
      });

      before(function () {
        $("#Fixtures").append(template);
      });

      after(function () {
        $("#Fixtures").empty();
      });

      describe('PaymentMethodSelectorView', function () {
        before(function () {
          sinon.spy($.prototype, 'prepend');
          sinon.spy($.prototype, 'hide');
          sinon.stub(Mediator, 'fire');

          this.model = new StandardPayment();
          this.model.set('oneTime', true);
          this.view = new views.testVariables.PaymentMethodSelectorView({
            model: this.model
          });
          this.view.render();
        });

        after(function () {
          $.prototype.prepend.restore();
          $.prototype.hide.restore();
          Mediator.fire.restore();
          delete(this.model);
          delete(this.view);
        });

        it('should be an instance of Marionette Layout object', function () {
          expect(this.view).to.be.an.instanceOf(Marionette.Layout);
        });
        it('should have a checkoutPaymentRegion region', function () {
          expect(this.view.checkoutPaymentRegion).to.exist;
          expect(this.view.$el.find(this.view.regions.checkoutPaymentRegion)).to.be.length(1);
        });
        it('has valid templateHelpers', function () {
          expect(this.view.templateHelpers).to.be.ok;
        });
        it('defines and renders ui element delete button', function () {
          expect(this.view.ui.deleteButton).to.be.ok;
          expect(this.view.$el.find(this.view.ui.deleteButton)).to.be.length(1);
        });
        it('renders a radio button', function () {
          expect(this.view.$el.find('input[type="radio"]')).to.be.length(1);
        });
        it('and a corresponding label', function () {
          expect(this.view.$el.find('label')).to.be.length(1);
        });


        // FIXME unable to test selection change trigger event
        // EventTestFactory.simpleSelectionChangedTest might help.
        describe('delete payment method button clicked',
          EventTestFactory.simpleBtnClickTest('checkout.deletePaymentBtnClicked',
            '[data-el-label="checkout.deletePaymentBtn"]'));


        describe('onRender', function () {
          it("prepends a label for one-time payment method", function () {
            expect($.prototype.prepend).to.be.called;
          });
          it("hides delete button for one-time payment method", function () {
            expect($.prototype.hide).to.be.called;
          });
          it("calls mediator strategy to load paymentMethodView", function() {
            expect(Mediator.fire).to.be.calledWith('mediator.loadPaymentMethodViewRequest');
          });
        });
      });

      describe('PaymentMethodsCompositeView', function () {
        before(function () {
          sinon.stub(Mediator, 'fire'); // child view calls mediator.fire on render

          this.collection = new Backbone.Collection([
            new StandardPayment()
          ]);
          this.view = new views.PaymentMethodsCompositeView({collection: this.collection});
          this.view.render();
        });

        after(function () {
          Mediator.fire.restore();
          delete(this.collection);
          delete(this.view);
        });

        it('should be an instance of Marionette CompositeView object', function () {
          expect(this.view).to.be.an.instanceOf(Marionette.CompositeView);
        });
        it('has a sub-title element', function () {
          expect(this.view.$el.find('h2')).to.be.length(1);
        });
        it('has a addNewPaymentMethod button', function () {
          expect(this.view.$el.find('button[data-el-label="checkout.newPaymentMethodBtn"]')).to.be.length(1);
        });
        it('has an emptyView', function () {
          expect(this.view.emptyView).to.be.ok;
        });
        it('defines correct itemViewContainer', function () {
          expect(this.view.itemViewContainer).to.be.ok;
          expect(this.view.$el.find(this.view.itemViewContainer)).to.be.length(1);
        });
        it('and defines a target render element for activityIndicator', function () {
          expect(this.view.ui.activityIndicatorEl).to.be.ok;
          expect(this.view.$el.find(this.view.ui.activityIndicatorEl)).to.be.length(1);
        });

        describe('add new payment method button clicked',
          EventTestFactory.simpleBtnClickTest('checkout.addNewPaymentMethodBtnClicked',
            '[data-el-label="checkout.newPaymentMethodBtn"]'));

      });

    });
  });
});
