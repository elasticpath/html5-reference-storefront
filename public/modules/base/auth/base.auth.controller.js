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
    var i18n = require('i18n');
    var utils = require('utils');

    var Model = require('auth.models');
    var View = require('auth.views');
    var template = require('text!modules/base/auth/base.auth.templates.html');

    $('#TemplateContainer').append(template);
    _.templateSettings.variable = 'E';

    var checkoutAuthOptionsView;

    var defaultView = function(options) {
      return new View.DefaultView(options);
    };

    var checkoutAuthOptionsController = function() {
      if (ep.app.isUserLoggedIn()) {
        // If user is already logged in, they shouldn't be allowed to authenticate again - redirect to cart.
        ep.router.navigate(ep.app.config.routes.cart, true);
      }
      else {
        checkoutAuthOptionsView = new View.CheckoutAuthOptionsLayout();
        checkoutAuthOptionsView.on('show', function() {
          checkoutAuthOptionsView.loginRegion.show(new View.CheckoutAuthLoginOptionView());
          checkoutAuthOptionsView.registrationRegion.show(new View.CheckoutAuthRegisterOptionView());

          // Attempt to retrieve an order link from session storage (set by the checkout module)
          var orderLink = ep.io.sessionStore.getItem('orderLink');

          // If there is no 'orderLink' item in sessionStorage, check if it is filed under
          // 'anonymousCheckoutOrderLink' (in case we have visited this page before)
          if (!orderLink) {
            orderLink = ep.io.sessionStore.getItem('anonymousCheckoutOrderLink');
          }

          if (orderLink) {
            // Move the orderLink to a different session storage item so the checkout module doesn't have access
            // to it should a shopper try to directly access the checkout page via the address bar.
            ep.io.sessionStore.setItem('anonymousCheckoutOrderLink', orderLink);
            ep.io.sessionStore.removeItem('orderLink');

            var anonymousCheckoutModel = new Model.AnonymousCheckoutModel();
            anonymousCheckoutModel.fetch({
              url: anonymousCheckoutModel.getUrl(orderLink),
              success: function() {
                checkoutAuthOptionsView.anonymousCheckoutRegion.show(new View.CheckoutAuthAnonymousOptionView({
                  model: anonymousCheckoutModel
                }));
              }
            });
          }
        });

        return checkoutAuthOptionsView;
      }

    };

    // This variable is used to hold a reference to the LoginFormView - making it accessible to event handlers
    var loginFormView = {};


    function translateErrMsg(rawMsg) {
      var cortexErrMsgToI18nKeyMap = {
        "Email is missing.": "checkoutAuthOption.anonymous.errorMsg.missingEmail",
        "Email: not a well-formed email address": "checkoutAuthOption.anonymous.errorMsg.invalidEmail",
        "Username, password are missing.":"loginForm.errorMsg.missingUsernamePasswordErr",
        "Username is missing.":"loginForm.errorMsg.missingUsernameErr",
        "Password is missing.":"loginForm.errorMsg.missingPasswordErr"
      };

      return utils.translateErrorMessage(rawMsg, cortexErrMsgToI18nKeyMap, {localePrefix: 'auth.'});
    }

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
    EventBus.on('auth.loginButtonClicked', function () {
      ep.ui.disableButton(loginFormView, 'loginButton');

      EventBus.trigger('auth.submitLoginFormRequest');
    });

    EventBus.on('auth.checkoutAuthLoginButtonClicked', function (redirectLocation) {
      ep.ui.disableButton(checkoutAuthOptionsView.loginRegion.currentView, 'loginButton');

      EventBus.trigger('auth.submitCheckoutAuthLoginFormRequest', redirectLocation);
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

    /*
     * Generate Public Authentication Request
     *
     * handles both login and logout requests
     * uses different verbs - (POST/DELETE)
     */
    EventBus.on('auth.generatePublicAuthTokenRequest', function() {
      var authString = 'grant_type=password&scope=' + ep.app.config.cortexApi.scope + '&role=PUBLIC';

      var publicAuthModel = new Model.LoginModel();
      publicAuthModel.set('data', authString);

      EventBus.trigger('auth.authenticationRequest', publicAuthModel.attributes);
    });

    /**
     * Retrieves the login form values from the view, stores these values in a Backbone Model and passes a
     * JSON formatted version of this model to the authentication request event
     * @param {Backbone.Model} loginModel The model to which the login form values should be stored
     * @param {JQuery} formRegionObj jQuery object used to identify the login form being submitted
     * @param {String} [redirectLocation] If applicable, a string identifying the route to be followed
     *                                    upon successful login
     */
    function submitLoginForm (loginModel, formRegionObj, redirectLocation) {
      var loginFormValues = View.getLoginFormValues(formRegionObj);

      var authString = 'grant_type=password'
        + '&username=' + loginFormValues.userName
        + '&password=' + loginFormValues.password
        + '&scope=' + loginFormValues.scope
        + '&role=' + loginFormValues.role;

      loginModel.set('data', authString);
      loginModel.set('userName', loginFormValues.userName);
      loginModel.set('redirect', redirectLocation);

      EventBus.trigger('auth.authenticationRequest', loginModel.toJSON());
    }

    /**
     * Make submit login form to cortex server for registered authentication.
     */
    EventBus.on('auth.submitLoginFormRequest', function() {
      var loginModel = new Model.LoginModel();
      submitLoginForm(loginModel, loginFormView.$el);
    });

    EventBus.on('auth.submitCheckoutAuthLoginFormRequest', function(redirectUrl) {
      var errorFn = function(response) {
        EventBus.trigger('auth.checkoutAuthLoginRequestFailed', {
          status: response.status,
          responseText: response.responseText
        });

        ep.logger.error('response code ' + response.status + ': ' + response.responseText);
      };

      var loginModel = new Model.LoginModel();
      loginModel.set('error', errorFn);

      submitLoginForm(loginModel, checkoutAuthOptionsView.loginRegion.$el, redirectUrl);
    });

    function displayLoginFormError(response) {
      var errMsgKey = 'auth.loginForm.errorMsg.generic';
      if (response) {
        if (response.status === 401) {
          errMsgKey = 'auth.loginForm.errorMsg.badCredentialErr';
        } else if (response.status === 400) {
          errMsgKey = translateErrMsg(response.responseText)[0].error;
        }
      }

      utils.renderMsgToPage(errMsgKey, $('[data-region="authLoginFormFeedbackRegion"]'));
    }

    /**
     * Handles error case of login request failure. Will translate error message and display it in feedback region.
     */
    EventBus.on("auth.loginRequestFailed", function(response) {
      ep.ui.enableButton(loginFormView, 'loginButton');

      displayLoginFormError(response);
    });

    EventBus.on("auth.checkoutAuthLoginRequestFailed", function(response) {
      ep.ui.enableButton(checkoutAuthOptionsView.loginRegion.currentView, 'loginButton');

      displayLoginFormError(response);
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

    /* ********* Anonymous Checkout EVENT LISTENERS ************ */
    /**
     * Waiting for continue checkout anonymously button clicked, disable the button,
     * and trigger submit anonymous checkout form request.
     */
    EventBus.on('auth.continueCheckoutAnonymouslyBtnClicked', function(submitFormActionLink) {
      ep.ui.disableButton(checkoutAuthOptionsView.anonymousCheckoutRegion.currentView, 'checkoutButton');
      EventBus.trigger('auth.submitAnonymousCheckoutFormRequest', submitFormActionLink);
    });

    /**
     * Submit form with required information for anonymous checkout
     */
    EventBus.on('auth.submitAnonymousCheckoutFormRequest', function(submitFormActionLink) {
      var formValue = View.getAnonymousFormValue();

      var ajaxModel = new ep.io.defaultAjaxModel({
        type: 'POST',
        url: submitFormActionLink,
        data: JSON.stringify(formValue),
        success: function () {
          ep.ui.enableButton(checkoutAuthOptionsView.anonymousCheckoutRegion.currentView, 'checkoutButton');
          EventBus.trigger('auth.submitAnonymousCheckoutFormSuccess');
        },
        customErrorFn: function (response) {
          ep.ui.enableButton(checkoutAuthOptionsView.anonymousCheckoutRegion.currentView, 'checkoutButton');
          EventBus.trigger('auth.submitAnonymousCheckoutFormFailed', {
            status: response.status,
            responseText: response.responseText
          });
        }
      });

      ep.io.ajax(ajaxModel.toJSON());
    });

    /**
     * On submit anonymous checkout form success, continue checkout process
     */
    EventBus.on('auth.submitAnonymousCheckoutFormSuccess', function() {
      var checkoutLink = ep.io.sessionStore.getItem('anonymousCheckoutOrderLink');
      ep.io.sessionStore.removeItem('anonymousCheckoutOrderLink');
      Mediator.fire('mediator.navigateToCheckoutRequest', checkoutLink);
    });

    /**
     * On submit anonymous checkout form failure, localize the raw cortex error message, and displays the message
     * on page.
     */
    EventBus.on('auth.submitAnonymousCheckoutFormFailed', function(response) {
      var errMsgKey = 'auth.checkoutAuthOption.anonymous.errorMsg.generic';

      if (response && response.status === 400) {
        errMsgKey = translateErrMsg(response.responseText)[0].error;
      }

      utils.renderMsgToPage(errMsgKey, checkoutAuthOptionsView.anonymousCheckoutRegion.currentView.ui.feedbackRegion);
    });

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