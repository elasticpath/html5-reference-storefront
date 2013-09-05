/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.

 * User: sbrookes
 * Date: 19/06/13
 * Time: 2:41 PM
 *
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
        var appHeaderViews = require('modules/appheader/appheader.views');
        it('PageHeaderView should exist', function () {
          expect(appHeaderViews.PageHeaderView).to.exist;
        });
        it('HeaderLogoView should exist', function () {
          expect(appHeaderViews.HeaderLogoView).to.exist;
        });

      });
      // Module Models
      describe("AppHeader Models",function(){
        var appHeaderModels = require('modules/appheader/appheader.models');
        it('LogoModel should exist', function () {
          expect(appHeaderModels.LogoModel).to.exist;
        });

      });
    });


  });
