/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 18/04/13
 * Time: 10:27 AM
 *
 */
define(['ep','app','eventbus','modules/composer/composer.models','modules/composer/composer.views', 'text!modules/composer/composer.templates.html', 'uiaccordion', 'theme', 'uieditor', 'toast','tabs','ace','modalwin'],
  function(ep, App, EventBus, Model, View, template, UIAccordion, Theme, UICodeEditor){


    $('#TemplateContainer').append(template);

    _.templateSettings.variable = 'E';
    var editor;
    var modListCollection;

    var composerLayout = function(options){


      /*
       *
       *
       * Base Layout - composer module
       *
       *
       *
       * */
     // var layout = new View.ModuleEditorLayout();
      var layout = new View.ComposerBaseLayout();

      /*
        *
        * LAYOUT - base layout
        *
        *
        * */
      layout.on('show',function(){

        /*
        *
        *   COMPOSER IA VIEW
        *
        *
        * */
        var composerIAView = new View.ComposerIAView();
        composerIAView.on('show',function(){
          EventBus.trigger('log.info','|=| composerIAView.on show');

          EventBus.bind('composer.loadComposerViewRequest',function(view){

            switch(view){

              /*
               * ---------------------------------------------------
               *
               *
               *   STYLE - LESS FILES
               *
               *
               *
               * ----------------------------------------------------
               * */
              case "#EditStyles":

                /*
                 *
                 * CSS Files Model Collection
                 *
                 * */

                //codeEditorLayout.close();
                var cssFiles = new Model.FileCollection();
                cssFiles.fetch({
                  url:'/cssfiles',
                  success:function(response){

                    var codeEditorLayout = new View.CodeEditorLayout();

                    codeEditorLayout.on('show',function(){
                      var CSSFileListView = new View.CSSFileListView({
                        collection:cssFiles
                      });
                      // source file list
                      codeEditorLayout.composerFileListRegion.show(CSSFileListView);

                      var editorId = 'FileEditor';
                      var editorModel = new UICodeEditor.EditorModel({
                        id:editorId
                      });
                      var editor = new UICodeEditor.EditorWin(editorModel);
                      var editorLayout = new View.ComposerFileEditor();
                      codeEditorLayout.composerEditorRegion.show(editorLayout);
                      editorLayout.editorRegion.show(editor);
                      EventBus.trigger('composer.editorTemplateLoaded',editorId);
                    });
                    composerIAView.composerStylesRegion.show(codeEditorLayout);
                  },
                  error:function(response){
                    EventBus.trigger('log.info','error getting CSS files: ' + response);
                  }
                });

                break;

              /*
               * ----------------------------------
               *
               *
               *
               *
               * MODULES List Collection
               *
               *
               *
               *
               * ----------------------------------
               * */
              case "#EditModules":

                modListCollection = new Model.ModuleListItemCollection();

                modListCollection.fetch({
                  success:function(response){
                    EventBus.trigger('log.info','MOD LIST COLLECTION: ' + response);
                    var codeEditorLayout = new View.CodeEditorLayout();

                    codeEditorLayout.on('show',function(){
                      var ModFileListView = new UIAccordion.UIAccordion({
                        collection:modListCollection
                      });
                      // source file list
                      codeEditorLayout.composerFileListRegion.show(ModFileListView);

                      var editorId = 'ModFileEditor';
                      var editorModel = new UICodeEditor.EditorModel({
                        id:editorId
                      });
                      var editor = new UICodeEditor.EditorWin(editorModel);
                      var editorLayout = new View.ComposerFileEditor();
                      codeEditorLayout.composerEditorRegion.show(editorLayout);
                      editorLayout.editorRegion.show(editor);

                      EventBus.trigger('composer.moduleListLoadComplete');
                      EventBus.trigger('composer.editorTemplateLoaded',editorId);
                    });
                    composerIAView.composerModulesRegion.show(codeEditorLayout);

                  }
                });
                break;


              /*
               *
               *
               * THEMES
               *
               *
               *
               * */
              case "#EditThemes":

                composerIAView.composerThemesRegion.show(new Theme.IndexView());


                break;
              /*
               *
               *
               * FORMS
               *
               *
               *
               * */
              case "#EditForms":

                EventBus.trigger('log.info','Load the Form Item List View');
                composerIAView.composerFormsRegion.show(new Theme.IndexView());
                break;

              /*
               *
               *
               * ROUTES
               *
               *
               *
               * */
              case "#EditRoutes":

                break;

              /*
               *
               *
               * VIEWS
               *
               *
               *
               * */
              case "views":

                break;

              default:

            }

          });

        });





        layout.mainComposerRegion.show(composerIAView);


      });



      /*
      *
      * Return view
      *
      * */
      return layout;
    };



    /*
     *
     * Event Bus Bindings
     *
     *
     * */
    EventBus.bind('composer.loadModFilesRequest',function(data){

      var moduleFilesCollection = new Model.ModuleFileListCollection();
      moduleFilesCollection.fetch({
        url:'/modulefiles/' + data.moduleName,
        success:function(response){
          // EventBus.trigger('composer.renderFileListViewRequest',{modRef:data,response:response});

          //{modRef:data,response:response}
          var fileListRegionName = data.moduleName + 'FileListRegion';
          var targetRegion = new Marionette.Region({
            el:'[data-region="' + fileListRegionName + '"]'
          });
          var newFileListView = new View.ModuleFileListView({
//            el:$('ul[data-module="' + data.moduleName + '"]'),
            collection:moduleFilesCollection
          });
          targetRegion.show(newFileListView);
          // create an instance of the file list view
          // get a reference to the accordion regions
          // render the list in the accordion


          // append to existing module referce anchor
        },
        error:function(resopnse){
          log(response);
        }
      });

    });
    EventBus.bind('composer.moduleListLoadComplete', function(){
      var collection = modListCollection;
      for (var i = 0;i < collection.models.length;i++){
        var moduleInstance = collection.models[i];
        var modRef = moduleInstance.get('moduleName');
        EventBus.trigger('composer.loadModFilesRequest',{moduleName:modRef});

      }
    });
    EventBus.bind('composer.moduleFilesLoaded',function(options){

    });

    /*
    *
    *
    *   LOAD CSS FILE FROM SERVER
    *
    *
    * */
    EventBus.bind('composer.getCSSFileRequest',function(options){

      var dir = options.dir;
      var fileName = options.fileName;
      var reqUrl = '/cssfiles/' + dir + '/' + fileName;
      ep.io.ajax({
        type:'GET',
        url:reqUrl,
        success:function(response){
          var editFileObj = {};
          editFileObj.fileData = response;
          editFileObj.fileName = options.fileName;
          editFileObj.type = 'CSS';
          editFileObj.typeName = 'stylesrc';
          EventBus.trigger('composer.editorFileLoaded',editFileObj);

        },
        error:function(response){
          EventBus.trigger('log.info',response);
        }
      });

    });
    /*
     *
     * LOAD MODULE FILE FROM SERVER
     *
     * */
    EventBus.bind('composer.getModuleFileRequest',function(options){

      var moduleName = options.moduleName;
      var fileName = options.fileName;
      if (options.fileType && (options.fileType === 'module')){
        var reqUrl = '/editfile/' + moduleName + '/' + fileName;
        ep.io.ajax({
          type:'GET',
          url:reqUrl,
          success:function(response){
            var editFileObj = {};
            editFileObj.fileData = response;
            editFileObj.fileName = options.fileName;
            editFileObj.type = 'modules';
            editFileObj.typeName = options.moduleName;
            EventBus.trigger('composer.editorFileLoaded',editFileObj);

          },
          error:function(response){
            EventBus.trigger('log.info',response);
          }
        });
      }

    });

    /*
    *
    * target file has been loaded from the sever
    * initialize the editor
    *
    * INITIALIZE THE EDITOR WITH FILE DATA
    *
    *
    * */
    EventBus.bind('composer.editorFileLoaded',function(fileDataObj){
      EventBus.trigger('log.info','file loaded: ' + fileDataObj.fileName);
      var editorId = 'FileEditor';
      if (fileDataObj.type === 'module'){
        editorId = 'ModFileEditor';
      }
      var editor = ace.edit(editorId);
      editor.setValue(fileDataObj.fileData);
      var metaDataModel = new Model.FileMetaDataModel(fileDataObj);
      var editorControlsModel = new Model.EditorControlsModel(fileDataObj);

      var controls = new View.EditorControlsView({
        model:editorControlsModel
      });
      var metaDataView = new View.EditorMetaDataView({
        model:metaDataModel
      });


      var metaDataRegion = new Marionette.Region({
        el:'[data-region="composerEditorFileMetaDataRegion"]'
      });
      var controlRegion = new Marionette.Region({
        el:'[data-region="composerEditorControlsRegion"]'
      });
      metaDataRegion.show(metaDataView);
      controlRegion.show(controls);

    });


/*
*
* Targeted for deletion
*
* */
//
//    EventBus.bind('composer.editorTemplateLoaded',function(editorId){
//      EventBus.trigger('composer.initializeEditorRequest',editorId);
//    });
//
//    EventBus.bind('composer.initializeEditorRequest',function(editorId){
//      try{
//
//        var editor = ace.edit(editorId);
//        editor.setTheme("ace/theme/monokai");
//        var mode = "ace/mode/javascript";
//        editor.getSession().setMode(mode);
//        EventBus.trigger('composer.composerViewInitialized',editor);
//
//      }
//      catch(e){
//        EventBus.trigger('log.info',' ACE editor -  ' + e.message);
//      }
//    });




    EventBus.bind('composer.addCSSFileBtnClicked',function(event){
      EventBus.trigger('log.info','addCSSFileBtnClicked');

      var modalRegion = new Marionette.Region({
        el: "#modal",

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

      var $modalEl = $("#modal");
      $modalEl.modal({overlayClose:true});
      modalRegion.show(new View.AddCSSFileFormView());
      //modalRegion.show(new View.AddCSSFileFormView());

    });
    // save new CSS File
    EventBus.bind('composer.btnSaveCSSFileClicked',function(event){
      EventBus.trigger('log.info','ADD New CSS File');
      // get the file name
      var fileName = $('#NewCSSFileName').val();
      if (fileName){
        ep.io.ajax({
          type:'POST',
          url:'/cssfiles',
          data:{'fileName':fileName},
          success:function(response){
            EventBus.trigger('saved new file: ' + response);

          },
          error:function(response){
            EventBus.trigger('save new file error: ' + response);

          }

        });
      }

      // send request to server
      // if unique and success reload list
      // else display error
    });
    // cancel new CSS File
    EventBus.bind('composer.btnCancelCSSFileClicked',function(event){
      EventBus.trigger('log.info','Cancel Add New CSS File');
    });



//    EventBus.bind('composer.showComposerTab',function(options){
//      //{'tabId':hash}
//      EventBus.trigger('log.info','SHOW COMPOSER TAB: ' + options.tabId);
//
//
//      var editorRegion = new Marionette.Region({
//        el:'#composerEditorRegion'
//      });
//      editorRegion.show(new View.ComposerFileEditor());
//
////      var editor = ace.edit("FileEditor");
////      editor.setTheme("ace/theme/monokai");
////      var mode = "ace/mode/javascript";
////      editor.getSession().setMode(mode);
//      //EventBus.trigger('composer.composerViewInitialized',editor);
//
//
//
//    });

    /*
    *
    *
    * DOM Event Listeners
    *
    *
    * MARKED FOR DELETION
    * */
//    var fireEventListenters = function(){
//      /*
//      *
//      * Edit Module File Request
//      *
//      * */
//      $('.cmd-edit-module').click(function(event){
//        event.preventDefault();
//        var reqObj = {};
//        reqObj.fileType = $(event.target).data('type');
//        reqObj.moduleName = $(event.target).data('module');
//        EventBus.trigger('composer.getFileRequest',[reqObj]);
//      });
//      /*
//      *
//      * Save File Edits Button
//      *
//      * NOTE:  THIS IS DUPLICATE HANDLER - ONE FOR MODULES AND ONE FOR CSS
//      * - SHOULD BE RECONCILED
//      *
//      * */
//      $('.x-btn-save-file').click(function(event){
//        var editor = ace.edit("FileEditor");
//
//        // get the contents of the editor
//        var fileData = editor.getValue();
//        if (editor.currentModule){
//          // get the target end point
//          if (editor.currentFileType){
//            // send the data
//            EventBus.trigger('io.apiRequest',{
//              type:'PUT',
//              url:'/file',
//              data:{module:editor.currentModule,filetype:editor.currentFileType,fileData:fileData},
//              success:function(response){
//                EventBus.trigger('io.successMessageRequest',{message:'Successfully saved file'});
//                log(response);
//
//
//              },
//              error:function(response){
//                EventBus.trigger('io.errorMessageRequest',{message:'Error saving file'});
//                log(response);
//              }
//            },this);
//          }
//          else{
//            log('can\'t save file - no file type detected');
//          }
//
//        }
//        else{
//          log('can\'t save file - no current module detected');
//        }
//
//      });
//
//
//     };

    return {
      ComposerLayout:composerLayout
    };
  }
);
