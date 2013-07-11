/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 18/04/13
 * Time: 10:28 AM
 *
 */
define(['eventbus','backbone'],
  function(EventBus, Backbone){


    var ModuleListItemModel = Backbone.Model.extend({});
    var ModuleListItemCollection = Backbone.Collection.extend({
      model:ModuleListItemModel,
      url:'/modules',
      parse:function(response){
        for (var i = 0;i < response.length;i++){
          var val = response[i].moduleName;
          //EventBus.trigger('log.info','module: ' + val);
          response[i].id = val;
          response[i].label = val;
          response[i].regionName = val + 'FileListRegion';

        }
        return response;
      }
    });
    var ModuleFileListItemModel = Backbone.Model.extend({});
    var ModuleFileListCollection = Backbone.Collection.extend({
      model:ModuleFileListItemModel,
      parse:function(response){
        for (var i = 0;i < response.length;i++){
          var modulePath = response[i].dir;

          var module = modulePath.replace('public/modules/','');

          response[i].module = module;

        }
        return response;

      }
    });
    var fileMetaDataModel = Backbone.Model.extend();
    var editorControlsModel = Backbone.Model.extend();

    var fileModel = Backbone.Model.extend();
    var fileCollection = Backbone.Collection.extend({
      model:fileModel
    });

    return{
      ModuleListItemCollection:ModuleListItemCollection,
      ModuleFileListCollection:ModuleFileListCollection,
      FileCollection:fileCollection,
      FileMetaDataModel:fileMetaDataModel,
      EditorControlsModel:editorControlsModel
    };


  }

);
