/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 26/04/13
 * Time: 2:53 PM
 *
 */
define(['ep','eventbus','modules/theme/theme.models','modules/theme/theme.views','text!modules/theme/theme.templates.html','text!modules/theme/theme.config.json','colorpicker','toast'],
  function(ep,EventBus,Model,View,template,config,ColorPicker){

    _.templateSettings.variable = 'E';

    var anchorSelector = '#TemplateContainer';

    var baseMarkup = $(template);

    // attach the module template markup to the DOM
    $(anchorSelector).append(baseMarkup);


    var currActiveTheme;

    var indexView = function(){

      var baseLayout = new View.BaseLayout();

      baseLayout.on('show',function(){
        var themeCollection = new Model.ThemeCollection(JSON.parse(config));

        var themeListView = new View.ThemeListView({
          collection:themeCollection
        });

        baseLayout.themeListRegion.show(themeListView);

      });




      return baseLayout;

    };
    EventBus.bind('theme.editThemeButtonClicked',function(options){

      EventBus.trigger('theme.loadThemeDetailRequest',options);


    });
    EventBus.bind('theme.loadThemeDetailRequest',function(options){
      if (options.name){
        var targetTheme;
        // get theme variables model collection
        var themeConfig = JSON.parse(config);
        for (var i = 0;i < themeConfig.length;i++){
          if (themeConfig[i].name === options.name){
            targetTheme = themeConfig[i];
            break;
          }
        }
        if (targetTheme){
          var themeVariablesCollection = new Model.ThemeVariableCollection(targetTheme.variables);
          var themeDetailView = new View.ThemeDetailView({
            model:new Backbone.Model({display:options.display}),
            collection:themeVariablesCollection
          });
          var targetRegion = new Marionette.Region({
            el:'[data-region="themeDetailsRegion"]'
          });
          targetRegion.show(themeDetailView);
          currActiveTheme = options.name;
        }


        // render the theme detail view
      }
    });

    EventBus.bind('theme.activateThemeClicked',function(event){


        var targetTheme = $(event.target).data('name');
        if (targetTheme){

          EventBus.trigger('log.info','Activate Theme: ' + $(event.target).data('name'));

          var configObj = JSON.parse(config);

          for (var i = 0;i < configObj.length;i++){
            var objInstance = configObj[i];
            if (objInstance.name === targetTheme)
            {
              EventBus.trigger('theme.activateThemeRequest',objInstance);
              break;
            }
          }
        }
        else{
          EventBus.trigger('log.info','no theme name provided')
        }
    });

    EventBus.bind('theme.changeVarValueRequest',function(options){
      //{'name':$(el).data('name'),'value':'#' + hex }
      // get the name of the current theme
      EventBus.trigger('log.info','THIS IS THE CURRENT THEME: ' + currActiveTheme);
      // get the data object

      var configObj = JSON.parse(config);

      // iterate to find the theme
      for (var i = 0;i < configObj.length;i++){
        var cObj = configObj[i];
        if (cObj.name === currActiveTheme)
        {
          // here is the theme obj
          // find the varible
          // update it
          for (var k = 0;k < configObj[i].variables.length;k++){
            var cVar = cObj.variables[k];
            if (cVar.name === options.name){
              cVar.value = options.value;
              break;
            }
          }
          break;
        }
      }

      EventBus.trigger('theme.writeThemeVariablesFileRequest',configObj);

      // fire theme var updated event


    });
    EventBus.bind('theme.writeThemeVariablesFileRequest',function(configObj){
      // post data to the server
      ep.io.ajax({
        type:'PUT',
        data:{'data':configObj},
        url:'/themedata',
        success:function(response){
          EventBus.trigger('log.info','success save theme data: ' + response);
        },
        error:function(response){
          EventBus.trigger('log.info','error saving theme data: ' + response);
        }

      })
      // reload the list
    });

    EventBus.bind('theme.activateThemeRequest',function(obj){
      EventBus.trigger('log.info','Activate this theme: ' + obj.name);
      // grab the variables
      // iterate
      // write to file
      var fileData = '';
      for (var i = 0;i < obj.variables.length;i++){
        var variable = obj.variables[i];
        fileData += variable.name + ':' + variable.value + ';\n';
      }
      EventBus.trigger('log.info','Theme Vars: ' + fileData);


      var targetDir = 'stylesrc';
      var targetFileName = 'variables.less';

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

      });

    });

    return{
      IndexView:indexView
    }

  }
);
