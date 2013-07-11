/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 06/05/13
 * Time: 7:31 AM
 *
 */
define(['app','eventbus','uiform','modules/composer2/composer.models','modules/composer2/composer.views','text!modules/composer2/composer.templates.html','tabs'],
  function(App, EventBus, Form, Model, View, template){
    var anchorSelector = '#TemplateContainer';

    _.templateSettings.variable = 'E';
    var baseMarkup = $(template);
    // attach the module template markup to the DOM
    $(anchorSelector).append(baseMarkup);

    var indexView = function(){
      var targetLayoutView = new View.IndexLayout();

      targetLayoutView.render();

      targetLayoutView.on('show',function(layout){

        this.layoutMenuRegion.show(new View.LayoutChooser());
        this.formMenuRegion.show(new View.FormChooser());
        this.viewMenuRegion.show(new View.ViewChooser());
        //this.codeEditorRegion.show(new View.CodeEditor());

      });

      return targetLayoutView;
    };

    return{
      MainView:indexView
    };
  }
);
