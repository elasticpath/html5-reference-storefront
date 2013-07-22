/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.

 * User: sbrookes
 * Date: 22/07/13
 * Time: 11:33 AM
 *
 */

define(function(require) {
  var item   = require('item');
  var itemViews = require('modules/item/item.views');

  describe('UI Storefront Item Detail - Default Layout ', function(){
    var defaultLayout = new item.DefaultLayout();
    it('should exist', function(){
      expect(defaultLayout).to.be.ok;
    });
    it('should have a title region',function(){
      expect(defaultLayout.itemDetailTitleRegion).to.be.ok;
    });
    it('should have an asset region',function(){
      expect(defaultLayout.itemDetailAssetRegion).to.be.ok;
    });
    it('should have an attribute list region',function(){
      expect(defaultLayout.itemDetailAttributeRegion).to.be.ok;
    });
    it('should have an availability display region',function(){
      expect(defaultLayout.itemDetailAvailabilityRegion).to.be.ok;
    });
    it('should have a price region',function(){
      expect(defaultLayout.itemDetailPriceRegion).to.be.ok;
    });
    it('should have a subscription region',function(){
      expect(defaultLayout.itemDetailSubscriptionRegion).to.be.ok;
    });
    it('should have an add to cart region',function(){
      expect(defaultLayout.itemDetailAddToCartRegion).to.be.ok;
    });
  });
  describe('UI Storefront - Item Detail - Item Views ', function(){
    it('DefaultLayout should exist', function(){
      expect(itemViews.DefaultLayout).to.be.ok;
    });
    it('DefaultItemTitleView should exist', function(){
      expect(itemViews.DefaultItemTitleView).to.be.ok;
    });
    it('DefaultItemAssetView should exist', function(){
      expect(itemViews.DefaultItemAssetView).to.be.ok;
    });
    it('DefaultItemAttributeView should exist', function(){
      expect(itemViews.DefaultItemAttributeView).to.be.ok;
    });
    it('DefaultItemAvailabilityView should exist', function(){
      expect(itemViews.DefaultItemAvailabilityView).to.be.ok;
    });
    it('DefaultItemPriceView should exist', function(){
      expect(itemViews.DefaultItemPriceView).to.be.ok;
    });
    it('DefaultItemSubscriptionView should exist', function(){
      expect(itemViews.DefaultItemSubscriptionView).to.be.ok;
    });
    it('DefaultItemAddToCartView should exist', function(){
      expect(itemViews.DefaultItemAddToCartView).to.be.ok;
    });
  });
});

