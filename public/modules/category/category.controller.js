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
    var LocalBus = new Backbone.Wreqr.EventAggregator();

    _.templateSettings.variable = 'E';

    /*
     *
     *
     * Nav Data Request Success Handler
     *
     * */
    EventBus.bind('category.navDataRequestSuccess', function (response, uriForResponse, event) {
      // write the output to the target
      var elementArray = [];
      var childArray = [];
      var itemsArray = [];
      var itemArray = [];
      var otherArray = [];
      var linkCount = response.links.length;
      for (var i = 0; i < linkCount; i++) {
        switch (response.links[i].rel) {
          case 'element':
            elementArray.push(response.links[i]);
            break;
          case 'child':
            childArray.push(response.links[i]);
            break;
          case 'items':
            itemsArray.push(response.links[i]);
            break;
          case 'item':
            itemArray.push(response.links[i]);
            break;
          default:
            otherArray.push(response.links[i]);
        }
      }


      /*
       *
       * Child layout
       *
       * */
      var childListLayout = new View.RelItemLayout({
        model: new Model.ChildItemLayoutModel({catName: response.name})
      }).render();
      /*
       *
       *   Element Rel ChildRelView
       *
       * */
      var elementView = new View.ChildRelView({
        model: new Model.RelModel({name: 'Element', count: elementArray.length}),
        collection: new Model.LinkCollection(elementArray)
      });
      childListLayout.elementRegion.show(elementView);

      /*
       *
       *   Child Rel ChildRelView
       *
       * */
      var childView = new View.ChildRelView({
        model: new Model.RelModel({name: 'Child', count: childArray.length}),
        collection: new Model.LinkCollection(childArray)
      });
      childListLayout.childRegion.show(childView);

      /*
       *
       *   Items Rels ChildRelView
       *
       * */
      var itemsModel = new Model.LinkCollection(itemsArray);
      var itemsView = new View.ChildRelView({
        model: new Model.RelModel({name: 'Items', count: itemsArray.length}),
        collection: itemsModel
      });
      childListLayout.itemsRegion.show(itemsView);
      /*
       *
       *   Item Rels ChildRelView
       *
       * */
      var itemView = new View.ChildRelView({
        model: new Model.RelModel({name: 'Item', count: itemArray.length}),
        collection: new Model.LinkCollection(itemArray)
      });
      childListLayout.itemRegion.show(itemView);
      /*
       *
       *   Other Rels ChildRelView
       *
       * */
      var otherView = new View.ChildRelView({
        model: new Model.RelModel({name: 'Other', count: otherArray.length}),
        collection: new Model.LinkCollection(otherArray)
      });
      childListLayout.otherRegion.show(otherView);
      $('span[data-id="' + uriForResponse + '"]').html(childListLayout.el);

    });


    var defaultView = function (uri) {
      var categoryLayout = new View.DefaultView();
      var categoryModel = new Model.CategoryModel();

      categoryModel.fetch({
        url: ep.ui.decodeUri(uri) + '?zoom=items, items:element:price, items:element:rate, items:element:definition, items:element:definition:assets, items:element:availability',
        success: function (response) {

          var itemCollectionView = new View.CategoryItemCollectionView({
            collection: new Model.CategoryItemCollectionModel(response.attributes.itemCollection)
          });

          categoryLayout.categoryTitleRegion.show(
            new View.CategoryTitleView({
              model: categoryModel
            }));
          categoryLayout.categoryPaginationTopRegion.show(
            new View.CategoryPaginationView({
              model: new Model.CategoryPaginationModel(response.attributes.pagination)
            })
          );
          categoryLayout.categoryBrowseRegion.show(itemCollectionView);
          categoryLayout.categoryPaginationBottomRegion.show(
            new View.CategoryPaginationView({
              model: new Model.CategoryPaginationModel(response.attributes.pagination)
            })
          );
        },
        error: function (response) {
          ep.logger.error('error fetch category model ' + response)
        }
      })

      return categoryLayout;
    };

    return {
      DefaultView: defaultView
    };
  }
);
