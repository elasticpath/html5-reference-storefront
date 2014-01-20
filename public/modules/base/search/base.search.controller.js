/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 *
 */
define(['ep','eventbus','search.views','search.models','text!modules/base/search/base.search.templates.html'],
  function(ep,EventBus,View,Model,template){

    $('#TemplateContainer').append(template);

    _.templateSettings.variable = 'E';

    // header search
    // main search input
    var defaultSearchView = function(){
      return new View.HeaderSearchView();
    };

    // search results
    var searchResultsView = function(keywords){
      var options = {
        "keywords":keywords,
        "page-size":20
      };
      var searchResultsLayout = new View.SearchResultsLayout();

      searchResultsLayout.on('render',function(){
          // fetch the data
          // render the view
          var modelInst = new  Model.InitCachedSearch();

          ep.logger.info('modelInst URL: ' + modelInst.url);

          modelInst.fetch({
            data:JSON.stringify(options),
            dataType: 'json',
            contentType: 'application/json',
            type:'POST',
            success: function(data, textStatus, xhr){

              var xhr = xhr.xhr;
              // expect a 201 and a partial response and grab the location header
              if (xhr.status === 201){
                // look for the location header
                var getCachedSearchResultUrl = xhr.getResponseHeader('location');

                // initialize the search API GET URI (with zoom parameters)
                var zoomSuffix = '?zoom=element,element:price,element:definition';
                getCachedSearchResultUrl = getCachedSearchResultUrl + zoomSuffix;

                // initialize the search result model
                var searchResultModel = new Model.GetSearchResult();

                // fire a get rquest to get the actual search results
                searchResultModel.fetch({
                  url:getCachedSearchResultUrl,
                  success:function(data, textStatus, xhr){

                    // declare the target render region
                    var searchResultRegion = new Marionette.Region({
                      el:'[data-region="searchResultsRegion"]'
                    });
                    // render the search results
                    searchResultRegion.show(new View.SearchResults({
                      collection:data
                    }));

                  },
                  error:function(response){
                    EventBus.trigger('log.error','error on second stage search: ' + response);
                  }
                });
              }
              else{
                EventBus.trigger('log.warn', 'unexpected status from initial search request: ' + xhr.status)
              }

            },
            error:function(response){
              EventBus.trigger('log.error','Exception in search: ' + response);
            }
          });
        }
      );

      return searchResultsLayout;

    };


    return {
      DefaultSearchView:defaultSearchView,
      SearchResultsView:searchResultsView
    };
  }
);
