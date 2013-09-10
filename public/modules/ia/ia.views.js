/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 */
define(['ep','eventbus'],
  function(ep, EventBus){

    var viewHelpers = {
      generateCategoryHref:function(uri) {
        var retVal;

        if (uri) {
          retVal = ep.app.config.routes.category + '/' + ep.ui.encodeUri(ep.app.config.cortexApi.path + uri);
        }
        else {
          retVal = '';
          ep.logger.warn('main nav category loaded without uri');
        }

        return retVal;
      }
    };


    // Nav Item View
    var NavItemView = Backbone.Marionette.ItemView.extend({
      template:'#NavItemTemplate',
      tagName: 'li',
      templateHelpers: viewHelpers
    });

    // Main Nav View
    var MainNavView = Backbone.Marionette.CompositeView.extend({
      template:'#MainNavTemplate',
      itemViewContainer: 'ul[data-region="mainNavList"]',
      itemView: NavItemView,
      templateHelper:viewHelpers,
      onShow:function(){
        $('.btn-main-nav-toggle').hide();
        ep.logger.info('main nav on show, toggle btn hidden.');
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
