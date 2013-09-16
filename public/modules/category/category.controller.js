/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 05/04/13
 * Time: 1:31 PM
 *
 */
define(['app', 'ep', 'eventbus', 'modules/category/category.models', 'modules/category/category.views', 'text!modules/category/category.templates.html'],
  function (App, ep, EventBus, Model, View, template) {

    $('#TemplateContainer').append(template);
    _.templateSettings.variable = 'E';

    /*
     *
     * DEFAULT VIEW
     *
     *
     */
    var defaultView = function (uri) {
      var categoryLayout = new View.DefaultView();
      var categoryModel = new Model.CategoryModel('zoom');

      categoryModel.fetch({
        url: ep.ui.decodeUri(uri) + categoryModel.zoom,
        success: function (response) {

          categoryLayout.categoryTitleRegion.show(
            new View.CategoryTitleView({
              model: categoryModel
            }));
          categoryLayout.categoryPaginationTopRegion.show( getCategoryPaginationView(response) );
          categoryLayout.categoryBrowseRegion.show( getCategoryBrowseView(response) );
          categoryLayout.categoryPaginationBottomRegion.show( getCategoryPaginationView(response) );
        },
        error: function (response) {
          ep.logger.error('error fetch category model ' + response);
        }
      });

      return categoryLayout;
    };




    /*
     *
     *
     * EVENT LISTENERS
     *
     *
     */
    EventBus.on('category.paginationBtnClicked', function (direction, uri) {
      ep.logger.info(direction + ' btn clicked.');

      EventBus.trigger('category.reloadCategoryViewsRequest', uri);

    });
    EventBus.on('category.reloadCategoryViewsRequest', function (uri) {
      ep.logger.info('navigation to a different page');

      // declare regions
      var browseRegion = new Backbone.Marionette.Region({
        el: '[data-region="categoryBrowseRegion"]'
      });
      var paginationTopRegion = new Backbone.Marionette.Region({
        el: '[data-region="categoryPaginationTopRegion"]'
      });
      var paginationBottomRegion = new Backbone.Marionette.Region({
        el: '[data-region="categoryPaginationBottomRegion"]'
      });

      // reload views
      var categoryModel = new Model.CategoryModel('paginationZoom');
      categoryModel.fetch({
        url: ep.app.config.cortexApi.path + uri + categoryModel.paginationZoom,
        success: function (response) {
          browseRegion.show( getCategoryBrowseView(response) );
          paginationTopRegion.show( getCategoryPaginationView(response) );
          paginationBottomRegion.show( getCategoryPaginationView(response) );
        }
      });

      ep.logger.info('category browse refreshed.');
    });

    EventBus.on('category.emptyCollectionRendered', function() {
      View.HidePaginationRegion();
    });




    /*
     *
     *
     * FUNCTIONS
     *
     */
    var getCategoryBrowseView = function(model) {
      return new View.CategoryItemCollectionView({
        collection: new Model.CategoryItemCollectionModel(model.attributes.itemCollection)
      });
    };

    var getCategoryPaginationView = function(model) {
      return new View.CategoryPaginationView({
        model: new Model.CategoryPaginationModel(model.attributes.pagination)
      });
    };

    return {
      DefaultView: defaultView
    };
  }
);
