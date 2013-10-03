/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 26/04/13
 * Time: 3:07 PM
 *
 */
define(['ep','eventbus','home.views','text!modules/base/home/home.templates.html'],
  function(ep,EventBus,View,template){

    $('#TemplateContainer').append(template);

    _.templateSettings.variable = 'E';

    var indexView = function(){
      return new View.DefaultHomeView();
    };
    var indexLayout = function(){
      var layout = new View.DefaultHomeLayout();

      var containerRegion = new Marionette.Region({
        el:'.container'
      });

      layout.on('show',function(layout){
        containerRegion.show(new View.DefaultHomeView());
      });

      return layout;
    };

    return {
      IndexView:indexView,
      IndexLayout:indexLayout
    };
  }
);
