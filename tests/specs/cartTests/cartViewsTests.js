/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.
 *
 * Functional Storefront Unit Test - Cart Views
 */
define(function (require) {
  var EventBus = require('eventbus'),
      Backbone = require('backbone'),
      ep = require('ep'),
      EventTestHelpers = require('EventTestHelpers');

  describe('Cart Module: Views', function () {
    var cartViews = require('cart.views');
    var cartTemplate = require('text!modules/base/cart/base.cart.templates.html');

    before(function() {
      $("#Fixtures").append(cartTemplate);
    });

    after(function() {
      $("#Fixtures").empty();
    });

    describe('All views & view functions should exist', function() {
      it('DefaultLayout should exist', function () {
        expect(cartViews.DefaultLayout).to.exist;
      });
      it('CartTitleView should exist', function () {
        expect(cartViews.CartTitleView).to.exist;
      });
      it('MainCartView should exist', function () {
        expect(cartViews.MainCartView).to.exist;
      });
      it('CartLineItemView should exist', function () {
        expect(cartViews.CartLineItemView).to.exist;
      });
      it('CartSummaryView should exist', function () {
        expect(cartViews.CartSummaryView).to.exist;
      });
      it('CartCheckoutMasterView should exist', function () {
        expect(cartViews.CartCheckoutMasterView).to.exist;
      });
      it('CartCheckoutActionView should exist', function () {
        expect(cartViews.CartCheckoutActionView).to.exist;
      });
      it('EmptyCartView should exist', function () {
        expect(cartViews.EmptyCartView).to.exist;
      });
      it ('resetQuantity function should exist', function() {
        expect(cartViews.resetQuantity).to.be.exist;
      });
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

    describe('CartLineItemView', function() {
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
        this.view = new cartViews.CartLineItemView({model: this.model});
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
          var expectedQty = this.view.$el.find('[data-el-value="lineItem.quantity"] select').val();
          var actionLink = ep.app.config.cortexApi.path + this.model.get('lineitemUri');
          expect(EventBus.trigger).to.be.calledWithExactly('cart.lineItemQuantityChanged', actionLink, expectedQty);
        });
      });

      describe('resetQuantity helper function', function() {
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
          cartViews.resetQuantity();
          assert.equal(this.selectEl.val(), this.originalQty, 'quantity should reset to original');
        });
      });
    });

  });

});