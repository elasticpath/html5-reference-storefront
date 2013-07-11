/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 18/04/13
 * Time: 10:28 AM
 *
 */
define(['eventbus','marionette'],
  function(EventBus,Marionette){

    var viewHelpers = {
      removeFileExtension:function(fileName){
        if (fileName){
          // get the last 'period'
          var x = fileName.lastIndexOf('.');
          var retVal = fileName.substring(0,x);
          return retVal;
        }
        return '';
      },
      returnFileExtension:function(fileName){
        if (fileName){
          var x = fileName.lastIndexOf('.');
          var retVal = fileName.substring((x + 1),fileName.length);
          return retVal;
        }
        return '';
      }
    };



    /*
    *
    * Composer Base Layout
    *
    * */

    var ComposerBaseLayout = Backbone.Marionette.Layout.extend({
      template:'#ComposerBaseLayoutTemplate',
      regions:{
        mainComposerRegion:'div[data-region="mainComposerRegion"]'
      }
    });
    /*
    *
    * Composer IA View - Layout
    *
    *
    * */
    var ComposerIAView = Backbone.Marionette.Layout.extend({
      template:'#ComposerIAViewTemplate',
      regions:{
        composerStylesRegion:'div[data-region="composerStylesRegion"]',
        composerModulesRegion:'div[data-region="composerModulesRegion"]',
        composerThemesRegion:'div[data-region="composerThemesRegion"]',
        composerRoutesRegion:'div[data-region="composerRoutesRegion"]',
        composerViewsRegion:'div[data-region="composerViewsRegion"]'
      },
      onShow:function(event){
        $('.nav-tabs').tabs({
          onShowTab:function(tab){
//            $('.composer-filetype-tab a').removeClass('active');
//            $('a[href="#EditStyles"]').addClass('active');
            EventBus.trigger('composer.loadComposerViewRequest',tab);
          }
        });
      }
    });

    /*
    *
    * Code Editor Layout - files
    *
    * */
    var CodeEditorLayout = Backbone.Marionette.Layout.extend({
      template:'#ComposerFileEditorViewTemplate',
      regions:{
        composerFileListRegion:'div[data-region="cmpsrFileListRegion"]',
        composerEditorRegion:'div[data-region="cmpsrEditorRegion"]'
      },
      // delete this for now but may activate for tabbed editing
      onShow:function(event){
        EventBus.trigger('log.info','code editor layout show event');
      }
    });

    /*
     *
     * Main Page Layout
     *
     *
     *
     * marked for deletion
     *
     *
     * */
    var ModuleEditorLayout = Backbone.Marionette.Layout.extend({
      template:'#ModuleComposerLayout',
      regions:{
        /*
         * marked for deletion
         * */
//        moduleFileListRegion:'div[data-region="moduleFileListRegion"]',
        cssFileListRegion:'div[data-region="cssFileListRegion"]',
        configFileListRegion:'div[data-region="configFileListRegion"]',
        editorRegion:'.editor-content'
      },
      onShow:function(event){
        $('.nav-tabs').tabs();
      }
    });





    /*
     *
     * Module File EDITOR - ACE
     *
     * */
    var ModuleFileEditor = Backbone.Marionette.Layout.extend({
      template:'#ComposerEditorTemplate',
      regions:{
        composerEditorFileMetaDataRegion:'[data-region="composerEditorFileMetaDataRegion"]',
        composerEditorControlsRegion:'[data-region="composerEditorControlsRegion"]',
        editorRegion:'[data-region="editorRegion"]'
      },
      events:{
        'click .btn-save-file':'saveFile'
      },
      onShow:function(){
        //EventBus.trigger('composer.editorTemplateLoaded');
        EventBus.trigger('log.info','ModuleFileEditor Layout onShow');

      },
      saveFile:function(){
        var targetButton = $('.btn-save-file');
        var targetDir = targetButton.data('dir');
        var targetFileName = targetButton.data('file');
        var editorSelector = this.$el.find('.ace_editor ');
        var editorId = $(editorSelector).prop('id');
        var editor = ace.edit(editorId);
        var fileData = editor.getValue()
        var data = {dir:targetDir, fileName:targetFileName,fileData:fileData};
        EventBus.trigger('io.ajaxRequest',{
            type:'PUT',
            url:'/cssfiles',
            data:data,
            success:function(response){
              EventBus.trigger('log.info','success saving file  ' + response);
              $().toastmessage('showSuccessToast', "file saved");
              //document.location.reload();
            },
            error:function(response){
              EventBus.trigger('log.info', 'error saving file: ' + response);
            }

          }
        );
      }

    });


    /*
    *
    *
    * Editor Controls
    *
    *
    * */
    var editorControlsView = Backbone.Marionette.ItemView.extend({
      template:'#ComposerEditorControlsTemplate'
    });



    /*
    *
    *
    * File Meta Data
    *
    *
    *
    * */
    var editorMetaDataView = Backbone.Marionette.ItemView.extend({
      template:'#ComposerEditorMetaDataTemplate'
    });



    /*
     *
     * File Item View
     *
     * */
    var CSSFileItemView = Backbone.Marionette.ItemView.extend({
      template:'#CSSFileItemTemplate',
      tagName:'li',
      events: {
        "click .cmd-file-name": "editFile"
      },
      templateHelpers:viewHelpers,
      editFile:function(event){
        event.preventDefault();
        var parent = $(event.target).parents('ul');
        var dir = $(event.target).data('dir');
        var fileName = $(event.target).data('file');
        EventBus.trigger('log.info','Edit File: ' + dir + ' : ' + fileName);
        var reqObj = {};
        reqObj.fileType = 'css';
        reqObj.dir = dir;
        reqObj.fileName = fileName;
        $('.btn-save-file').data('dir',dir);
        $('.btn-save-file').data('file',fileName);
        EventBus.trigger('composer.getCSSFileRequest',reqObj);

      }
    });
    /*
    *
    * File Item List View
    *
    * */
    var CSSFileListView = Backbone.Marionette.CompositeView.extend({
      itemView:CSSFileItemView,
      template:'#CSSFileListTemplate',
      itemViewContainer:'ul',
      templateHelpers:viewHelpers,
      events:{
        'click [data-cmd="addNewCSSFile"]':function(event){
          EventBus.trigger('composer.addCSSFileBtnClicked',event);
        }
      }
    });



    /*
    *
    *   Module File Item View
    *
    * */
    var ModuleFileItemView = Backbone.Marionette.ItemView.extend({
      template:'#ModuleFileItemTemplate',
      tagName:'li',
      events: {
        "click .cmd-file-name": "editFile"
      },
      templateHelpers:viewHelpers,
      editFile:function(event){
        event.preventDefault();
        var parent = $(event.target).parents('ul');
        var moduleName = $(event.target).data('module');
        var fileName = $(event.target).data('file');
        EventBus.trigger('log.info','Edit File: ' + $(parent).data('module') + ' : ' + $(event.target).data('file'));
        var reqObj = {};
        reqObj.fileType = 'module';
        reqObj.moduleName = moduleName;
        reqObj.fileName = fileName;
        EventBus.trigger('composer.getModuleFileRequest',reqObj)
      }
    });
    /*
    *
    * Module File List View
    *
    * */
    var ModuleFileListView = Backbone.Marionette.CollectionView.extend({
      itemView:ModuleFileItemView,
      tagName:'ul'
    });

    /*
    *
    * Add CSS File Form
    *
    * */
    var addCSSFileFormView = Backbone.Marionette.ItemView.extend({
      template:'#AddCSSFileFormTemplate',
      events:{
        'click [data-cmd="saveNewCSSFile"]':function(event){
          event.preventDefault();
          EventBus.trigger('composer.btnSaveCSSFileClicked',event);
        },
        'click [data-cmd="cancelNewCSSFile"]':function(event){
          event.preventDefault();
          EventBus.trigger('composer.btnCancelCSSFileClicked',event);
        }
      }
    });

    return{
      ComposerFileEditor:ModuleFileEditor,
      ComposerIAView:ComposerIAView,
      ModuleEditorLayout:ModuleEditorLayout,
      ModuleFileListView:ModuleFileListView,
      CSSFileListView:CSSFileListView,
      AddCSSFileFormView:addCSSFileFormView,
      ComposerBaseLayout:ComposerBaseLayout,
      CodeEditorLayout:CodeEditorLayout,
      EditorControlsView:editorControlsView,
      EditorMetaDataView:editorMetaDataView
    };
  }
);
