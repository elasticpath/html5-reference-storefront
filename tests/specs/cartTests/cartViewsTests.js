/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 * Functional Storefront Unit Test - Cart Views
 */
define(function (require) {
  var Backbone = require('backbone');
  var EventTestFactory = require('testfactory.event');

  describe('Cart Module: Views', function () {
    var views = require('cart.views');
    var template = require('text!modules/base/cart/base.cart.templates.html');

    before(function() {
      $("#Fixtures").append(template);
    });

    after(function() {
      $("#Fixtures").empty();
    });

    describe('DefaultLayout ', function () {
      before(function() {
        this.view = new views.DefaultLayout();
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

    describe('CartLineItemLayout', function() {
      var cartLineItem = {
        displayName: 'Die Hard',
        itemLink: 'items/die_hard',
        lineitemLink: '/lineitems/die_hard_1',
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
        this.view = new views.CartLineItemLayout({ model: this.model });
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

      describe('cart lineItem quantity changes',
        EventTestFactory.simpleSelectionChangedTest('cart.lineItemQuantityChanged', '[data-el-value="lineItem.quantity"] select'));

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
          views.resetQuantity(qty);
          assert.equal(this.selectEl.val(), this.originalQty, 'quantity should reset to original');
        });
      });
    });

    describe('CartCheckoutMasterLayout', function() {
      before(function() {
        this.view = new views.CartCheckoutMasterLayout();
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

        this.view = new views.CartSummaryView({
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

  });

});