/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 05/04/13
 * Time: 1:31 PM
 *
 */
define(['app', 'ep', 'eventbus', 'category.models', 'ext.category.views', 'text!modules/category/ext.category.templates.html', 'pace'],
  function (App, ep, EventBus, Model, View, template, pace) {

    $('#TemplateContainer').append(template);
    _.templateSettings.variable = 'E';

    /*
     *
     * DEFAULT VIEW
     *
     *
     */
    var defaultView = function (uriObj) {
      pace.start();
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
    EventBus.on('category.fetchCategoryItemPageModelRequest', function (reqObj) {
      pace.start();
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
          ep.app.categoryPaginationBottomRegion.show(paginationBottomView);
          ep.app.categoryBrowseRegion.show(
            new View.CategoryItemCollectionView({
              collection: new Model.CategoryItemCollectionModel(itemResponse.attributes.itemCollection)
            })
          );
        },
        error: function (response) {
          ep.logger.error('error fetch category items model ' + response);
        }
      });
    });

    // pagination btn is clicked
    EventBus.on('category.paginationBtnClicked', function (direction, uri) {
      ep.logger.info(direction + ' btn clicked.');

      EventBus.trigger('category.reloadCategoryViewsRequest', uri);

    });

    // Hide pagination regions when empty collection rendered
    EventBus.on('category.emptyCollectionRendered', function () {
      View.HidePaginationRegion();
      pace.stop();
    });

    return {
      DefaultView: defaultView
    };
  }
);
