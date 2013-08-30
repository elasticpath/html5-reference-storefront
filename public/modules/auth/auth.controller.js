/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 * 
 */
define(['ep', 'app', 'mediator', 'eventbus', 'cortex', 'modules/auth/auth.models', 'modules/auth/auth.views', 'text!modules/auth/auth.templates.html'],
  function(ep, App, Mediator, EventBus, Cortex, Model, View, template){

    $('#TemplateContainer').append(template);

    _.templateSettings.variable = 'E';

    var defaultView = function() {
      var authLayout =  new View.DefaultLayout();
      return authLayout;
    };



    EventBus.on('auth.logoutBtnClicked', function(event) {
      Mediator.fire('mediator.logoutRequest');
    });

    EventBus.on('auth.loginFormSubmitButtonClicked', function(event) {
      var requestModel = View.getLoginRequestModel();

      var authString = 'grant_type=password&username='
          + requestModel.get('userName') + '&password='
          + requestModel.get('password') + '&scope='
          + requestModel.get('scope') + '&role='
          + requestModel.get('role');

      ep.logger.info('login form submit clicked String: ' + authString);

      // make sure the values are valid
      // TODO - change to native ep.io
      $.ajax({
        type:'POST',
        url:'/' + ep.app.config.cortexApi.path + '/oauth2/tokens',
        contentType: 'application/x-www-form-urlencoded',
        data:authString,
        success:function(json, responseStatus, xhr){
          // $('#authHeader').val("Bearer " + json.access_token);
          //cortex.ui.saveField('authHeader');
          window.localStorage.setItem('oAuthRole', 'REGISTERED');
          window.localStorage.setItem('oAuthScope', ep.app.config.cortexApi.store);
          window.localStorage.setItem('oAuthToken', 'Bearer ' + json.access_token);
          window.localStorage.setItem('oAuthUserName', requestModel.attributes.userName);

          ep.logger.info('username: ' + requestModel.userName);

          /*if (authRole === 'PUBLIC') {
           } else {
           window.localStorage.setItem('oAuthUserName', userName);
           }*/
          EventBus.trigger('app.authInit');
        },
        error:function(response){
          if (response.status === 400) {
            EventBus.trigger('auth.loginFormValidationFailed', response.responseText);

          }
          else if (response.status === 401) {
            EventBus.trigger('auth.loginRequestFailed', response.responseText);
          }
          else {
            // FIXME need better naming
            EventBus.trigger('auth.loginFailedOtherReasons');
            ep.logger.error('ERROR login: ' + response.responseText);
          }
        }
      });
    });
    // error messaging - feedback
    EventBus.on("auth.loginRequestFailed", function(msg) {
      $('.auth-feedback-container').text(msg);
    });
    EventBus.on("auth.loginFormValidationFailed", function(msg) {
      $('.auth-feedback-container').text(msg);
    });
    EventBus.on("auth.loginFailedOtherReasons", function() {
      $('.auth-feedback-container').text("Sorry, login failed."); // FIXME localized better message
    });
    // Logout Request
    EventBus.on('auth.logoutRequest',function(){
      try{
        window.localStorage.removeItem('oAuthRole');
        window.localStorage.removeItem('oAuthScope');
        window.localStorage.removeItem('oAuthToken');
        window.localStorage.removeItem('oAuthUserName');
        document.location.reload();
      }
      catch(err){
        ep.logger.error('Error - removing authentication tokens from local storage');
      }


    });

    // load auth menu request
    EventBus.on('auth.loadAuthMenuRequest', function(state) {
      var viewName = 'LoginFormView';
      if (state === 'REGISTERED'){
        viewName = 'ProfileMenuView';
      }
      EventBus.trigger('layout.loadRegionContentRequest',{
        region:'mainAuthView',
        module:'auth',
        view: viewName
      });

    });

    // auth menu item dropdown clicked
    EventBus.on('auth.btnAuthMenuDropdownClicked',function(){
      var state = 'PUBLIC';
      if (window.localStorage.oAuthRole){
        state = window.localStorage.oAuthRole;
        if (state){
          EventBus.trigger("auth.loadAuthMenuRequest", state);
        }
        else{
          ep.logger.warn('auth.btnAuthMenuDropdownClicked with no state');
        }
      }

    });



    return {
      AuthModel:Model.AuthModel,
      DefaultView:defaultView,
      LoginFormView: function() {return new View.LoginFormView(); },
      ProfileMenuView: function() {return new View.ProfileMenuView(); }
    };
  }
);
