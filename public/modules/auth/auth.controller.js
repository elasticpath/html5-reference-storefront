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
      var authLayout =  new View.DefaultView();
      return authLayout;
    };


    /*
    *
    * Functions
    *
    * */


    // log user out
    function logUserOut(){

    }

    /*
    *
    * Event Listeners
    *
    * */
    /*
     * Load login menu - load login form or profile menu depend on authentication state
     */
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

    // auth menu request
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


    /*
     *
     * Login Error Message Feedback
     */
    EventBus.on("auth.loginRequestFailed", function(msg) {
      View.displayLoginErrorMsg(msg);
    });

    EventBus.on("auth.loginFormValidationFailed", function(msg) {
      View.displayLoginErrorMsg(msg);

    });


    /*
     * Authentication Request Types:
     *  - Login (POST)
     *  - get Public Authentication (POST)
     *  - Logout (DELETE)
     */
    EventBus.on('auth.authenticationRequest', function(authObj) {
      ep.io.ajax(authObj);
    });


    /*
     * Login Button Clicked - submit login form to server
     */
    EventBus.on('auth.loginFormSubmitButtonClicked', function () {
      var requestModel = View.getLoginRequestModel();

      if (requestModel.isComplete()) {
        var authString = 'grant_type=password&username=' + requestModel.get('userName')
          + '&password=' + requestModel.get('password')
          + '&scope=' + requestModel.get('scope')
          + '&role=' + requestModel.get('role');

        var loginModel = new Model.LoginModel();
        loginModel.set('data', authString);
        loginModel.set('userName', requestModel.attributes.userName);

        EventBus.trigger('auth.authenticationRequest', loginModel.attributes);
      }
      else {
        EventBus.trigger('auth.loginFormValidationFailed', 'loginFormMissingFieldsErrMsg');
      }
    });

    /*
     * Generate Public Authentication Request
     */
    EventBus.on('auth.generatePublicAuthTokenRequest', function() {
      var authString = 'grant_type=password&scope=' + ep.app.config.cortexApi.scope + '&role=PUBLIC';

      var publicAuthModel = new Model.LoginModel();
      publicAuthModel.set('data', authString);

      EventBus.trigger('auth.authenticationRequest', publicAuthModel.attributes);
    });

    /*
     * Logout Button Clicked - make logout request to server
     */
    EventBus.on('auth.logoutBtnClicked', function() {

      var logoutModel = new Model.LogoutModel();

      EventBus.trigger('auth.authenticationRequest', logoutModel.attributes);
    });


    return {
      DefaultView:defaultView,
      LoginFormView: function() {return new View.LoginFormView(); },
      ProfileMenuView: function() {return new View.ProfileMenuView(); },
      logUserOut:logUserOut
    };
  }
);
