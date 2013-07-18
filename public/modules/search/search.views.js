/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 26/04/13
 * Time: 3:08 PM
 *
 */
define(['ep','backbone','eventbus','cortex'],
  function(ep,Backbone,EventBus,Cortex){

    var viewHelpers = {
      encodeUri:function(uri){
        return ep.ui.encodeUri(uri);
      }
    };

    var HeaderSearchView = Backbone.Marionette.ItemView.extend({
      template:'#SearchModuleDefaultTemplate',
      events: {
        'click .btn-header-search': 'keywordSearch'
      },
      keywordSearch:function(e){
        event.preventDefault();
        if (this.$('.header-search-input').val()){
          var keywords = this.$('.header-search-input').val();
          EventBus.trigger('log.info','Search request: ' + keywords);
          // trigger navigation to search route
          // may need to make this more robust
          document.location.href = '/#search/' + encodeURIComponent(keywords);
        }
      }
    });
    var searchResultsLayout = Backbone.Marionette.Layout.extend({
      template:'#SearchResultsLayoutContainer'
    });
    var searchResultsItem = Backbone.Marionette.ItemView.extend({
      template:'#SearchResultsItemContainer',
      templateHelpers:viewHelpers
    });
    var noResults = Backbone.Marionette.ItemView.extend({
      template:'#SearchNoResultsTemplate'
    });

    var searchResults = Backbone.Marionette.CompositeView.extend({
      template:'#SearchResultsTemplate',
      itemView:searchResultsItem,
      emptyView: noResults,
      itemViewContainer:'[data-region="searchResultsList"]'

    });
    return{
      HeaderSearchView:HeaderSearchView,
      SearchResultsLayout:searchResultsLayout,
      SearchResults:searchResults
    }
  }
);
