/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 06/05/13
 * Time: 7:59 AM
 *
 */
define(['app','eventbus','modules/ui/ui.form.models','modules/ui/ui.form.views','text!modules/ui/ui.form.templates.html'],
  function(App, EventBus, Model, View, template){
    var anchorSelector = '#TemplateContainer';

    _.templateSettings.variable = 'E';
    var baseMarkup = $(template);
    // attach the module template markup to the DOM
    $(anchorSelector).append(baseMarkup);

    var indexView = function(){
      var targetLayoutView = new View.IndexLayout();


      var targetView = new View.IndexView();
      // targetLayoutView.container.show(targetView);

      var indexContainerRegion = new Backbone.Marionette.Region({
        el: ".view-index"
      });

      targetLayoutView.on('show',function(layout){
        indexContainerRegion.show(targetView)
      });
      //targetLayoutView.container.show(targetView);

      return targetLayoutView;
    };

    return{
      IndexView:indexView,
      UIButton:function(){
        return new View.UIButton();
      },
      UIForm:function(){
        return new View.UIForm();
      },
      UIFormText:function(){
        return new View.UIFormText();
      },
      UIButtonModel:Model.UIButton,
      UIFormItemTypes:Model.FormItemTypeCollection,
      UIInput:function(){
        return new View.UIInput();
      },
      UILabel:function(){
        return new View.UILabel();
      },
      UIFormItem:function(){
        return new View.UIFormItem();
      },
      UIFormItemList:function(){
        return new View.UIFormItemList();
      }
    };
  }
);
