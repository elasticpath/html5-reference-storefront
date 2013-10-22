/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 26/04/13
 * Time: 3:07 PM
 *
 */
define(['ep','eventbus','home.views','text!modules/base/home/base.home.templates.html'],
  function(ep,EventBus,View,template){

    $('#TemplateContainer').append(template);

    _.templateSettings.variable = 'E';

    var indexLayout = function(){
      var layout = new View.DefaultHomeLayout();
      var homeView = new View.DefaultHomeView();

      layout.on('show',function(){
        layout.homeContentRegion.show(homeView);
      });

      return layout;
    };

    return {
      IndexLayout:indexLayout
    };
  }
);
