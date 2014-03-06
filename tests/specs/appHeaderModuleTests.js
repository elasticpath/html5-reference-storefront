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
