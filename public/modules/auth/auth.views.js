/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 */
define(['ep', 'marionette', 'eventbus', 'i18n'],
  function(ep, Marionette, EventBus, i18n){

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
      },
      getLoginState:function() {

      },
      getLoginText:function(userName) {
        var retVal;
        if (userName) {
          retVal = userName;
        } else {
          retVal = this.getI18nLabel('auth.loginMenu');
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
          EventBus.trigger("auth.showAuthMenu", event);
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
          EventBus.trigger('auth.loginFormSubmitButtonClicked',event);
        }
      },
      onShow:function(){
        EventBus.on("auth.loginFailed", function(msg) {
          $('.auth-feedback-container').text(msg);
        });
      }
    });

    var profileMenuView = Backbone.Marionette.ItemView.extend({
      template:'#AuthProfileMenuTemplate',
      templateHelpers:viewHelpers,
      tagName:'ul',
      className: 'auth-profile-menu-container',
      events:{
        'click .btn-auth-logout':function(event){
          event.preventDefault();
          EventBus.trigger("auth.logoutBtnClicked", event);
        }
      }
    });

    return {
      DefaultLayout:defaultLayout,
      LoginFormView:loginFormView,
      ProfileMenuView:profileMenuView
    };
  }
);
