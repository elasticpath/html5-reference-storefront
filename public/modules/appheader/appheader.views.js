/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 05/04/13
 * Time: 1:54 PM
 *
 */
define(['eventbus','backbone','marionette','i18n','modules/appheader/appheader.models'],
  function(EventBus,Backbone, Marionette,i18n,Model){

    var viewHelpers = {
      getI18nLabel:function(key){
        retVal = key;
        try{
          retVal = i18n.t(key);
        }
        catch(e){
          // slient failure on label rendering
        }

        return retVal;

      }
    };

    var PageHeaderView = Backbone.Marionette.Layout.extend({
      template:'#AppHeaderDefaultTemplateContainer',
      events:{
        'click .btn-cmd':function(event){
          EventBus.trigger('profile.authButtonClicked',event);
        },
        'click .oauth-menu-toggle':function(event){
          $('.' + $(event.target).data('target')).toggle(250);
        }
      },
      onShow:function(){
        var elementWidth = $('.logo-container').outerWidth();
        EventBus.trigger('view.headerLogoViewRendered', elementWidth);
      },
      templateHelpers:viewHelpers
    });
    var HeaderLogoView = Backbone.Marionette.Layout.extend({
      template:'#LogoTemplateContainer'

    });

    var EPDevInstrumentationItemView = Backbone.Marionette.ItemView.extend({
      template:'#EPDevAppHeaderInstrumentationItemTemplate',
      tagName:'tr'
    });
    var EPDevInstrumentationView = Backbone.Marionette.CompositeView.extend({
      template:'#EPDevAppHeaderInstrumentationTemplate',
      itemView:EPDevInstrumentationItemView,
      itemViewContainer:'tbody'
    });

    return {
      PageHeaderView:PageHeaderView,
      HeaderLogoView:HeaderLogoView,
      EPDevInstrumentationView:EPDevInstrumentationView

    };
  }
);
