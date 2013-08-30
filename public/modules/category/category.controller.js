/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 05/04/13
 * Time: 1:31 PM
 *
 */
define(['app', 'eventbus', 'modules/category/category.models', 'modules/category/category.views', 'text!modules/category/category.templates.html'],
  function(App, EventBus, Model, View, template){

    $('#TemplateContainer').append(template);
    var LocalBus = new Backbone.Wreqr.EventAggregator();

    _.templateSettings.variable = 'E';

    var init = function(category){
      /*
       *
       * Navigations Entry Point Kick Off
       *
       * */
      EventBus.trigger('io.apiRequest',{
        type:'GET',
        url:'/cortex/navigations/' + ep.app.config.cortexApi.store + '?zoom=element',
        success:function(data,textStatus,response){
          EventBus.trigger('category.getFirstLevelCategoryDataSuccess',data);
        },
        error:function(response){
          log('ERROR from api request: ' + response);
        }
      });
    };



    /*
     *
     *
     * Nav Data Request Success Handler
     *
     * */
    EventBus.bind('category.navDataRequestSuccess',function(response,uriForResponse,event){
      // write the output to the target
      var elementArray = [];
      var childArray = [];
      var itemsArray = [];
      var itemArray = [];
      var otherArray = [];
      var linkCount = response.links.length;
      for (var i = 0;i < linkCount;i++){
        switch (response.links[i].rel){
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
        model:new Model.ChildItemLayoutModel({catName:response.name})
      }).render();
      /*
       *
       *   Element Rel ChildRelView
       *
       * */
      var elementView = new View.ChildRelView({
        model:new Model.RelModel({name:'Element',count:elementArray.length}),
        collection:new Model.LinkCollection(elementArray)
      });
      childListLayout.elementRegion.show(elementView);

      /*
       *
       *   Child Rel ChildRelView
       *
       * */
      var childView = new View.ChildRelView({
        model:new Model.RelModel({name:'Child',count:childArray.length}),
        collection:new Model.LinkCollection(childArray)
      });
      childListLayout.childRegion.show(childView);

      /*
       *
       *   Items Rels ChildRelView
       *
       * */
      var itemsModel = new Model.LinkCollection(itemsArray);
      var itemsView = new View.ChildRelView({
        model:new Model.RelModel({name:'Items',count:itemsArray.length}),
        collection:itemsModel
      });
      childListLayout.itemsRegion.show(itemsView);
      /*
       *
       *   Item Rels ChildRelView
       *
       * */
      var itemView = new View.ChildRelView({
        model:new Model.RelModel({name:'Item',count:itemArray.length}),
        collection:new Model.LinkCollection(itemArray)
      });
      childListLayout.itemRegion.show(itemView);
      /*
       *
       *   Other Rels ChildRelView
       *
       * */
      var otherView = new View.ChildRelView({
        model:new Model.RelModel({name:'Other',count:otherArray.length}),
        collection:new Model.LinkCollection(otherArray)
      });
      childListLayout.otherRegion.show(otherView);
      $('span[data-id="' + uriForResponse + '"]').html(childListLayout.el);

      LocalBus.trigger('category.renderLinkDataSuccess');

    });
    EventBus.bind('category.getFirstLevelCategoryDataSuccess',function(data){
      var linkView = new View.LinksView({
        collection:new Model.LinkCollection(data[':element'])
      });
      App.mainRegion.show(linkView);
      LocalBus.trigger('category.initEventListenersRequest');
    });
    LocalBus.bind('category.renderLinkDataSuccess',function(){
      LocalBus.trigger('category.initEventListenersRequest');
    });
    LocalBus.bind('category.initEventListenersRequest',function(){
      initEventHandlers();
    });
    /*
     *
     * Link IO Processing
     *
     *
     * */
    LocalBus.bind('category.loadLinkDataRequest',function(event){
      var urlToCall = $(event.target).attr('href');
      var uriForResponse = $(event.target).data('uri');
      log('make ajax call to: ' + urlToCall);
      EventBus.trigger('io.apiRequest',{
        type:'GET',
        url:$(event.target).attr('href'),
        success:function(response){
          EventBus.trigger('category.navDataRequestSuccess',response,uriForResponse);
        },
        error:function(response){
          log('error response: ' + response);
        }
      });
    });

    var initEventHandlers = function(){
      $('.link-getdata').click(function(event){
        event.preventDefault();
        log('||=||  - clicked link to get more data: ' + $(event.target).attr('href'));
        LocalBus.trigger('category.loadLinkDataRequest',event);
      })
    };


    return {
      init:init
    };
  }
);
