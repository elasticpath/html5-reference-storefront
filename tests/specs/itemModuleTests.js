/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.

 * User: sbrookes
 * Date: 22/07/13
 * Time: 11:33 AM
 *
 */

define(function (require) {
  var itemViews = require('item.views');
  var itemModel = require('item.models');

  describe('UI Storefront Item Detail - Default Layout ', function () {
    var defaultView = new itemViews.DefaultView();
    it('should exist', function () {
      expect(itemViews.DefaultView).to.be.ok;
    });
    it('should have a title region', function () {
      expect(defaultView.itemDetailTitleRegion).to.be.ok;
    });
    it('should have an asset region', function () {
      expect(defaultView.itemDetailAssetRegion).to.be.ok;
    });
    it('should have an attribute list region', function () {
      expect(defaultView.itemDetailAttributeRegion).to.be.ok;
    });
    it('should have an availability display region', function () {
      expect(defaultView.itemDetailAvailabilityRegion).to.be.ok;
    });
    it('should have a price region', function () {
      expect(defaultView.itemDetailPriceRegion).to.be.ok;
    });
    it('should have an add to cart region', function () {
      expect(defaultView.itemDetailAddToCartRegion).to.be.ok;
    });

  });
  describe('UI Storefront - Item Detail - Item Views ', function () {
    it('DefaultView should exist', function () {
      expect(itemViews.DefaultView).to.be.ok;
    });
    it('DefaultItemTitleView should exist', function () {
      expect(itemViews.DefaultItemTitleView).to.be.ok;
    });
    it('DefaultItemAssetView should exist', function () {
      expect(itemViews.DefaultItemAssetView).to.be.ok;
    });
    it('DefaultItemAttributeView should exist', function () {
      expect(itemViews.DefaultItemAttributeView).to.be.ok;
    });
    it('DefaultItemAvailabilityView should exist', function () {
      expect(itemViews.DefaultItemAvailabilityView).to.be.ok;
    });
    it('DefaultItemPriceView should exist', function () {
      expect(itemViews.DefaultItemPriceView).to.be.ok;
    });
    it('DefaultItemAddToCartView should exist', function () {
      expect(itemViews.DefaultItemAddToCartView).to.be.ok;
    });
    // describe('Add to Cart View',function(){
    // var template = require('text!modules/item/item.templates.html');

    // var x = $(template).find('#DefaultItemDetailAddToCartTemplate');
//      var addToCartView = new itemViews.DefaultItemAddToCartView({
//        template:function(){
//          return x;
//        }
//      });
//      addToCartView.render();
//      it('x ok', function(){
//        expect(template.length).to.be.belowq(2);
//      });
    // it('Add Item To Cart should have a button',function(done){
    //var xButton = ;
//        $('.btn-itemdetail-addtocart').click(function(done){
//          expect().to.be.ok;
//          done();
//        })

    // });

    // });
  });
  describe('UI Storefront - Item Detail - Model', function () {
    var testDataOne = {
      "addtocart": {
        "actionlink": "http://10.10.2.141:8080/cortex/carts/mobee/default/lineitems/items/mobee/m5yxissunrjgovjqnrefsrluizlwercvnbyuokzrmqyfg5dspi3xqntbgf4xgqrpoazu44tekvhhmwshk5zwiscrgjheiujsjzdvu5kygjugw"
      },
      "assets": [
        {
          "contentLocation": "http://www.images.com/default-image",
          "name": "default-image",
          "relatvieLocation": "Thumbnail_HD.jpg"
        },
        {
          "contentLocation": "http://www.images.com/default1-image",
          "name": "next-image",
          "relatvieLocation": "Thumbnail_HD1.jpg"
        }
      ],
      "availability": "AVAILABLE",
      "details": [
        {
          "displayName": "Specific Resolution",
          "displayValue": "High"
        }
      ],
      "displayName": "Finding Nemo",
      "price": {
        "list": {
          "amount": "31",
          "currency": "CAD",
          "display": "$31.00"
        },
        "purchase": {
          "amount": "30",
          "currency": "CAD",
          "display": "$30.00"
        }
      }
    };
    var testItem1 = new itemModel.ItemModel(testDataOne);
    it('Item 1 should exist', function () {
      expect(testItem1).to.be.ok;
    });
    it('Item 1 addtocart should be ok', function () {
      expect(testItem1.get('addtocart')).to.be.ok;
    });
    it('Item 1 isAddToCartEnabled should be true', function () {
      expect(testItem1.isAddToCartEnabled()).to.be.true;
    });
    describe('Item 1 Assets', function () {
      it('Item 1 assets should be an array', function () {
        expect(testItem1.get('assets')).to.be.instanceof(Array);
      });
      var defaultImageObj = testItem1.getDefaultImage();
      it('Item 1 default image should be an object', function () {
        expect(defaultImageObj).to.instanceof(Object);
      });
      it('Item 1 default image contentLocation should equal "http://www.images.com/default-image"', function () {
        expect(defaultImageObj.contentLocation).to.equal('http://www.images.com/default-image');
      });
    });
    it('Item 1 availability should equal "AVAILABLE"', function () {
      expect(testItem1.get('availability')).to.equal('AVAILABLE');
    });
    it('Item 1 details should be an array', function () {
      expect(testItem1.get('details')).to.be.instanceof(Array);
    });
    it('Item 1 displayName should equal "Finding Nemo"', function () {
      expect(testItem1.get('displayName')).to.equal('Finding Nemo');
    });
    describe('Item 1 Price Object', function () {
      var priceObj = testItem1.get('price');
      it('Item 1 price should be an object', function () {
        expect(priceObj).to.be.instanceof(Object);
      });
      var listPrice = priceObj.list;
      var purchasePrice = priceObj.purchase;
      describe('Item 1 List Price Object', function () {

        it('Item 1 price.list should be an object', function () {
          expect(listPrice).to.be.instanceof(Object);
        });
        it('Item 1 price.list.amount should equal "31"', function () {
          expect(listPrice.amount).to.equal('31');
        });
        it('Item 1 price.list currency should equal "CAD"', function () {
          expect(listPrice.currency).to.equal('CAD');
        });
        it('Item 1 price.list display should equal "$31.00"', function () {
          expect(listPrice.display).to.equal('$31.00');
        });
      });
      describe('Item 1 Purchase Price Object', function () {

        it('Item 1 price.purchase should be an object', function () {
          expect(purchasePrice).to.be.instanceof(Object);
        });
        it('Item 1 price.purchase.amount should equal "30"', function () {
          expect(purchasePrice.amount).to.equal('30');
        });
        it('Item 1 price.purchase currency should equal "CAD"', function () {
          expect(purchasePrice.currency).to.equal('CAD');
        });
        it('Item 1 price.purchase display should equal "$30.00"', function () {
          expect(purchasePrice.display).to.equal('$30.00');
        });

      });
    });

  });
});

