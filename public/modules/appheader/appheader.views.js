/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 05/04/13
 * Time: 1:54 PM
 *
 */

define(['ep', 'mediator', 'eventbus','backbone','marionette','i18n','modules/appheader/appheader.models'],
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
      onShow:function(){
        var elementWidth = $('.logo-container').outerWidth();
        EventBus.trigger('view.headerLogoViewRendered', elementWidth);
        Mediator.fire('mediator.globalNavRendered');
      }
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

    /*
     *
     * Functiontions
     *
     * */
    var getLoginRequestModel = function(){
      var retVal = new Model.AuthRequestModel();
      retVal.set('userName',$('#OAuthUserName').val());
      retVal.set('password',$('#OAuthPassword').val());
      retVal.set('role','REGISTERED');
      retVal.set('scope',ep.app.config.cortexApi.store);
      return retVal;
    };

    return {
      PageHeaderView:PageHeaderView,
      HeaderLogoView:HeaderLogoView,
      EPDevInstrumentationView:EPDevInstrumentationView,
      getLoginRequestModel:getLoginRequestModel

    };
  }
);
