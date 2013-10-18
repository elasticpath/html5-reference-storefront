/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 05/04/13
 * Time: 1:31 PM
 *
 */
define(['app', 'ep', 'eventbus', 'ext.category.models', 'ext.category.views', 'text!modules/ext/category/ext.category.templates.html', 'text!modules/base/category/base.category.templates.html', 'pace'],
  function (App, ep, EventBus, Model, View, template, baseTemplate, pace) {

    $('#TemplateContainer').append(template);
    $('#TemplateContainer').append(baseTemplate);

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

    // Add to Cart
    EventBus.on('category.addToCartBtnClicked', function (formDataObj) {
      EventBus.trigger('category.submitAddToCartFormRequest', formDataObj);
    });

    EventBus.on('category.submitAddToCartFormRequest', function (formDataObj) {
     submitAddToCartForm(formDataObj);
    });

    EventBus.on('category.loadDefaultCartRequest', function () {
      var test = 'test';
      // request cart data from Coretext
      document.location.href = '/#mycart';
      // render cart view in main nav
    });

    var submitAddToCartForm = function(formDataObj) {
      var formActionLink = formDataObj.actionLink;
      var qty = formDataObj.qty;

      if (formActionLink) {
        if (qty > 0) {

          var obj = '{quantity:' + qty + '}';
          ep.io.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: formActionLink,
            data: obj,
            success: function (response, x, y) {
              // follow link response
              ep.logger.info('Success posting to cart - go to cart view');

              // get the location header
              ep.logger.info(response);
              // ep.logger.info(request);
              ep.logger.info(JSON.stringify(y));
              var lineItemUrl = y.getResponseHeader('Location');
              ep.logger.info(lineItemUrl);
              if (lineItemUrl) {
                EventBus.trigger('category.loadDefaultCartRequest');
              }
              else {
                ep.logger.warn('add to cart success but no cart url returned');
              }


              ep.logger.info('we are done load the cart view');


            },
            error: function (response) {
              ep.logger.error('error posting item to cart: ' + response);
            }
          });

        }
        else {
          ep.logger.warn('add to cart called with no quantity');
        }

      }
    };

    return {
      DefaultView: defaultView
    };
  }
);
