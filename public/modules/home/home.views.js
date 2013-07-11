/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 26/04/13
 * Time: 3:08 PM
 *
 */
define(['backbone','eventbus'],
  function(Backbone,EventBus){

    var DefaultHomeView = Backbone.Marionette.ItemView.extend({
      template:'#HomeModuleDefaultTemplate',
      tagName:'p',
      onRender:function(){
//        (function(){
//          var script = document.createElement('script');
//
//          script.async = true;
//          script.src = 'http://10.10.121.182:3008/embed/widget.js';
//
//          var entry = document.getElementsByTagName('script')[0];
//          entry.parentNode.insertBefore(script, entry);
//
//        }());
      }
//      onShow:function(){
//        $('[data-region="scriptInclude"]').html('<script src="http://10.10.121.182:3008/embed/widget.js"></script>');
//      }
    });
    var DefaultHomeLayout = Backbone.Marionette.Layout.extend({
      template:'#HomeModuleDefaultLayoutTemplate',
      tagName:'div',
      className:'container'
    });
    return{
      DefaultHomeView:DefaultHomeView,
      DefaultHomeLayout:DefaultHomeLayout
    };
  }
);
