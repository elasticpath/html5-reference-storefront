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
      getLoginText:function() {
        var retVal;
        if (window.localStorage.oAuthRole === 'PUBLIC') {
          retVal = this.getI18nLabel('auth.loginMenu');
        } else {
          retVal = window.localStorage.oAuthUserName;  // FIXME not user's name
        }
        return retVal;
      }
    };

    /*
     * Default Layout View: loginMenu button, and controlling the toggle menu
     */
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

    /*
     * Login Form View: login form and login button
     */
    var loginFormView = Backbone.Marionette.ItemView.extend({
      template:'#AuthLoginFormTemplate',
      className:'auth-login-container',
      templateHelpers:viewHelpers,
      events:{
        'click .btn-auth-login':function(event) {
          event.preventDefault();
          EventBus.trigger('auth.loginFormSubmitButtonClicked');
        }
      }
    });

    /*
     * Profile Menu View: menu view presented after logging-in
     *  show logout button, and links and info regarding to user profile
     */
    var profileMenuView = Backbone.Marionette.ItemView.extend({
      template:'#AuthProfileMenuTemplate',
      templateHelpers:viewHelpers,
      tagName:'ul',
      className: 'auth-profile-menu-list',
      events:{
        'click .btn-auth-logout':function(event){
          event.preventDefault();
          EventBus.trigger("auth.logoutBtnClicked");
        }
      }
    });


    /*
     *
     * Functions
     *
     * */
    var getLoginRequestModel = function(){
      var retVal = new Model.LoginFormModel();
      retVal.set('userName',$('#OAuthUserName').val());
      retVal.set('password',$('#OAuthPassword').val());
      retVal.set('role','REGISTERED');
      retVal.set('scope',ep.app.config.cortexApi.scope);
      return retVal;
    };

    var displayLoginErrorMsg = function(msg){
      if (msg) {
        var errMsg = viewHelpers.getI18nLabel('auth.' + msg);
        $('.auth-feedback-container').text(errMsg);
      }
      else {
        ep.logger.warn('DisplayLoginErrorMsg called without error message');
      }
    };

    return {
      DefaultView:defaultLayout,
      LoginFormView:loginFormView,
      ProfileMenuView:profileMenuView,
      getLoginRequestModel:getLoginRequestModel,
      displayLoginErrorMsg:displayLoginErrorMsg
    };
  }
);
