/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 26/04/13
 * Time: 3:07 PM
 *
 */
define(['ep','eventbus','base.settings.views','text!modules/base/settings/base.settings.templates.html'],
  function(ep,EventBus,View,template){

    $('#TemplateContainer').append(template);

    _.templateSettings.variable = 'E';

    var indexView = function(){
      return new View.DefaultHomeView();
    };
    var indexLayout = function(){
      var layout = new View.DefaultHomeLayout();
      layout.render();
      var containerRegion = new Marionette.Region({
        el:'[data-region="main"]'
      });

      layout.on('show',function(layout){
        containerRegion.show(new View.SettingsCSSTheme());
      });

      return layout;
    };

    return {
      IndexView:indexView,
      IndexLayout:indexLayout
    };
  }
);
