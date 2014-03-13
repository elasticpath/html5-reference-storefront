/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * MVC controller that manages events to
 *  - login and logout users
 *  - render the profile drop-down menu
 *
 */
define(function (require) {
    var ep = require('ep');
    var Mediator = require('mediator');
    var EventBus = require('eventbus');

    var Model = require('auth.models');
    var View = require('auth.views');
    var template = require('text!modules/base/auth/base.auth.templates.html');

    $('#TemplateContainer').append(template);

    _.templateSettings.variable = 'E';

    var defaultView = function(options) {
      return new View.DefaultView(options);
    };

    var checkoutAuthOptionsController = function() {
      var checkoutAuthOptionsView = new View.CheckoutAuthOptionsLayout();

      checkoutAuthOptionsView.on('show', function() {
        checkoutAuthOptionsView.loginRegion.show(new View.CheckoutAuthLoginOptionView());
        checkoutAuthOptionsView.registrationRegion.show(new View.CheckoutAuthRegisterOptionView());
        checkoutAuthOptionsView.anonymousCheckoutRegion.show(new View.CheckoutAuthAnonymousOptionView());
      });

      return checkoutAuthOptionsView;
    };

    // This variable is used to hold a reference to the LoginFormView - making it accessible to event handlers
    var loginFormView = {};

    /* ********* Load auth views EVENT LISTENERS ************ */
    /**
     * Load login menu - load login form or profile menu depend on authentication state
     */
    // FIXME abstract logic 1 level down from btnClicked event
    EventBus.on('auth.btnAuthGlobalMenuItemClicked',function(){
      var triggerLogIn = true;
      // if user is logged in then show the menu dropdown
      var currentRole = ep.io.localStore.getItem('oAuthRole');
      if (currentRole && (currentRole === 'REGISTERED')){
        EventBus.trigger("auth.loadAuthMenuRequest");
        triggerLogIn = false;
      }
      // show the login modal
      if (triggerLogIn){
        Mediator.fire("mediator.loadRegionContent", "loginModal");
      }
    });

    /**
     * Load profile dropdown menu in app header global nav
     */
    EventBus.on('auth.loadAuthMenuRequest', function() {
      View.showProfileMenu();
      Mediator.fire("mediator.loadRegionContent", "authProfileMenu");
    });

    /* ********* Authentication EVENT LISTENERS (login, logout, public auth) ************ */
    /*
     * Login Button Clicked - submit login form to server
     */
    EventBus.on('auth.loginButtonClicked', function (redirectLocation) {
      ep.ui.disableButton(loginFormView, 'loginButton');
      EventBus.trigger('auth.submitLoginFormRequest', redirectLocation);
    });

    /*
     * Logout Button Clicked - make logout request to server
     */
    EventBus.on('auth.logoutBtnClicked', function() {
      // Clear sessionStorage on logout
      ep.io.sessionStore.clear();

      var logoutModel = new Model.LogoutModel();
      EventBus.trigger('auth.authenticationRequest', logoutModel.toJSON());
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

    function generateAuthData(role, authForm) {
      var authFormValue = authForm || {};

      return 'grant_type=password&scope=' + ep.app.config.cortexApi.scope
        + '&role=' + role
        + '&username=' + authFormValue.userName
        + '&password=' + authFormValue.password;
    }

    EventBus.on('auth.submitLoginFormRequest', function (redirectLocation) {
      var requestModel = View.getLoginRequestModel();

      if (requestModel.isComplete()) {
        var authString = 'grant_type=password&username=' + requestModel.get('userName')
          + '&password=' + requestModel.get('password')
          + '&scope=' + requestModel.get('scope')
          + '&role=' + requestModel.get('role');

        var loginModel = new Model.LoginModel();
        loginModel.set('data', authString);
        loginModel.set('userName', requestModel.attributes.userName);
        loginModel.set('redirect', redirectLocation);

        EventBus.trigger('auth.authenticationRequest', loginModel.toJSON());
      }
      else {
        EventBus.trigger('auth.loginFormValidationFailed', 'loginFormMissingFieldsErrMsg');
      }
    });

    EventBus.on("auth.loginRequestFailed", function(msg) {
      ep.ui.enableButton(loginFormView, 'loginButton');
      View.displayLoginErrorMsg(msg);
    });

    EventBus.on("auth.loginFormValidationFailed", function(msg) {
      ep.ui.enableButton(loginFormView, 'loginButton');
      View.displayLoginErrorMsg(msg);

    });

    /*
     * Generate Public Authentication Request
     *
     * handles both login and logout requests
     * uses different verbs - (POST/DELETE)
     *
     */
    EventBus.on('auth.generatePublicAuthTokenRequest', function() {
      var authString = 'grant_type=password&scope=' + ep.app.config.cortexApi.scope + '&role=PUBLIC';

      var publicAuthModel = new Model.LoginModel();
      publicAuthModel.set('data', authString);

      EventBus.trigger('auth.authenticationRequest', publicAuthModel.attributes);
    });


    /* ********* Registration EVENT LISTENERS ************ */
    /**
     * Handler for the click event on the login form register link. Fires a mediator strategy.
     */
    EventBus.on('auth.registrationButtonClicked', function (redirect) {
      // Close the login form modal
      $.modal.close();
      Mediator.fire('mediator.registrationRequest', redirect);
    });

    /*
     auth.checkoutAuthOptionCancelBtnClicked
     auth.continueCheckoutAnonymouslyBtnClicked
     */

    return {
      DefaultView:defaultView,
      CheckoutAuthOptionsController: checkoutAuthOptionsController,
      LoginFormView: function(options) {
        // Store a reference to the LoginFormView before returning it
        loginFormView = new View.LoginFormView(options);
        return loginFormView;
      },
      ProfileMenuView: function() {return new View.ProfileMenuView(); }
    };
  }
);