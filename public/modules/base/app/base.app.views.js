/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
