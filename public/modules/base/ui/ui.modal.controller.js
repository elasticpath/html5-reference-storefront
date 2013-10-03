/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 * 
 */
define(['app', 'eventbus', 'cortex', 'uimodal.models', 'uimodal.views', 'text!modules/base/ui/ui.modal.templates.html'],
  function(App, EventBus, Cortex, Model, View, template){

    $('#TemplateContainer').append(template);

    _.templateSettings.variable = 'E';

    var init = function(){



    };
    var modalRegion = new Marionette.Region({
      el: '[data-region="modalRegion"]',

//      constructor: function(){
//        _.bindAll(this);
//        Backbone.Marionette.Region.prototype.constructor.apply(this, arguments);
//        //this.on("view:render", this.showModal, this);
//      },
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


    return {
      ModalRegion:modalRegion

    };
  }
);
