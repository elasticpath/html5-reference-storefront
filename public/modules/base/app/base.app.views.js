/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 *
 */
define(['ep','eventbus','marionette'],
  function(ep,EventBus,Marionette){

    var baseLayout = Backbone.Marionette.Layout.extend({
      template:'#AppModuleDefaultBaseTemplate'
    });
    var devInstrumentation = Backbone.Marionette.ItemView.extend({
      template:'#EPDevInstrumentationTemplate',
      onShow:function(){
        EventBus.bind('layout.windowResized',function(newRem){
          $('#DevInstrumentationScreenRemWidth').text(newRem);
          $('#DevInstrumentationScreenPixelWidth').text(ep.ui.width());
          $('#DevInstrumentationRenderProfile').text(ep.ui.getRenderProfile());
          $('#DevInstrumentationAppHeaderAggCompWidth').text();
        });
        $('#DevInstrumentationScreenRemWidth').text(ep.ui.remWidth());
        $('#DevInstrumentationScreenPixelWidth').text(ep.ui.width());
        $('#DevInstrumentationPixelDensity').text(ep.ui.ppi());
        $('#DevInstrumentationTouchEnabled').text(ep.ui.touchEnabled());
        $('#DevInstrumentationRenderProfile').text(ep.ui.getRenderProfile());

        $('#BtnDevInstrumenationToggle').unbind().click(function(event){
          $('#EPDevInstrumentation').fadeToggle(300);
          if(!$('#DevInstrumenationContainer').is(':visible')){
          //  $('#BtnDevInstrumenationToggle').addClass('side-render');
          }
          else{
            $('#BtnDevInstrumenationToggle').removeClass('side-render');
          }
        });
      }
    });

    /*
    * Instrumentation
    *
    * */

//    var EPDevInstrumentationItemView = Backbone.Marionette.ItemView.extend({
//      template:'#EPDevAppHeaderInstrumentationItemTemplate',
//      tagName:'tr'
//    });
//    var EPDevInstrumentationView = Backbone.Marionette.CompositeView.extend({
//      template:'#EPDevAppHeaderInstrumentationTemplate',
//      itemView:EPDevInstrumentationItemView,
//      itemViewContainer:'tbody'
//    });

    return{
      BaseLayout:baseLayout,
      DevInstrumentation:devInstrumentation
//      EPDevInstrumentationView:EPDevInstrumentationView
    };
  }
);
