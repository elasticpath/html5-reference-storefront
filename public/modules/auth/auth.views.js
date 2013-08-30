/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 */
define(['ep', 'marionette', 'eventbus', 'i18n', 'modules/auth/auth.models'],
  function(ep, Marionette, EventBus, i18n, Model){

    var viewHelpers = {
      getI18nLabel:function(key){
        var retVal = key;
        try{
          retVal = i18n.t(key);
        }
        catch(e){
          // slient failure on label rendering
        }

        return retVal;
      },
      getLoginState:function() {
        return window.localStorage.oAuthRole;
      },
      getLoginText:function(state) {
        var retVal;
        if (state === 'PUBLIC') {
          retVal = this.getI18nLabel('auth.loginMenu');
        } else {
          retVal = window.localStorage.oAuthUserName;  // FIXME not user's name
        }
        return retVal;
      }
    };

    var defaultLayout = Backbone.Marionette.Layout.extend({
      template:'#DefaultAuthLayoutTemplate',
      className:'auth-container',
      templateHelpers:viewHelpers,
      events:{
        'click .btn-auth-dropdown':function(event){
          event.preventDefault();
          $('.auth-nav-container').toggle(250);
          EventBus.trigger('auth.btnAuthMenuDropdownClicked');
        }
      },
      onShow:function() {
        ep.app.addRegions({
          mainAuthView:'[data-region="authMainRegion"]'
        });
      }
    });

    var loginFormView = Backbone.Marionette.ItemView.extend({
      template:'#AuthLoginFormTemplate',
      className:'auth-login-container',
      templateHelpers:viewHelpers,
      events:{
        'click .btn-auth-login':function(event) {
          event.preventDefault();
          EventBus.trigger('auth.loginFormSubmitButtonClicked',event); // TODO why use mediator?
        }
      }
    });

    var profileMenuView = Backbone.Marionette.ItemView.extend({
      template:'#AuthProfileMenuTemplate',
      templateHelpers:viewHelpers,
      tagName:'ul',
      className: 'auth-profile-menu-list',
      events:{
        'click .btn-auth-logout':function(event){
          event.preventDefault();
          EventBus.trigger("auth.logoutBtnClicked", event);
        }
      }
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
      DefaultLayout:defaultLayout,
      LoginFormView:loginFormView,
      ProfileMenuView:profileMenuView,
      getLoginRequestModel:getLoginRequestModel
    };
  }
);
