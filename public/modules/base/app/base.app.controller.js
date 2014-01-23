/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 *
 */
define(['ep','eventbus', 'router', 'app.models','app.views','text!modules/base/app/base.app.templates.html', 'mediator', 'modalwin'],
  function(ep,EventBus, AppRouter, Model,View,template, Mediator){

    _.templateSettings.variable = 'E';

    var anchorSelector = '#TemplateContainer';

    var baseMarkup = $(template);

    // attach the module template markup to the DOM
    $(anchorSelector).append(baseMarkup);

    // animated loading of views  // commented our on branch
    Marionette.Region.prototype.open = function(view){
      this.$el.hide();
      this.$el.html(view.el);
      this.$el.fadeIn(ep.app.config.viewFadeInValue);
    };

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
          onOpen:function(dialog){
            dialog.overlay.fadeIn(200);
            dialog.data.show(0, function() {
              dialog.container.fadeIn(0, function(){
                  $(window).resize();
              });
            });
          },
          onClose:function(dialog){
            dialog.data.fadeOut(0,function(){
              dialog.container.fadeOut(0,function(){
                dialog.overlay.fadeOut(200,function(){
                  $.modal.close();
                  $('[data-region="modalRegion"]').empty();
                  EventBus.trigger('ui.modalWindowClosed');
                });
              });
            });
          }
        });

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
        Mediator.fire('mediator.loadRegionContent', 'appHeader');
      });

      EventBus.trigger('app.baseLayoutRenderSuccess');
    });

    return{
      config:Model.config
    };

  }
);
