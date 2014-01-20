/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
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
