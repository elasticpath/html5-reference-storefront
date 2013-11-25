/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.
 *
 * Functional Storefront Unit Test - Cart Views
 */
define(function (require) {
  var EventBus = require('eventbus');
  var Mediator = require('mediator');
  var Backbone = require('backbone');
  var ep = require('ep');
  var EventTestHelpers = require('testhelpers.event');
  var EventTestFactory = require('EventTestFactory');

  describe('Cart Module: Views', function () {
    var cartViews = require('cart.views');
    var cartTemplate = require('text!modules/base/cart/base.cart.templates.html');

    before(function() {
      $("#Fixtures").append(cartTemplate);
    });

    after(function() {
      $("#Fixtures").empty();
    });

    describe('DefaultLayout ', function () {
      before(function() {
        this.view = new cartViews.DefaultLayout();
        this.view.render();
      });

      it('should be an instance of Marionette Layout object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.Layout);
      });
      it('render() should return the view object', function () {
        expect(this.view.render()).to.be.equal(this.view);
      });
      it('view contents are rendered', function() {
        expect(this.view.el.childElementCount).to.be.equal(1);
      });

      describe('regions', function() {
        it('should have a cartTitleRegion region', function () {
          expect(this.view.cartTitleRegion).to.exist;
          expect(this.view.$el.find('[data-region="cartTitleRegion"]')).to.be.length(1);
        });
        it('should have a mainCartRegion region', function () {
          expect(this.view.mainCartRegion).to.exist;
          expect(this.view.$el.find('[data-region="mainCartRegion"]')).to.be.length(1);
        });
        it('should have a cartCheckoutMasterRegion region', function () {
          expect(this.view.cartCheckoutMasterRegion).to.exist;
          expect(this.view.$el.find('[data-region="cartCheckoutMasterRegion"]')).to.be.length(1);
        });
      });

    });

    describe('CartCheckoutLayout', function() {
      before(function() {
        this.view = new cartViews.CartCheckoutLayout();
        this.view.render();
      });

      it('should be an instance of Marionette Layout object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.Layout);
      });
      it('render() should return the view object', function () {
        expect(this.view.render()).to.be.equal(this.view);
      });
      it('view contents are rendered', function() {
        expect(this.view.el.childElementCount).to.be.equal(1);
      });

      describe('regions', function() {
        it('should have a cartCheckoutTitleRegion region', function () {
          expect(this.view.cartCheckoutTitleRegion).to.exist;
          expect(this.view.$el.find('[data-region="cartCheckoutTitleRegion"]')).to.be.length(1);
        });
        it('should have a chosenBillingAddressRegion region', function () {
          expect(this.view.chosenBillingAddressRegion).to.exist;
          expect(this.view.$el.find('[data-region="chosenBillingAddressRegion"]')).to.be.length(1);
        });
        it('should have a cartCancelActionRegion region', function () {
          expect(this.view.cartCancelActionRegion).to.exist;
          expect(this.view.$el.find('[data-region="cartCancelActionRegion"]')).to.be.length(1);
        });
        it('should have a cartOrderSummaryRegion region', function () {
          expect(this.view.cartOrderSummaryRegion).to.exist;
          expect(this.view.$el.find('[data-region="cartOrderSummaryRegion"]')).to.be.length(1);
        });
      });
    });

    describe('CartBillingAddressLayout', function() {

      describe('renders', function() {
        before(function () {
          // Mock the chosenBillingAddress model
          this.model = new Backbone.Model({
            "givenName":"ben",
            "familyName":"boxer",
            "streetAddress":"Hoyip Chinese Restaurant",
            "extendedAddress":"110 Liberty Street",
            "city":"New York",
            "region":"NY",
            "country":"US",
            "postalCode":"NY 10006"
          });
          sinon.stub(Mediator, 'fire');
          this.view = new cartViews.CartBillingAddressLayout({
            model: this.model
          });
          this.view.render();
        });

        after(function() {
          this.model.destroy();
          Mediator.fire.restore();
        });

        it('should be an instance of Marionette Layout object', function () {
          expect(this.view).to.be.an.instanceOf(Marionette.Layout);
        });
        it('render() should return the view object', function () {
          expect(this.view.render()).to.be.equal(this.view);
        });

        describe('onShow', function() {
          it('fire Mediator event: mediator.loadAddressesViewRequest',function(){
            // FIXME Reinstate this test when Mediator.fire event onShow of CartBillingAddressLayout is fired
            //          expect(Mediator.fire).to.be.calledWith('mediator.loadAddressesViewRequest');
          });
        });

        describe('regions', function () {
          it('should have a billingAddressComponentRegion region', function () {
            expect(this.view.billingAddressComponentRegion).to.exist;
            expect(this.view.$el.find('[data-region="billingAddressComponentRegion"]')).to.be.length(1);
          });
        });

        describe('renders the model data correctly', function() {
          // FIXME Reinstate these tests when Mediator.fire event onShow of CartBillingAddressLayout is fired
//        it('should render givenName and familyName', function () {
//          expect($('[data-el-value="address.name"]', this.view.$el).text()).to.have.string(this.model.givenName)
//            .and.to.have.string(this.model.familyName);
//        });
//        it('should render street address', function () {
//          expect($('[data-el-value="address.streetAddress"]', this.view.$el).text()).to.have.string(this.model.streetAddress);
//        });
//        it('should render extended address', function () {
//          expect($('[data-el-value="address.extendedAddress"]', this.view.$el).text()).to.have.string(this.model.extendedAddress);
//        });
//        it('should render city', function () {
//          expect($('[data-el-value="address.city"]', this.view.$el).text()).to.have.string(this.model.city);
//        });
//        it('should render region', function () {
//          expect($('[data-el-value="address.region"]', this.view.$el).text()).to.have.string(this.model.region);
//        });
//        it('should render country', function () {
//          expect($('[data-el-value="address.country"]', this.view.$el).text()).to.have.string(this.model.country);
//        });
//        it('should render country', function () {
//          expect($('[data-el-value="address.postalCode"]', this.view.$el).text()).to.have.string(this.model.postalCode);
//        });

        });

      });
    });

    describe('CartOrderSummaryLayout', function() {
      before(function() {
        this.view = new cartViews.CartOrderSummaryLayout();
        this.view.render();
      });

      it('should be an instance of Marionette Layout object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.Layout);
      });
      it('render() should return the view object', function () {
        expect(this.view.render()).to.be.equal(this.view);
      });

      describe('regions', function() {
        it('should have a cartSummaryRegion region', function () {
          expect(this.view.cartSummaryRegion).to.exist;
          expect(this.view.$el.find('[data-region="cartSummaryRegion"]')).to.be.length(1);
        });
        it('should have a cartTaxTotalRegion region', function () {
          expect(this.view.cartTaxTotalRegion).to.exist;
          expect(this.view.$el.find('[data-region="cartTaxTotalRegion"]')).to.be.length(1);
        });
        it('should have a cartSubmitOrderRegion region', function () {
          expect(this.view.cartSubmitOrderRegion).to.exist;
          expect(this.view.$el.find('[data-region="cartSubmitOrderRegion"]')).to.be.length(1);
        });
      });
    });

    describe('CartSummaryView', function() {
      before(function() {
        // Mock the model with just the data we need
        var rawData = {
          "cartTotalQuantity": 1,
          "cartTotal": {
            "currency": "CAD",
            "amount": 4.99,
            "display": "$4.99"
          }
        };
        this.model = new Backbone.Model(rawData);

        this.view = new cartViews.CartSummaryView({
          model: this.model
        });
        this.view.render();
      });

      after(function() {
        this.model.destroy();
      });

      it('should be an instance of Marionette ItemView object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.ItemView);
      });
      it('render() should return the view object', function () {
        expect(this.view.render()).to.be.equal(this.view);
      });

      describe('view contents are rendered', function() {
        it('should render the total cart quantity', function() {
          expect($('[data-el-value="cart.totalQuantity"]', this.view.$el).text())
            .to.be.equal(this.model.get('cartTotalQuantity').toString());
        });
        it('should render the cart sub-total', function() {
          expect($('[data-el-value="cart.subTotal"]', this.view.$el).text())
            .to.be.equal(this.model.get('cartTotal').display);
        });
      });
    });

    describe('CartTaxTotalView', function() {
      before(function () {
        // Mock the model with just the data we need
        var rawData = {
          "cartTax": {
            "currency": "CAD",
            "amount": 0.2,
            "display": "$0.20"
          },
          "cartOrderTotal": {
            "currency": "CAD",
            "amount": 5.19,
            "display": "$5.19"
          }
        };
        this.model = new Backbone.Model(rawData);

        this.view = new cartViews.CartTaxTotalView({
          model: this.model
        });
        this.view.render();
      });

      after(function() {
        this.model.destroy();
      });

      it('should be an instance of Marionette ItemView object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.ItemView);
      });
      it('render() should return the view object', function () {
        expect(this.view.render()).to.be.equal(this.view);
      });

      describe('view contents are rendered', function() {
        it('should render today\'s tax total', function() {
          expect($('[data-el-value="cartTax.display"]', this.view.$el).text())
            .to.be.equal(this.model.get('cartTax').display);
        });
        it('should render today\'s total', function() {
          expect($('[data-el-value="cartOrderTotal.display"]', this.view.$el).text())
            .to.be.equal(this.model.get('cartOrderTotal').display);
        });
      });
    });

    describe('CartSubmitOrderActionView', function() {
      before(function() {
        // Mock the model with just the data we need
        var rawData = {
          "submitOrderActionUri": "someUri"
        };
        this.model = new Backbone.Model(rawData);

        this.view = new cartViews.CartSubmitOrderActionView({
          model: this.model
        });
        this.view.render();
      });

      it('should be an instance of Marionette ItemView object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.ItemView);
      });
      it('render() should return the view object', function () {
        expect(this.view.render()).to.be.equal(this.view);
      });

      describe('complete purchase button clicked', function() {
        before(function() {
          sinon.spy(EventBus, 'trigger');

          // Unbind subsequently triggered events
          EventTestHelpers.unbind('cart.submitOrderBtnClicked');

          this.view.$el.find('.btn-cmd-submit-order').click();
        });

        after(function() {
          EventBus.trigger.restore();
          EventTestHelpers.reset();
        });

        it('should trigger submitOrderBtnClicked event', function() {
          expect(EventBus.trigger).to.be.calledWith('cart.submitOrderBtnClicked');
        });
      });
    });

    describe('CartOrderSummaryLayout', function() {
      before(function() {
        this.view = new cartViews.CartOrderSummaryLayout();
        this.view.render();
      });

      it('should be an instance of Marionette Layout object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.Layout);
      });
      it('render() should return the view object', function () {
        expect(this.view.render()).to.be.equal(this.view);
      });
      it('view contents are rendered', function() {
        expect(this.view.el.childElementCount).to.be.equal(1);
      });

      describe('regions', function() {
        it('should have a cartSummaryRegion region', function () {
          expect(this.view.cartSummaryRegion).to.exist;
          expect(this.view.$el.find('[data-region="cartSummaryRegion"]')).to.be.length(1);
        });
      });
    });

    describe('CartLineItemLayout', function() {
      var cartLineItem = {
        displayName: 'Die Hard',
        itemUri: 'items/die_hard',
        lineitemUri: '/lineitems/die_hard_1',
        thumbnail: {
          absolutePath: 'http://cdn.elasticpath.net/images/dieHard.png',
          name: 'default-image',
          relativePath: 'dieHard.png'
        },
        quantity: 3,
        availability: {},
        price: {},
        unitPrice: {},
        rateCollection: [],
        unitRateCollection: []
      };

      before(function () {
        this.model = new Backbone.Model(cartLineItem);

        // setup view & render
        this.view = new cartViews.CartLineItemLayout({model: this.model});
        this.view.render();
      });

      after(function () {
        this.model.destroy();
      });

      it('should be an instance of Marionette ItemView object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.Layout);
      });
      it('render() should return the view object', function () {
        expect(this.view.render()).to.be.equal(this.view);
      });
      it('should render as TR (table row)', function () {
        expect(this.view.el.nodeName).to.equal('TR');
      });
      it('view content is rendered', function() {
        expect(this.view.el.childElementCount).to.be.equal(7);
      });

      describe('regions should exist', function() {
        it('cartLineitemAvailabilityRegion exist', function () {
          expect(this.view.cartLineitemAvailabilityRegion).to.exist;
          expect(this.view.$el.find('[data-region="cartLineitemAvailabilityRegion"]')).to.be.length(1);
        });
        it('cartLineitemUnitPriceRegion exist', function () {
          expect(this.view.cartLineitemUnitPriceRegion).to.exist;
          expect(this.view.$el.find('[data-region="cartLineitemUnitPriceRegion"]')).to.be.length(1);
        });
        it('cartLineitemTotalPriceRegion exist', function () {
          expect(this.view.cartLineitemTotalPriceRegion).to.exist;
          expect(this.view.$el.find('[data-region="cartLineitemTotalPriceRegion"]')).to.be.length(1);
        });
      });

      describe('renders data model correctly', function() {
        it('should render lineItem title', function () {
          var title = this.view.$el.find('[data-el-value="lineItem.displayName"]').text();
          expect(title).to.have.string('Die Hard');
        });
        it('should render lineItem thumbnail image', function () {
          var imgElement = this.view.$el.find('[data-el-value="lineItem.thumbnail"]>img');
          expect(imgElement).to.be.length(1);
        });
        it('should render lineItem thumbnail image with right url', function () {
          var imgPath = this.view.$el.find('[data-el-value="lineItem.thumbnail"]>img').attr('src');
          var expectedImgPath = this.model.get('thumbnail').absolutePath;
          expect(imgPath).to.be.string(expectedImgPath);
        });
        it('should render quantity as dropdown selector', function() {
          var selectorElement = this.view.$el.find('[data-el-value="lineItem.quantity"] select');
          expect(selectorElement).to.be.length(1);
        });
        it('selector should have options', function() {
          expect(this.view.$el.find('[data-el-value="lineItem.quantity"] select>option')).to.be.length(11);
        });
        it('should render quantity with correct value', function() {
          var expectedQty = this.model.get('quantity').toString();
          var actualQty = this.view.$el.find('[data-el-value="lineItem.quantity"] select').val();
          expect(actualQty).to.be.equal(expectedQty);
        });
      });

      describe('cart lineItem quantity changes', function() {
        before(function () {
          sinon.spy(EventBus, 'trigger');

          // isolate unit by unbinding subsequent triggered events
          EventTestHelpers.unbind('cart.lineItemQuantityChanged');

          // select a different value
          this.view.$el.find('[data-el-value="lineItem.quantity"] select').trigger('change');
        });

        after(function() {
          EventBus.trigger.restore();
          EventTestHelpers.reset();
        });

        it('should trigger triggers cart.lineItemQuantityChanged event', function() {
          var quantities  = {
            original: this.model.get('quantity'),
            changeTo: this.view.$el.find('[data-el-value="lineItem.quantity"] select').val()
          };
          var actionLink = ep.app.config.cortexApi.path + this.model.get('lineitemUri');
          expect(EventBus.trigger).to.be.calledWithExactly('cart.lineItemQuantityChanged', actionLink, quantities);
        });
      });

      describe('resetQuantity helper function', function() {
        var qty = 3;
        before(function() {
          $("#Fixtures").append('<div id="renderedView"></div>');
          $("#renderedView").append(this.view.$el);

          this.originalQty = this.model.get('quantity');
          this.changedQty = this.originalQty + 2;
          this.selectEl = $('#renderedView select');

          // change quantity of selected value
          this.selectEl.val(this.changedQty);
        });

        after(function() {
          $("#renderedView").remove();
        });

        it ('and should reset lineItem quantity', function() {
          assert.equal(this.selectEl.val(), this.changedQty, 'quantity should be changed by test');
          cartViews.resetQuantity(qty);
          assert.equal(this.selectEl.val(), this.originalQty, 'quantity should reset to original');
        });
      });
    });

    describe('CartCheckoutTitleView', function() {
      before(function () {
        this.view = new cartViews.CartCheckoutTitleView();
        this.view.render();
      });

      it('should be an instance of Marionette ItemView object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.ItemView);
      });
      it('render() should return the view object', function () {
        expect(this.view.render()).to.be.equal(this.view);
      });
    });

    describe('CartCancelActionView', function() {
      before(function () {
        this.view = new cartViews.CartCancelActionView();
        this.view.render();
      });

      it('should be an instance of Marionette ItemView object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.ItemView);
      });
      it('render() should return the view object', function () {
        expect(this.view.render()).to.be.equal(this.view);
      });
      describe('checkout cancel button clicked',
        EventTestFactory.simpleBtnClickTest('cart.cancelOrderBtnClicked', '.btn-cancel-order'));
    });
  });

});