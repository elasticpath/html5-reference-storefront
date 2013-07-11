/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.

 * User: sbrookes
 * Date: 28/05/13
 * Time: 8:13 AM
 *
 */
define(['app','eventbus','modules/ui/ui.accordion.models','modules/ui/ui.accordion.views','text!modules/ui/ui.accordion.templates.html'],
  function(App, EventBus, Model, View, template){
    var anchorSelector = '#TemplateContainer';

    _.templateSettings.variable = 'E';
    var baseMarkup = $(template);
    // attach the module template markup to the DOM
    $(anchorSelector).append(baseMarkup);

//    var UIAccordion = function(){
//      var targetLayoutView = new View.IndexLayout();
//      targetLayoutView.render();
//
//
//      var targetView = new View.IndexView();
//      // targetLayoutView.container.show(targetView);
//
//      var indexContainerRegion = new Backbone.Marionette.Region({
//        el: ".view-index"
//      });
//
//      targetLayoutView.on('show',function(layout){
//        indexContainerRegion.show(targetView)
//      });
//      //targetLayoutView.container.show(targetView);
//
//      return targetLayoutView;
//    };

    return{
      UIAccordion:View.UIAccordion
    };
  }
);
