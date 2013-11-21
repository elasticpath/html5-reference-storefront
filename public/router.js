/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 02/04/13
 * Time: 8:25 AM
 *
 */
define(['marionette','eventbus','pace'],
  function(Marionette, EventBus,pace) {

    var appRouterController = {
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
          module:'cart',
          view:'CheckoutView'
        });
      },
      confirmation: function(id){
        EventBus.trigger('layout.loadRegionContentRequest',{
          region:'appMainRegion',
          module:'receipt',
          view:'DefaultView',
          data:id
        });
      },
      category: function(href, pageHref) {
        pace.start();
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
      newaddressform: function() {
        EventBus.trigger('layout.loadRegionContentRequest',{
          region: 'appMainRegion',
          module: 'address',
          view: 'DefaultCreateAddressView'
        });
      }
    };

    var router = Backbone.Marionette.AppRouter.extend({
      appRoutes:{
        '': 'index',
        'home': 'index',
        'category' : 'category',
        'category/:href' : 'category',
        'category/:href/:pagehref' : 'category',
        'search' : 'search',
        'search/:keywords' : 'search',
        'itemdetail/:href': 'item',
        'profile': 'profile',
        'mycart': 'cart',
        'checkout': 'checkout',
        'confirmation/:id': 'confirmation',
        'newaddressform' : 'newaddressform'
      },
      controller:appRouterController
    });

    return {
      AppRouter:router
    };
  }
);
