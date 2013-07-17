/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 * 
 */
define(['ep', 'app', 'eventbus', 'cortex', 'modules/ia/ia.models', 'modules/ia/ia.views', 'text!modules/ia/ia.templates.html','contextmenu','modalwin'],
  function(ep, App, EventBus, Cortex, Model, View, template){

    var currentCategoryName;

    $('#TemplateContainer').append(template);

    _.templateSettings.variable = 'E';

    // set default render mode for main nav
    var currentMainNavDisplayCompactSetting = true;

    var mainNavInitialized = false;

    var displayModeFull = true;


    /*
    *
    *
    * MAIN NAV VIEW
    *
    *
    * */
    var MainNavView = function(){



      var mainNavCollection = new  Model.MainNavCollection();

      var mainNavView = new View.MainNavView({
        collection:mainNavCollection,
        model:new Backbone.Model({compactDisplay:currentMainNavDisplayCompactSetting})

      });

      mainNavCollection.fetch({
        url: '/' + ep.app.cortexApi.path + '/navigations/' + ep.app.cortexApi.store + '?zoom=element',
        success: function(response){},
        error:function(response){
          //clearInterval(timer);
         // ep.logger.error('Error retrieving main nav data time:' + seconds + ' seconds');
          ep.logger.error('Warning: unable to fetch main nav model from Cortex: ' + JSON.stringify(response));

        }

      });

      /*
      *
      * Context menu
      * */
      var contextTrigger = 'right';
      if (ep.ui.touchEnabled()){
        contextTrigger = 'hold';
      }
      $('.main-nav-container').contextmenu({
          'preferences':preferences
        },
        contextTrigger
      );






      return mainNavView;
    };
    /*
     *
     *    BROWSE CATEGORY VIEW
     *
     *
     * */
    var BrowseCategoryView = function(category){

      var browseCategoryLayout = new View.BrowseCategoryLayout({
        model: new Model.BrowseCategoryLayout({
          title:category || ''
        })
      });

      if (category){
        // for access outside this method
        currentCategoryName = category;

        ep.logger.info('CATEGORY:  ' + currentCategoryName);
        browseCategoryLayout.on('show',function(){
          if (category){
            // main nav may not be initialized yet so check and
            // ensure it is kicked off before proceding since we need the
            // top level node strcuture to render the child views
            if (mainNavInitialized){
              EventBus.trigger('ia.renderBrowseCategoryRequest');
            }
            else{
              ep.logger.warn('tried to load sub category but Main Nav is not initialized');
              EventBus.bind('ia.mainNavNodesLoadSuccess',function(){
                EventBus.trigger('ia.renderBrowseCategoryRequest');
              });
            }
          }
        });


      }
      else{
        ep.logger.warn('no category name supplied to BrowseCategoryView method');
      }
      return browseCategoryLayout;
    };
    /*
     *
     * Functions
     *
     * */
    /*
     *
     * Main Nav Component Rendering Preference
     *
     * */
    function preferences(){

      var isDirty = false;
      if (localStorage.getItem('epUserPrefs')){
        epUserPrefs = JSON.parse(localStorage.getItem('epUserPrefs'));
        if (epUserPrefs.prefMainNavDisplayCompact){
          currentMainNavDisplayCompactSetting = epUserPrefs.prefMainNavDisplayCompact;
        }
      }
      var modalRegion = new Marionette.Region({
        el: "#modal",

        onShow:function(){
          this.showModal(this);
        },

        getEl: function(selector){
          var $el = $(selector);
          $el.on("hidden", this.close);
          return $el;
        },

        showModal: function(view){
          view.on("close", this.hideModal, this);
          var $modalEl = $("#modal");
          $modalEl.modal({overlayClose:true});
          //this.$el.modal({overlayClose:true});
        },

        hideModal: function(){
          this.$el.modal('hide');
        }
      });
      ep.logger.info('preferences clicked');
      var view = new View.MainNavPreferencesView();
      view.on('show',function(){
        if (currentMainNavDisplayCompactSetting){
          $('#PrefMainNavDisplayType').attr('checked','checked');
        }
      });
      var $modalEl = $("#modal");
      $modalEl.modal({overlayClose:true});
      modalRegion.show(view);
      // $modalEl.modal({overlayClose:true});
      $('#PrefMainNavDisplayTypeSave').click(function(event){

        // save the preference
        var preCompactDisplay = $('#PrefMainNavDisplayType').is(':checked');
        var epUserPrefs = {};
        if (localStorage.getItem('epUserPrefs')){
          epUserPrefs = JSON.parse(localStorage.getItem('epUserPrefs'));
        }
        epUserPrefs.prefMainNavDisplayCompact = preCompactDisplay;
        localStorage.setItem('epUserPrefs',JSON.stringify(epUserPrefs));
        // close the window
        // repaint the nav component

        EventBus.trigger('ia.reloadMainNavRequest');
        $.modal.close();

      });
    }



    /*
    *
    *  Event Bindings
    *
    * */
    // Reload Main Nav Request
    EventBus.bind('ia.reloadMainNavRequest',function(){
      // load main nav
      EventBus.trigger('layout.loadRegionContentRequest',{
        region:'mainNavRegion',
        module:'ia',
        view:'MainNavView'
      });
    });

    // Render Browse Category Request
    EventBus.bind('ia.renderBrowseCategoryRequest',function renderBrowseCategory(){
      var subCategoryNavCollection = new Model.BrowseCategoryCollection();
      var itemListCollection = new Model.BrowseItemCollection();


      var mainNavNodes = Model.MainNavNodeCollection;

      // work around due to the fact there is no direct way to get
      // reference to category from nam via Cortex (yet)
      var targetParentNode;
      for (var i = 0;i < mainNavNodes.nodes.length;i++){
        if (mainNavNodes.nodes[i].name.toLowerCase() === currentCategoryName){
          targetParentNode = mainNavNodes.nodes[i];
          break;

        }
      }
      // Sub Category Navigation View
      subCategoryNavCollection.fetch({
        url:targetParentNode.href + '?zoom=child',
        success:function(response){
          ep.logger.info('sub cat response: ' + response);
          // declare view
          // assign collection
          // declare target child regions
          var subCategoryNavRegion = new Marionette.Region({
            el:'div[data-region="categoryRegion"]'
          });
          var subCatView = new View.BrowseCategoryList({
            collection:response
          });
          subCategoryNavRegion.show(subCatView);
        },
        error:function(response){
          EventBus.trigger('log.error','error getting sub category navigation collection: ' + response)
        }
      });

      // Product Item List View
      itemListCollection.fetch({
        //url:targetParentNode.itemsHref[0].href + '?zoom=element:price,element:availability,element:definition,element:definition:assets:element',
        url:targetParentNode.itemsHref[0].href + '?zoom=element,element:definition:item,element:price,element:definition',
        success:function(response){
          //ep.logger.info('ya hoo ' + response);


          // declare view
          // assign collection
          // declare target child regions
          var itemListRegion = new Marionette.Region({
            el:'[data-region="itemRegion"]'
          });
          var itemListView = new View.BrowseItemView({
            collection:response
          });
          itemListRegion.show(itemListView);

        },
        error:function(response){
          EventBus.trigger('log.error','error getting item browse collection: ' + response)

        }
      });
    });

    // Window Resized Event
    EventBus.bind('layout.windowResized',function(event){
      if (ep.ui.width < 700){
        if (displayModeFull){
          displayModeFull = false;
          ep.logger.info( '|-------------------   resize nav down');
        }
      }
      if (ep.ui.width > 700){
        if (!displayModeFull){
          displayModeFull = true;
          ep.logger.info( '|-------------------   resize nav up');
        }
      }
    });

    // Main Nav Nodes Load Success
    EventBus.bind('ia.mainNavNodesLoadSuccess',function(){
      mainNavInitialized = true;
    });





    return {
      MainNavView:MainNavView,
      BrowseCategoryView:BrowseCategoryView
    };
  }
);


