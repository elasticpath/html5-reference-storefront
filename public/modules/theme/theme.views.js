/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 26/04/13
 * Time: 2:53 PM
 *
 */
define(['ep','eventbus','marionette','colorpicker'],function(ep,EventBus,Marionette,ColorPicker){

    function isColor(val){
      if (val.indexOf('rgb') > -1){
        return true;
      }
      if (val.indexOf('#') > -1){
        return true;
      }
      // technically should check for named color
      // but we should discourage this type of value
      return false;
    }
    var viewHelpers = {
      renderColorStyleAttributeValue:function(value){
        if (isColor(value)){
          return 'background:' + value;
        }
        return '';
      }
    };

    var baseLayout = Backbone.Marionette.Layout.extend({
      template:'#ThemeModuleDefaultTemplate',
      regions:{
        themeListRegion:'[data-region="themeListRegion"]',
        themeDetailsRegion:'[data-region="themeDetailsRegion"]'
      }
    });

    var themeListItemView = Backbone.Marionette.ItemView.extend({
      template:'#ThemeListItemViewTemplate',
      tagName:'li',
      events:{
        'click .btn-edit-theme':function(event){
          EventBus.trigger('theme.editThemeButtonClicked',{
            name:$(event.target).data('name'),
            display:$(event.target).text()
          })
        },
        'click .btn-edit-theme-var':function(event){
          EventBus.trigger('log.info','edit theme var button clicked');

        }
      }
    });

    var themeListView = Backbone.Marionette.CompositeView.extend({
      template:'#ThemeListViewTemplate',
      itemView:themeListItemView,
      itemViewContainer:'ul',
      events:{
        'click .btn-activate-theme':function(event){
          EventBus.trigger('theme.activateThemeClicked',event);
        }
      }
    });

    var themeFormView =  Backbone.Marionette.ItemView.extend({
      template:'#ThemeFormViewTemplate'
    });

    var themeVariableItemView = Backbone.Marionette.ItemView.extend({
      template:'#ThemeVariableItemTemplate',
      templateHelpers:viewHelpers
    });
    var themeDetailView = Backbone.Marionette.CompositeView.extend({
      template:'#ThemeDetailViewTemplate',
      itemView:themeVariableItemView,
      itemViewContainer:'ul',
      onShow:function(){
        $('.btn-edit-theme-var').ColorPicker({
          //color:'#ef341f',
          onSubmit: function(hsb, hex, rgb, el) {
            EventBus.trigger('log.info','submit color picker' + hex);
            $(el).ColorPickerHide();
            $(el).text('#' + hex);
            EventBus.trigger('log.info','change[' + $(el).data('name') + '] to [#' + hex + ']')

            EventBus.trigger('theme.changeVarValueRequest',{'name':$(el).data('name'),'value':'#' + hex })

            //EventBus.trigger('draw.changePenColorRequest','#' + hex);
          },
          onBeforeShow: function () {
            var currColor = $(event.target).data('value');
            var currPicker = $(this);
            currPicker.ColorPickerSetColor(currColor);
          }
        });
      }

    });

    var themeEditorView = Backbone.Marionette.ItemView.extend({
      template: '#ThemeEditorViewTemplate'
    });



    return{
      BaseLayout:baseLayout,
      ThemeListItemView:themeListItemView,
      ThemeListView:themeListView,
      ThemeFormView:themeFormView,
      ThemeDetailView:themeDetailView,
      ThemeEditorView:themeEditorView


    }
  }
);
