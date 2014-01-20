/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
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
