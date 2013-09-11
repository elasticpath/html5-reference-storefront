/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 05/04/13
 * Time: 1:32 PM
 *
 */
define(['ep', 'i18n'],
  function (ep, i18n) {

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
      },
      getDefaultImagePath: function (thumbnail) {
        var retVar;
        if (thumbnail && thumbnail.absolutePath) {
          retVar = thumbnail.absolutePath;
        }
        else {
          retVar = '/images/img-placeholder.png';
        }
        return retVar;
      },
      getDefaultImageName: function (thumbnail) {
        var retVar;
        if (thumbnail && thumbnail.name) {
          retVar = thumbnail.name;
        }
        else {
          retVar = this.getI18nLabel('itemDetail.noImgLabel');
        }
        return retVar;
      },
      getAvailabilityDisplayText: function (availability) {
        var retVal = '';
        switch (availability) {
          case 'AVAILABLE':
            retVal = this.getI18nLabel('availability.AVAILABLE');
            break;
          case 'ALWAYS':
            retVal = this.getI18nLabel('availability.ALWAYS');
            break;
          case 'NOT_AVAILABLE':
            retVal = this.getI18nLabel('availability.NOT_AVAILABLE');
            break;
          case 'AVAILABLE_FOR_BACK_ORDER':
            retVal = this.getI18nLabel('availability.AVAILABLE_FOR_BACK_ORDER');
            break;
          case 'AVAILABLE_FOR_PRE_ORDER':
            retVal = this.getI18nLabel('availability.AVAILABLE_FOR_PRE_ORDER');
            break;
          default:
            retVal = '';
        }
        return retVal;
      },
      getAvailabilityReleaseDate: function (releaseDate) {
        var retVar = '';

        if (releaseDate && releaseDate.displayValue) {
          retVar = releaseDate.displayValue;
        }

        return retVar;
      },
      getListPrice: function (priceObj) {
        var retVar;

        if (priceObj.listed && priceObj.listed.display) {
          retVar = priceObj.listed.display;
        }
        else {
          retVar = '';
        }

        return retVar;
      },
      getPurchasePrice:function(priceObj){
        var retVar;

        if (priceObj.purchase && priceObj.purchase.display){
          retVar = priceObj.purchase.display;
        }
        else{
          retVar = '';
        }

        return retVar;
      },
      generateItemHref: function (uri) {
        var retVar;
        var uriCruft = '/items/' + ep.app.config.cortexApi.scope + '/';
        if (uri && uri.indexOf(uriCruft) > -1) {
          retVar = ep.app.config.routes.itemDetail + '/' + uri.substring(uriCruft.length, uri.length);
        } else {
          retVar = '';
          ep.logger.warn('[category browse]: unable to generate href to item-detail');
        }

        return retVar;
      },
      checkForDisabledPaginationBtn: function (model) {
        return 'disabled';
      }
    };

    /*
     * Default Layout View:
     */
    var defaultLayout = Backbone.Marionette.Layout.extend({
      template: '#CategoryDefaultLayoutTemplate',
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
      className: 'category-item-container',
      onShow: function () {
        // check if there is releaseDate in model
        // if so inject view to display availability release date
        if (viewHelpers.getAvailabilityReleaseDate(this.model.attributes.availability.releaseDate)) {
          var childReleaseDateView = new categoryItemReleaseDateView({
            model: this.model
          });
          childReleaseDateView.render();
          $('li[data-region="categoryItemReleaseDateRegion"]', this.el).html(childReleaseDateView.el);
        }
        else {
          $('li[data-region="categoryItemReleaseDateRegion"]', this.el).hide();
        }

        // check if there is list price data (unit price or total price)
        // if so inject view to display list price
        if (viewHelpers.getListPrice(this.model.attributes.price)){
          var childListPriceView = new categoryItemListPriceView({
            model:this.model
          });

          childListPriceView.render();

          $('li[data-region="categoryItemListPriceRegion"]', this.el).html(childListPriceView.el);
        } else {
          $('li[data-region="categoryItemListPriceRegion"]', this.el).hide();
        }
      }
    });

    // Category Item Collection Empty View
    var categoryItemListPriceView = Backbone.Marionette.ItemView.extend({
      template: '#CategoryItemListPriceTemplate',
      templateHelpers: viewHelpers
    });

    // Category Item Collection Empty View
    var categoryItemReleaseDateView = Backbone.Marionette.ItemView.extend({
      template: '#CategoryItemReleaseDateTemplate',
      templateHelpers: viewHelpers
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
