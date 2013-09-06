/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.

 * User: ama
 * Date: 26/09/05
 * Time: 8:03 PM
 *
 */

define(function(require) {
  describe ('UI Storefront Category Module  ', function () {

    /*
     * Test Category Controller
     */
    describe ('UI Storefront Category Controller', function () {});


    /*
     * Test presence of Category Views and Regions
     */
    describe ('UI Storefront Category View', function () {
      var categoryViews = require('modules/category/category.views');

      describe('DefaultView and Regions', function () {
        var defaultView = new categoryViews.DefaultView();
        it('DefaultView should exist', function () {
          expect(defaultView).to.exist;
        });
        it('DefaultView should have a categoryTitleRegion region', function () {
          expect(defaultView.categoryTitleRegion).to.exist;
        });
        it('DefaultView should have a categoryBrowseRegion region', function () {
          expect(defaultView.categoryBrowseRegion).to.exist;
        });
        it('DefaultView should have a categoryPaginationTopRegion region', function () {
          expect(defaultView.categoryPaginationTopRegion).to.exist;
        });
        it('DefaultView should have a categoryPaginationBottomRegion region', function () {
          expect(defaultView.categoryPaginationBottomRegion).to.exist;
        });
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
      var categoryModel = require('modules/category/category.models');
      it("CategoryModel should exist",function(){
        expect(categoryModel.CategoryModel).to.exist;
      });
    });

    /*
     * Test Events
     */
    describe ('UI Storefront Category Events', function() {
      var EventBus = require('eventbus');
      var templates = require('text!modules/category/category.templates.html');
      var categoryViews = require('modules/category/category.views');
      var categoryModel = require('modules/category/category.models');

      /* Setup Begin*/
      before(function () {
        this.$fixture = $('<div data-region="myTestRegion"></div>');
      });

      beforeEach(function () {
        this.$fixture.empty().appendTo($("#Fixtures"));
        this.$fixture.append(templates);
        this.myTestRegion = new Marionette.Region({
          el: '[data-region="myTestRegion"]'
        });

        this.view = new categoryViews.CategoryPaginationView({
          model: new categoryModel.CategoryModel()
        });
        this.myTestRegion.show(this.view);
      });

      afterEach(function () {
        this.view.model.destroy();
      });

      after(function () {
        $("#Fixtures").empty();
      });
      /* Setup Ends */

      it("Pagination button should exist", function () {
        expect($('.btn-pagination').html()).to.exist;
      });

      it ('Pagination button should trigger category.paginationBtnClicked event', function(done){
        EventBus.on('category.paginationBtnClicked', function(direction) {
          done();
        });
        $('button.btn-pagination').trigger('click');
      });

      it ('category.paginationBtnClicked event should trigger category.loadCategoryViewRequest event', function(done){
        var direction = 'NEXT'; // actual direction does not matter in this test.
        EventBus.on('category.loadCategoryViewRequest', function(direction) {
          done();
        });
        EventBus.trigger('category.paginationBtnClicked', direction);
      });
    });
  });
});