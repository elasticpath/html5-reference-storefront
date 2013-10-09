/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 26/04/13
 * Time: 2:53 PM
 *
 */
define(['ep','eventbus', 'router', 'base.app.models','base.app.views','text!modules/base/app/base.app.templates.html','modalwin'],
  function(ep,EventBus, AppRouter, Model,View,template){

    _.templateSettings.variable = 'E';

    var anchorSelector = '#TemplateContainer';

    var baseMarkup = $(template);

    // attach the module template markup to the DOM
    $(anchorSelector).append(baseMarkup);

   //  Marionette.Region.prototype.open = function(view){
   //    this.$el.hide();
   //    this.$el.html(view.el);
   // //  this.$el.removeAttr('style');
   //    //this.$el.show(ep.app.config.viewFadeInValue);
   //    this.$el.fadeIn(ep.app.config.viewFadeInValue);
   //  };


    /*
    * Modal Region
    * */
    var modalRegion = Backbone.Marionette.Region.extend({
      el: '[data-region="modalRegion"]',

      constructor: function(){
        _.bindAll(this);
        Backbone.Marionette.Region.prototype.constructor.apply(this, arguments);
        this.on('show', this.showModal, this);
        this.on('hide', this.hideModal, this);
      },
      getEl:function(selector){
        var $el = $(selector);
        $el.on('hidden', this.close);
        return $el;
      },

      showModal: function(view){

        this.$el.modal({
          autoResize: true,
          modal: true,
          onShow: function(dialog){

          },
          onOpen:function(dialog){

            dialog.overlay.fadeIn('fast',function(){
              dialog.data.hide();
              dialog.container.fadeIn('fast',function(){

                dialog.data.slideDown('fast',function(){
                  $(window).resize();
                });
              });
            });
          },
          onClose:function(dialog){
            dialog.data.fadeOut('fast',function(){
              dialog.container.hide('fast',function(){
                dialog.overlay.slideUp('fast',function(){
                  $.modal.close();
                  $('[data-region="modalRegion"]').empty();
                  EventBus.trigger('ui.modalWindowClosed');
                });
              });
            });
          }
        });

      },


      onShow:function(){
        //this.showModal(this);

      },


      hideModal: function(){
        this.$el.modal('hide');
      }
    });

    /*
    * Start App Listener
    * */
    ep.app.on('start',function(options){


      // base application layout
      var baseLayout = new View.BaseLayout();
      baseLayout.render();
      ep.app.addRegions({
        appHeaderRegion:'[data-region="appHeader"]',
        mainNavRegion:'[data-region="mainNavRegion"]',
        appMainRegion:'[data-region="appMain"]',
        appFooterRegion:'[data-region="appFooter"]',
        appModalRegion:modalRegion

      });

      ep.app.viewPortRegion.show(baseLayout);
      EventBus.on('app.baseLayoutRenderSuccess',function(){
        EventBus.trigger('layout.loadRegionContentRequest',{
          region:'appHeaderRegion',
          module:'extAppheader',
          view:'AppHeaderView'
        });
      });

      EventBus.trigger('app.baseLayoutRenderSuccess');
    });






    return{
      config:Model.config
    };

  }
);
