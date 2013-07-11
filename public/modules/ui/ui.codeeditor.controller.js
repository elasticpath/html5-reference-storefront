/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 * 
 */
define(['app', 'eventbus', 'cortex', 'modules/ui/ui.codeeditor.models', 'modules/ui/ui.codeeditor.views', 'text!modules/ui/ui.codeeditor.templates.html'],
  function(App, EventBus, Cortex, Model, View, template){

    $('#TemplateContainer').append(template);

    _.templateSettings.variable = 'E';

    return {
      EditorModel:Model.CodeEditorModel,
      EditorWin:View.CodeEditor

    };
  }
);
