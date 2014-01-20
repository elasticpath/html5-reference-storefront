/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 *
 */
define(['ep', 'marionette', 'eventbus', 'i18n', 'auth.models'],
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
        if (ep.io.localStore.getItem('oAuthRole') === 'PUBLIC') {
          retVal = this.getI18nLabel('auth.loginMenu');
        } else {
          retVal = ep.io.localStore.getItem('oAuthUserName');
        }
        return retVal;
      },
      getMenuItemText:function(){
        var retVal = '';
        if (ep.io.localStore.getItem('oAuthRole') === 'PUBLIC') {
          retVal = 'auth.loginMenu';
        }
        return retVal;
      },
      generateHref: function (route) {
        return  ep.app.config.routes[route] || null;
      }
    };

    /*
    * Show the Profile Dropdown menu
    * */
    function showProfileMenu(){
      $('.auth-nav-container').show(250);
    }
    function hideProfileMenu(){
      $('.auth-nav-container').hide(250);
    }

    /*
     * Default Layout View: loginMenu button, and controlling the toggle menu
     */
    var defaultLayout = Backbone.Marionette.Layout.extend({
      template:'#DefaultAuthLayoutTemplate',
      className:'auth-container',
      templateHelpers:viewHelpers,
      events:{
        'click .btn-auth-menu':function(event){
          event.preventDefault();
          event.stopPropagation();
          // don't bother firing any events if the menu is open
          if(!$('.auth-nav-container').is(':visible')){
            EventBus.trigger('auth.btnAuthGlobalMenuItemClicked');
          }
          else{
            hideProfileMenu();
          }
        }
      },
      onShow:function() {
        ep.app.addRegions({
          mainAuthView:'[data-region="authMainRegion"]'
        });
        // set up the global events to close the profile menu
        $('body').unbind().bind('click',function(event){
          if ($('.auth-nav-container').is(':visible')){
            var container = $('.auth-nav-container');
            if (!container.is(event.target) && container.has(event.target).length === 0) {
              container.hide();
            }
          }
        });

      }
    });

    /*
     * Login Form View: login form and login button
     */
    var loginFormView = Backbone.Marionette.ItemView.extend({
      template:'#AuthLoginFormTemplate',
      templateHelpers:viewHelpers,
      className:'auth-login-container',
      attributes: {
        "data-el-container":"global.loginMenu"
      },
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
      attributes:{
        "data-el-container":"global.profileMenu"
      },
      events:{
        'click .btn-auth-logout':function(event){
          event.preventDefault();
          EventBus.trigger("auth.logoutBtnClicked");
        },
        'click .profile-link':function(event){
          $('.auth-nav-container').hide(250);
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
        var key = 'auth.' + msg;
        var errMsg = viewHelpers.getI18nLabel(key);
        $('.auth-feedback-container').text(errMsg);
        $('.auth-feedback-container').attr('data-i18n', key);
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
      displayLoginErrorMsg:displayLoginErrorMsg,
      showProfileMenu:showProfileMenu,
      hideProfileMenu:hideProfileMenu
    };
  }
);
