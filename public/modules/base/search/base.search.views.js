/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 *
 */
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
