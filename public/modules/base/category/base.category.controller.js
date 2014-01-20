/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 *
 */
//define(['app', 'ep', 'eventbus', 'category.models', 'category.views', 'text!modules/base/category/base.category.templates.html', 'pace'],
//  function (App, ep, EventBus, Model, View, template, pace) {
define(function (require) {
    var App = require('app'),
        ep = require('ep'),
        EventBus = require('eventbus'),
        pace = require('pace'),
        Model = require('category.models'),
        View = require('category.views'),
        template = require('text!modules/base/category/base.category.templates.html');

    $('#TemplateContainer').append(template);
    _.templateSettings.variable = 'E';

    /*
     *
     * DEFAULT VIEW
     *
     *
     */
    var defaultView = function (hrefObj) {
      pace.start();
      var categoryLayout = new View.DefaultView();
      var categoryModel = new Model.CategoryModel();


      var href = hrefObj.href;
      var pageHref = hrefObj.pageHref;

      categoryModel.fetch({
        url: categoryModel.getUrl(href),
        success: function (response) {
          categoryLayout.categoryTitleRegion.show(
            new View.CategoryTitleView({
              model: categoryModel
            })
          );

          if (!pageHref) {
            pageHref = response.get('itemLink');
          }

          var reqObj = {
            fetchHref: pageHref,
            categoryHref: response.get('href')
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
        url: categoryItemModel.getUrl(reqObj.fetchHref),
        success: function (itemResponse) {
          var paginationModel = new Model.CategoryPaginationModel(itemResponse.get('pagination'));
          paginationModel.set('categoryHref', reqObj.categoryHref);

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
    EventBus.on('category.paginationBtnClicked', function (direction, link) {
      ep.logger.info(direction + ' btn clicked.');

      EventBus.trigger('category.reloadCategoryViewsRequest', link);

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
