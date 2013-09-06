/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 05/04/13
 * Time: 1:32 PM
 *
 */
define(['marionette'],function(Marionette){

  var viewHelper = {

  };

  /*
   * Default Layout View:
   */
  var defaultLayout = Backbone.Marionette.Layout.extend({
    template:'#DefaultCategoryLayoutTemplate',
    regions:{
      categoryTitleRegion:'[data-region="categoryTitleRegion"]',
      categoryBrowseRegion:'[data-region="categoryBrowseRegion"]',
      categoryPaginationTopRegion:'[data-region="categoryPaginationTopRegion"]',
      categoryPaginationBottomRegion:'[data-region="categoryPaginationBottomRegion"]'
    }
  });


  /*
   * Category Title View
   */
  var categoryTitleView = Backbone.Marionette.ItemView.extend({
    template:'#CategoryTitleTemplate'
  });

  /*
   * Category Item Collection View
   */
  var categoryItemCollectionView = Marionette.CollectionView.extend({
    itemView:categoryItemView,
    emptyView:categoryItemCollectionEmptyView
  });

  /* Category Item View */
  var categoryItemView = Backbone.Marionette.ItemView.extend({
    template:'#CategoryItemTemplate',
    templateHelper:viewHelper,
    className:'category-item-container'
  });

  /* Category Item Collection Empty View */
  var categoryItemCollectionEmptyView = Backbone.Marionette.ItemView.extend({
    template:'#CategoryItemCollectionEmptyTemplate'
  });

  /*
   * Category Pagination View
   */
  var categoryPaginationView = Backbone.Marionette.ItemView.extend({
    template:'#CategoryPaginationTemplate',
    templateHelper:viewHelper,
    className:'pagination-container'
  });

  return {
    DefaultView:defaultLayout,
    CategoryTitleView:categoryTitleView,
    CategoryItemCollectionView:categoryItemCollectionView,
    CategoryItemView:categoryItemView,
    CategoryItemView:categoryItemView,
    CategoryPaginationView: categoryPaginationView
  };
});
