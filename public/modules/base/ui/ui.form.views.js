/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 06/05/13
 * Time: 7:59 AM
 *
 */
define(['app','eventbus','marionette'],
  function(App, EventBus, Marionette){

    _.templateSettings.variable = 'S';
    var indexView = Backbone.Marionette.CompositeView.extend({
        template:'#UIFormIndexTemplate'

      }
    );

    var uiButton = Backbone.Marionette.ItemView.extend({
      template:'#UIButtonTemplate',
      tagName:'button',
      attributes: function() {
        return{
          'class':'btn btn-round'
        };
      }

    });

    var uiForm = Backbone.Marionette.CompositeView.extend({
      template:'#UIFormTemplate',
      tagName:'form',
      attributes: function() {
        return{
          'method':'POST',
          'class':'ui-form'
        }
      }

    });
    var uiFormText = Backbone.Marionette.ItemView.extend({
      template:'#UIFormFieldTextTemplate',
      tagName:'input',
      attributes: function() {
        return {
          'data-id': 'test',
          'type' : 'text'
        };
      }
    });
    var indexDefaultLayout = Backbone.Marionette.Layout.extend({
      template:'#UIFormIndexLayoutTemplate',
      regions:{
        container:'.view-index'
      }
    });

    /*
    *
    * NEW FORM COMPOSER VIEWS
    *
    * */

    var uiInputView = Backbone.Marionette.ItemView.extend({
      template:'#UIInputTemplate'
    });
    var uiFormLabelView = Backbone.Marionette.ItemView.extend({
      template:'#UILabelTemplate'
    });
    var uiFormItemView = Backbone.Marionette.Layout.extend({
      template:'#UIFormItemTemplate',
      regions:{
        labelRegion:'[data-region="formInputLabelRegion"]',
        inputRegion:'[data-region="formInputRegion"]'

      }
    });
    var uiFormItemListView = Backbone.Marionette.CompositeView.extend({
      template:'#UIFormItemCollectionTemplate',
      itemView:uiFormItemView
    });



    return {
      IndexView:indexView,
      IndexLayout:indexDefaultLayout,
      UIForm:uiForm,
      UIButton:uiButton,
      UIFormText:uiFormText,
      UIInput:uiInputView,
      UILabel:uiFormLabelView,
      UIFormItem:uiFormItemView,
      UIFormItemList:uiFormItemListView

    };



  }
);
