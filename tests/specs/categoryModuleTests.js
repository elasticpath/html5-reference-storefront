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

define(function(require) {
  describe ('UI Storefront Category Module  ', function () {

    /*
     * Test Category Controller
     */
    describe ('UI Storefront Category Controller', function () {

      var categoryController = require('category');
      describe("DefaultView",function(){
//        var defaultView = new categoryController.DefaultView();
        /*it('DefaultView should exist',function(){
          expect(defaultView).to.exist;
        });*/
      });
    });

    /*
     * Test presence of Category Views and Regions
     */
    describe ('UI Storefront Category View', function () {
      var categoryViews = require('category.views');
      var ep = require('ep');

      describe('DefaultView and Regions', function () {
        var defaultView = new categoryViews.DefaultView();
        it('DefaultView should exist', function () {
          expect(defaultView).to.exist;
        });
        it('DefaultView should have a categoryTitleRegion region', function () {
          expect(defaultView.categoryTitleRegion).to.exist;
        });
        // these regions are moved to global level. Failing test because it's
        // declared to ep.app in categoryView's onShow function. Currently not testable.
 /*       it('categoryBrowseRegion should exist', function () {
          expect(ep.app.categoryBrowseRegion).to.exist;
        });
        it('categoryPaginationTopRegion should exist', function () {
          expect(ep.app.categoryPaginationTopRegion).to.exist;
        });
        it('categoryPaginationBottomRegion should exist', function () {
          expect(ep.app.categoryPaginationBottomRegion).to.exist;
        });*/
      });

      it('CategoryTitleView should exist', function () {
        expect(categoryViews.CategoryTitleView).to.exist;
      });
      it('CategoryItemCollectionView should exist', function () {
        expect(categoryViews.CategoryItemCollectionView).to.exist;
      });
      it('CategoryItemView should exist', function () {
        expect(categoryViews.CategoryItemView).to.exist;
      });
      it('CategoryPaginationView should exist', function () {
        expect(categoryViews.CategoryPaginationView).to.exist;
      });
    });


    /*
     * Test Category Model
     */
    describe ('UI Storefront Category Model', function () {
      var categoryModel = require('category.models');
      it("CategoryModel should exist",function(){
        expect(categoryModel.CategoryModel).to.exist;
      });
      it("CategoryItemPageModel should exist",function(){
        expect(categoryModel.CategoryItemPageModel).to.exist;
      });
      it("CategoryPaginationModel should exist",function(){
        expect(categoryModel.CategoryPaginationModel).to.exist;
      });
      it("CategoryItemCollectionModel should exist",function(){
        expect(categoryModel.CategoryItemCollectionModel).to.exist;
      });
    });

  });
});
