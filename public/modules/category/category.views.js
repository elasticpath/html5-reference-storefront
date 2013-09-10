/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 05/04/13
 * Time: 1:32 PM
 *
 */
define(['i18n'],
  function (i18n) {

    var viewHelpers = {
      getI18nLabel: function (key) {
        var retVal = key;
        try {
          retVal = i18n.t(key);
        }
        catch (e) {
          // slient failure on label rendering
        }

        return retVal;
      }
    };

    /*
     * Default Layout View:
     */
    var defaultLayout = Backbone.Marionette.Layout.extend({
      template: '#DefaultCategoryLayoutTemplate',
      regions: {
        categoryTitleRegion: '[data-region="categoryTitleRegion"]',
        categoryBrowseRegion: '[data-region="categoryBrowseRegion"]',
        categoryPaginationTopRegion: '[data-region="categoryPaginationTopRegion"]',
        categoryPaginationBottomRegion: '[data-region="categoryPaginationBottomRegion"]'
      }
    });

    /*
     * Category Title View
     */
    var categoryTitleView = Backbone.Marionette.ItemView.extend({
      template: '#CategoryTitleTemplate'
    });

    /*
     * Category Browse Views
     */
    // Category Item View
    var categoryItemView = Backbone.Marionette.ItemView.extend({
      template: '#CategoryItemTemplate',
      templateHelpers: viewHelpers,
      className: 'category-item-container'
    });

    // Category Item Collection Empty View
    var categoryItemCollectionEmptyView = Backbone.Marionette.ItemView.extend({
      template: '#CategoryItemCollectionEmptyTemplate',
      templateHelpers: viewHelpers
    });

    // Category Item Collection View
    var categoryItemCollectionView = Backbone.Marionette.CollectionView.extend({
      itemView: categoryItemView,
      emptyView: categoryItemCollectionEmptyView
    });

    /*
     * Category Pagination View
     */
    var categoryPaginationView = Backbone.Marionette.ItemView.extend({
      template: '#CategoryPaginationTemplate',
      templateHelpers: viewHelpers,
      className: 'pagination-container'
    });

    return {
      DefaultView: defaultLayout,
      CategoryTitleView: categoryTitleView,
      CategoryItemCollectionView: categoryItemCollectionView,
      CategoryItemView: categoryItemView,
      CategoryPaginationView: categoryPaginationView
    };
  });
