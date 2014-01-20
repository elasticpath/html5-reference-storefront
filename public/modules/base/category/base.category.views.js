/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 *
 */
define(function(require) {
  var ep = require('ep')
  var i18n = require('i18n');
  var pace = require('pace');
  var equalize = require('equalize');
  var EventBus = require('eventbus');
  var Backbone = require('backbone');

  var viewHelpers = {
      getI18nLabel: function (key) {
        // segmented localization e.g. page n of n not well handled
        // in future, needs to look into more elegant solution that
        // taking multiple parameters, and accessed with 1 key
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
          retVar = 'images/img-placeholder-noborder.png';
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
        var retVar = '';

        if (priceObj) {
          if (priceObj.listed && priceObj.listed.display) {
            retVar = priceObj.listed.display;
          }
        }

        return retVar;
      },
      getPurchasePrice: function (priceObj) {
        var retVar = '';

        if (priceObj) {
          if (priceObj.purchase && priceObj.purchase.amount >= 0) {
            retVar = priceObj.purchase.display;
          }
          else {
            retVar = this.getI18nLabel('itemDetail.noPrice');
          }
        }

        return retVar;
      },
      generateItemHref: function (href) {
        var retVar;
        if (href) {
          retVar = ep.app.config.routes.itemDetail + '/' + ep.ui.encodeUri(href);
        } else {
          retVar = '';
          ep.logger.warn('[category browse]: unable to generate href to item-detail');
        }

        return retVar;
      },
      generatePaginationLink: function(href, pageHref) {
        var html = '';

        if (href && pageHref) {
          var link = ep.app.config.routes.category + '/' + ep.ui.encodeUri(href) + '/' + ep.ui.encodeUri(pageHref);
          html = 'href="' + link + '"';
        }

        return html;
      },
      checkForDisabledPaginationBtn: function (link) {
        if (!link) {
          return 'pagination-link-disabled';
        }
      }
    };

    /*
     * Default Layout View:
     */
    var defaultLayout = Backbone.Marionette.Layout.extend({
      template: '#CategoryDefaultLayoutTemplate',
      regions: {
        categoryTitleRegion: '[data-region="categoryTitleRegion"]'
      },
      className: 'category-items-container container',
      onShow: function () {
        ep.app.addRegions({
          categoryBrowseRegion: '[data-region="categoryBrowseRegion"]',
          categoryPaginationTopRegion: '[data-region="categoryPaginationTopRegion"]',
          categoryPaginationBottomRegion: '[data-region="categoryPaginationBottomRegion"]'
        });

      }
    });

    /*
     * Category Title View
     */
    var categoryTitleView = Backbone.Marionette.ItemView.extend({
      template: '#CategoryTitleTemplate'
    });

    /*
     * Category Pagination View
     */
    var categoryPaginationView = Backbone.Marionette.ItemView.extend({
      template: '#CategoryPaginationTemplate',
      templateHelpers: viewHelpers,
      className: 'pagination-container'
    });


    /*
     *
     * Category Browse Views
     */
    // Category Item Collection Empty View
    var categoryItemCollectionEmptyView = Backbone.Marionette.ItemView.extend({
      template: '#CategoryItemCollectionEmptyTemplate',
      templateHelpers: viewHelpers,
      onShow: function () {
        EventBus.trigger('category.emptyCollectionRendered');
      }
    });

    // Category Item View
    var categoryItemView = Backbone.Marionette.ItemView.extend({
      template: '#CategoryItemTemplate',
      templateHelpers: viewHelpers,
      className: 'category-item-container',
      tagName: 'li',
      onShow: function () {

        // show price
        var priceRegion = new Backbone.Marionette.Region({
          el: $('[data-region="priceRegion"]', this.el)
        });
        priceRegion.show(
          new itemPriceLayout({
            model: new Backbone.Model({
              price: this.model.attributes.price,
              rateCollection: this.model.attributes.rateCollection
            })
          })
        );


        // show availability if at least has availability state
        if (this.model.get('availability').state) {
          var availabilityRegion = new Backbone.Marionette.Region({
            el: $('[data-region="availabilityRegion"]', this.el)
          });
          availabilityRegion.show(
            new itemAvailabilityView({
              model: new Backbone.Model(this.model.get('availability'))
            })
          );
        }
      }
    });

    // Item Availability
    var itemAvailabilityView = Backbone.Marionette.ItemView.extend({
      template: '#CategoryItemAvailabilityTemplate',
      templateHelpers: viewHelpers,
      tagName: 'ul',
      className: 'category-item-availability-container',
      onShow: function () {
        // if no release date, hide dom element with release-date & the label
        if (!viewHelpers.getAvailabilityReleaseDate(this.model.get('releaseDate'))) {
          $('[data-region="itemAvailabilityDescriptionRegion"]', this.el).addClass('is-hidden');
        }
      }
    });

    //
    // price master view
    //
    var itemPriceLayout = Backbone.Marionette.Layout.extend({
      template: '#CategoryItemPriceMasterViewTemplate',
      regions: {
        itemPriceRegion: $('[data-region="itemPriceRegion"]', this.el),
        itemRateRegion: $('[data-region="itemRateRegion"]', this.el)
      },
      onShow: function () {
        // if item has rate, load rate view
        if (this.model.attributes.rateCollection.length > 0) {
          this.itemRateRegion.show(
            new itemRateCollectionView({
              collection: new Backbone.Collection(this.model.attributes.rateCollection)
            })
          );
        }

        // if item has one-time purchase price, load price view
        if (this.model.get('price').purchase.display) {
          this.itemPriceRegion.show(
            new itemPriceView({
              model: new Backbone.Model(this.model.attributes.price)
            })
          );
        }

        // no price nor rate scenario is handled at model level
        // an item price object is created with artificial display value
      }
    });

    // Item Price View
    var itemPriceView = Backbone.Marionette.ItemView.extend({
      template: '#CategoryItemPriceTemplate',
      templateHelpers: viewHelpers,
      tagName: 'ul',
      className: 'category-item-price-container',
      onShow: function () {
        if (!viewHelpers.getListPrice(this.model.attributes)) {
          $('[data-region="itemListPriceRegion"]', this.el).addClass('is-hidden');
        }

      }
    });

    // Item Rate ItemView
    var itemRateItemView = Backbone.Marionette.ItemView.extend({
      template: '#CategoryItemRateTemplate',
      templateHelpers: viewHelpers,
      tagName: 'li'
    });

    // Item Rate CollectionView
    var itemRateCollectionView = Backbone.Marionette.CollectionView.extend({
      itemView: itemRateItemView,
      tagName: 'ul',
      className: 'category-item-rate-container'
    });


    // Category Item Collection View
    var categoryItemCollectionView = Backbone.Marionette.CollectionView.extend({
      itemView: categoryItemView,
      emptyView: categoryItemCollectionEmptyView,
      tagName: 'ul',
      className: 'category-items-listing equalize',
      onShow:function(){
        pace.stop();

        // setup function to encapsulate all element height-matching calls
        var matchHeights = function(){
          $('.category-item-title').equalHeights();
          $('.category-item-inner').equalHeights();
          $('.category-item-price-container').equalHeights();
        }
       // setTimeout(function(){matchHeights();},1000);
        matchHeights();


        // run height-matching function on window resize
        $(window).resize(
          function(){
            matchHeights();
          }
        );

      }
    });


    /*
     *
     * FUNCTIONS
     */
    var hidePaginationRegion = function() {
      $('[data-region="categoryPaginationBottomRegion"]').hide();
      $('[data-region="categoryPaginationTopRegion"]').hide();
    };

    return {
      DefaultView: defaultLayout,
      CategoryTitleView: categoryTitleView,
      CategoryItemCollectionView: categoryItemCollectionView,
      CategoryItemView: categoryItemView,
      CategoryPaginationView: categoryPaginationView,
      HidePaginationRegion:hidePaginationRegion
    };
  });
