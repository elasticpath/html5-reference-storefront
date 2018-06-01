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
 * Search function disabled because it's not functional with latest version of storefront.
 *
 */
/* jshint ignore: start */
define(['ep','backbone','eventbus'],
  function(ep,Backbone,EventBus){

    var viewHelpers = {
      encodeUri:function(uri){
        return ep.ui.encodeUri(uri);
      },
      generateItemHref:function(uri) {
        var href = '';

        if (uri) {
          href = ep.app.config.routes.itemDetail + '/' + ep.ui.encodeUri(uri);
        } else {
          href = '';
          ep.logger.warn('[search]: unable to generate href to item-detail');
        }
        return href;
      },
      getDefaultImagePath: function (thumbnail) {
        var retVar;
        if (thumbnail && thumbnail.absolutePath) {
          retVar = thumbnail.absolutePath;
        }
        else {
          retVar = 'images/img-placeholder-noborder.png';
        }
        return retVar;
      },
      getDefaultImageName: function (thumbnail) {
        var retVar;
        if (thumbnail && thumbnail.name) {
          retVar = thumbnail.name;
        }
        return retVar;
      }
    };

    var HeaderSearchView = Backbone.Marionette.ItemView.extend({
      template:'#SearchModuleDefaultTemplate',
      tagName:'form',
      className:'navbar-form',
      events: {
        'click .btn-header-search': 'keywordSearch'
      },
      keywordSearch:function(event){
        event.preventDefault();
        if (this.$('.header-search-input').val()){
          var keywords = this.$('.header-search-input').val();
          EventBus.trigger('log.info','Search request: ' + keywords);
          // trigger navigation to search route
          // may need to make this more robust
          document.location.href = '#search/' + encodeURIComponent(keywords);
        }
      }
    });
    var searchResultsLayout = Backbone.Marionette.Layout.extend({
      template:'#SearchResultsLayoutContainer'
    });
    var searchResultsItem = Backbone.Marionette.ItemView.extend({
      template:'#SearchResultsItemContainer',
      className:'search-results-item',
      templateHelpers:viewHelpers
    });
    var noResults = Backbone.Marionette.ItemView.extend({
      template:'#SearchNoResultsTemplate'
    });

    var searchResults = Backbone.Marionette.CompositeView.extend({
      template:'#SearchResultsTemplate',
      itemView:searchResultsItem,
      className:'search-results-container container',
      emptyView: noResults,
      itemViewContainer:'[data-region="searchResultsList"]',
      onShow:function(){
        $('.main-nav-list li').removeClass('is-selected');
      }

    });
    return{
      HeaderSearchView:HeaderSearchView,
      SearchResultsLayout:searchResultsLayout,
      SearchResults:searchResults
    }
  }
);
/* jshint ignore: end */
