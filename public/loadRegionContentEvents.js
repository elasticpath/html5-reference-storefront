/**
 * Copyright Elastic Path Software 2013.
 *
 * This is a switch board of layout.loadRegionContentRequest triggers for main views in storefront.
 */
define(function(require) {
  var EventBus = require('eventbus');

  var loadRegionContentEvents = {
    appHeader: function() {
      EventBus.trigger('layout.loadRegionContentRequest',{
        region:'appHeaderRegion',
        module:'appheader',
        view:'AppHeaderView'
      });
    },
    index: function() {
      EventBus.trigger('layout.loadRegionContentRequest',{
        region:'appMainRegion',
        module:'home',
        view:'IndexLayout'
      });
    },
    item: function(href) {
      EventBus.trigger('layout.loadRegionContentRequest',{
        region:'appMainRegion',
        module:'item',
        view:'DefaultView',
        data:href
      });
    },
    cart: function(){
      EventBus.trigger('layout.loadRegionContentRequest',{
        region:'appMainRegion',
        module:'cart',
        view:'DefaultView'
      });
    },
    checkout: function() {
      EventBus.trigger('layout.loadRegionContentRequest', {
        region:'appMainRegion',
        module:'checkout',
        view:'DefaultView'
      });
    },
    purchaseReceipt: function(id){
      EventBus.trigger('layout.loadRegionContentRequest',{
        region:'appMainRegion',
        module:'purchaseinfo',
        view:'PurchaseReceiptView',
        data:id
      });
    },
    category: function(href, pageHref) {
      EventBus.trigger('layout.loadRegionContentRequest',{
        region:'appMainRegion',
        module:'category',
        view:'DefaultView',
        data: {
          href: href,
          pageHref: pageHref
        }
      });
    },
    newaddressform: function() {
      EventBus.trigger('layout.loadRegionContentRequest',{
        region: 'appMainRegion',
        module: 'address',
        view: 'DefaultCreateAddressView'
      });
    },
    search: function(keywords) {
      EventBus.trigger('layout.loadRegionContentRequest',{
        region:'appMainRegion',
        module:'search',
        view:'SearchResultsView',
        data:keywords
      });
    },
    profile: function(){
      EventBus.trigger('layout.loadRegionContentRequest',{
        region:'appMainRegion',
        module:'profile',
        view:'DefaultView'
      });
    },
    purchaseDetails: function(id){
      EventBus.trigger('layout.loadRegionContentRequest',{
        region:'appMainRegion',
        module:'purchaseinfo',
        view:'PurchaseDetailsView',
        data:id
      });
    }
  };

  return loadRegionContentEvents;
});