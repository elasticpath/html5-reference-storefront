/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 *
 */

define(['ep', 'mediator', 'eventbus','backbone','marionette','i18n','appheader.models'],
  function(ep, Mediator, EventBus,Backbone, Marionette,i18n,Model){
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
      templateHelpers:viewHelpers,
      className:'container appheader-container',
      onShow:function(){
        var elementWidth = $('.logo-container').outerWidth();
        EventBus.trigger('view.headerLogoViewRendered', elementWidth);
        Mediator.fire('mediator.appHeaderRendered');
      }
    });
    var HeaderLogoView = Backbone.Marionette.Layout.extend({
      template:'#LogoTemplateContainer'

    });



    return {
      PageHeaderView:PageHeaderView,
      HeaderLogoView:HeaderLogoView

    };
  }
);
