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

          /*
           *  Declare Models
           */
          var tempModelObj;

          tempModelObj = new Model.CategoryPaginationModel();
          var paginationModel = new Model.CategoryPaginationModel(tempModelObj.parse(response.attributes.pagination));

          tempModelObj = new Model.CategoryItemCollectionModel();
          var itemCollectionModel = new Model.CategoryItemCollectionModel(tempModelObj.parse(response.attributes.itemCollection));

          /*
           * Render Views in Regions
           */
          categoryLayout.categoryTitleRegion.show(
            new View.CategoryTitleView({
              model: categoryModel
            }));
          categoryLayout.categoryPaginationTopRegion.show(
            new View.CategoryPaginationView({
              model: paginationModel
            })
          );
          categoryLayout.categoryBrowseRegion.show(
            new View.CategoryItemCollectionView({
              collection: itemCollectionModel
            })
          );
          categoryLayout.categoryPaginationBottomRegion.show(
            new View.CategoryPaginationView({
              model: paginationModel
            })
          );
        },
        error: function (response) {
          ep.logger.error('error fetch category model ' + response)
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
/*
    EventBus.on('category.paginationBtnClicked', function (direction, uri) {
      EventBus.trigger('category.reloadCategoryViewsRequest', direction, uri);

    });
*/
    EventBus.on('category.loadCategoryViewRequest', function (direction, uri) {
      ep.logger.info('navigation to ' + direction + ' page');

      var browseRegion = new Backbone.Marionette.Region({
        el: '#categoryBrowseRegion'
      });
      var paginationTopRegion = new Backbone.Marionette.Region({
        el: '#categoryPaginationTopRegion'
      });
      var paginationBottomRegion = new Backbone.Marionette.Region({
        el: '#categoryPaginationBottomRegion'
      });
      var categoryModel = new Model.CategoryModel('zoom');

      categoryModel.fetch({
        url: ep.ui.decodeUri(uri) + categoryModel.zoom,
        success: function (response) {
          browseRegion.show( categoryBrowseView(response) );
          paginationTopRegion.show(
            new View.CategoryPaginationView({
              model: new Model.CategoryPaginationModel(response.attributes.pagination)
            })
          );
          paginationBottomRegion.show(
            new View.CategoryPaginationView({
              model: new Model.CategoryPaginationModel(response.attributes.pagination)
            })
          );
        }
      });

      ep.logger.info('category browse refreshed.');
    });

    var categoryBrowseView = function(model) {
      return new View.CategoryItemCollectionView({
        collection: new Model.CategoryItemCollectionModel(model.attributes.itemCollection)
      });
    };

    return {
      DefaultView: defaultView
    };
  }
);
