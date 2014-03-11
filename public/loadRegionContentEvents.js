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
 *
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
    authProfileMenu: function() {
      EventBus.trigger('layout.loadRegionContentRequest',{
        region:'mainAuthView',
        module:'auth',
        view: 'ProfileMenuView'
      });
    },
    cart: function(){
      EventBus.trigger('layout.loadRegionContentRequest',{
        region:'appMainRegion',
        module:'cart',
        view:'DefaultView'
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
    checkout: function() {
      EventBus.trigger('layout.loadRegionContentRequest', {
        region:'appMainRegion',
        module:'checkout',
        view:'DefaultController'
      });
    },
    editaddress: function(href) {
      EventBus.trigger('layout.loadRegionContentRequest',{
        region: 'appMainRegion',
        module: 'address',
        view: 'DefaultEditAddressView',
        data: href
      });
    },
    index: function() {
      EventBus.trigger('layout.loadRegionContentRequest',{
        region:'appMainRegion',
        module:'home',
        view:'IndexLayout'
      });
    },
    itemDetail: function(href) {
      EventBus.trigger('layout.loadRegionContentRequest',{
        region:'appMainRegion',
        module:'item',
        view:'DefaultView',
        data:href
      });
    },
    loginModal: function() {
      EventBus.trigger('layout.loadRegionContentRequest', {
        region: 'appModalRegion',
        module: 'auth',
        view: 'LoginFormView'
      });
    },
    newaddressform: function() {
      EventBus.trigger('layout.loadRegionContentRequest',{
        region: 'appMainRegion',
        module: 'address',
        view: 'DefaultCreateAddressView'
      });
    },
    newpaymentform: function() {
      EventBus.trigger('layout.loadRegionContentRequest',{
        region: 'appMainRegion',
        module: 'payment',
        view: 'DefaultCreatePaymentController'
      });
    },
    profile: function(){
      EventBus.trigger('layout.loadRegionContentRequest',{
        region:'appMainRegion',
        module:'profile',
        view:'DefaultController'
      });
    },
    purchaseDetails: function(id){
      EventBus.trigger('layout.loadRegionContentRequest',{
        region:'appMainRegion',
        module:'purchaseinfo',
        view:'PurchaseDetailsView',
        data:id
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
    registration: function() {
      EventBus.trigger('layout.loadRegionContentRequest', {
        region:'appMainRegion',
        module:'registration',
        view:'DefaultController'
      });
    },
    search: function(keywords) {
      EventBus.trigger('layout.loadRegionContentRequest',{
        region:'appMainRegion',
        module:'search',
        view:'SearchResultsView',
        data:keywords
      });
    }
  };

  return loadRegionContentEvents;
});