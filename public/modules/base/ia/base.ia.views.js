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
define(['ep','eventbus'],
  function(ep, EventBus){

    var viewHelpers = {
      generateCategoryHref:function(href) {
        var retVal = '';

        if (href) {
          retVal = ep.app.config.routes.category + '/' + ep.ui.encodeUri(href);
        }
        else {
          ep.logger.warn('main nav category loaded without category href');
        }

        return retVal;
      }
    };


    // Nav Item View
    var NavItemView = Backbone.Marionette.ItemView.extend({
      template:'#NavItemTemplate',
      tagName: 'li',
      templateHelpers: viewHelpers,
      attributes:function(){
        return{
          'data-name':this.model.get('displayName')
        };
      },
      onShow:function(){
        $('.main-nav-list li').removeClass('is-selected');
      }
    });

    // Main Nav View
    var MainNavView = Backbone.Marionette.CompositeView.extend({
      template:'#MainNavTemplate',
      itemViewContainer: 'ul[data-region="mainNavList"]',
      itemView: NavItemView,
      templateHelper:viewHelpers,
      onShow:function(){
        $('.btn-main-nav-toggle').hide();


      }
    });

    function clearSelectedMainNav(){
      $('.main-nav-list li').removeClass('is-selected');
    }



    return {
      MainNavView:MainNavView,
      NavItemView:NavItemView,
      clearSelectedMainNav:clearSelectedMainNav

    };
  }
);
