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
    var defaultView = function (uriObj) {
      var categoryLayout = new View.DefaultView();
      var categoryModel = new Model.CategoryModel();


      var uri = uriObj.uri;
      var pageUri = uriObj.pageUri;

      categoryModel.fetch({
        url: categoryModel.getUrl(uri),
        success: function (response) {
          categoryLayout.categoryTitleRegion.show(
            new View.CategoryTitleView({
              model: categoryModel
            })
          );

          if (!pageUri) {
            pageUri = response.attributes.itemUri;
          }

          var reqObj = {
            fetchUri: pageUri,
            categoryUri: response.attributes.uri
          };

          EventBus.trigger('category.fetchCategoryItemPageModelRequest', reqObj);

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
    EventBus.on('category.fetchCategoryItemPageModelRequest', function(reqObj) {
      var categoryItemModel = new Model.CategoryItemPageModel();
      categoryItemModel.fetch({
        url: categoryItemModel.getUrl(reqObj.fetchUri),
        success: function (itemResponse) {
          var paginationModel = new Model.CategoryPaginationModel(itemResponse.attributes.pagination);
          paginationModel.set('categoryUri', reqObj.categoryUri);

          var paginationTopView = new View.CategoryPaginationView({
            model: paginationModel
          });
          var paginationBottomView = new View.CategoryPaginationView({
            model: paginationModel
          });

          ep.app.categoryPaginationTopRegion.show(paginationTopView);
          ep.app.categoryBrowseRegion.show(
            new View.CategoryItemCollectionView({
              collection: new Model.CategoryItemCollectionModel(itemResponse.attributes.itemCollection)
            })
          );
          ep.app.categoryPaginationBottomRegion.show(paginationBottomView);
        },
        error: function (response) {
          ep.logger.error('error fetch category items model ' + response);
        }
      });
    });

    // Hide pagination regions when empty collection rendered
    EventBus.on('category.emptyCollectionRendered', function () {
      View.HidePaginationRegion();
    });

    return {
      DefaultView: defaultView
    };
  }
);
