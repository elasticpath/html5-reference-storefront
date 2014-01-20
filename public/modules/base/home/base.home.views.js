/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 *
 */
define(['backbone','eventbus'],
  function(Backbone,EventBus){

    var DefaultHomeLayout = Backbone.Marionette.Layout.extend({
      template:'#DefaultHomeLayoutTemplate',
      regions: {
        homeContentRegion: '[data-region="homeMainContentRegion"]'
      }
    });

    var DefaultHomeView = Backbone.Marionette.ItemView.extend({
      template:'#DefaultHomeViewTemplate',
      className:'home-container'
/*
      onRender:function(){
        (function(){
          var script = document.createElement('script');

          script.async = true;
          script.src = 'http://10.10.121.182:3008/embed/widget.js';

          var entry = document.getElementsByTagName('script')[0];
          entry.parentNode.insertBefore(script, entry);

        }());
      }
      onShow:function(){
        $('[data-region="scriptInclude"]').html('<script src="http://10.10.121.182:3008/embed/widget.js"></script>');
      }
*/
    });

    return{
      DefaultHomeView:DefaultHomeView,
      DefaultHomeLayout:DefaultHomeLayout
    };
  }
);
