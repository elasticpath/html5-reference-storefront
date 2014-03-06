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
