/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 */
define(
  function (require) {


    describe('EP App Header Module',function(){
      // Controler interface
      describe('AppHeader Controller', function () {
        var appHeaderController = require('appheader');

        it('HeaderView should exist', function () {
          var appHeaderView = appHeaderController.AppHeaderView();
          expect(appHeaderView).to.be.ok;
        });
        it('HeaderLogoView should exist', function () {
          var appHeaderLogoView = appHeaderController.HeaderLogoView();
          expect(appHeaderLogoView).to.be.ok;
        });
      });
      // Module Views
      describe("AppHeader Views",function(){
        var appHeaderViews = require('appheader.views');
        var ep = require('ep');

        it('PageHeaderView should exist', function () {
          expect(appHeaderViews.PageHeaderView).to.exist;
        });
        it('MainNavRegion should exist', function() {
          expect(ep.app.mainNavRegion).to.exist;
        });

        it('HeaderLogoView should exist', function () {
          expect(appHeaderViews.HeaderLogoView).to.exist;
        });

      });
      // Module Models
      describe("AppHeader Models",function(){
        var appHeaderModels = require('appheader.models');
        it('LogoModel should exist', function () {
          expect(appHeaderModels.LogoModel).to.exist;
        });

      });
    });


  });
