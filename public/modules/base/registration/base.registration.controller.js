/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 * Registration Controller
 * The MVC controller instantiates the registration model and views, requests the URL to which the form should be
 * posted from Cortex and then renders the views into the designated regions.
 */

define(function (require) {
    var ep = require('ep');
    var EventBus = require('eventbus');
    var Backbone = require('backbone');

    var View = require('registration.views');
    var i18n = require('i18n');
    var template = require('text!modules/base/registration/base.registration.templates.html');

    $('#TemplateContainer').append(template);

    // Collection for form errors, instantiated with an empty list of models and with a comparator
    // to sort the Collection alphabetically by error message.
    var formErrorsCollection = new Backbone.Collection({},{comparator: "error"});

    var registrationLayout = new View.DefaultLayout();

    /**
     * The default controller for the registration module. Triggers an event to get the form submit URL from Cortex and
     * returns the default registration layout (the regions of this layout are populated later when we have retrieved
     * all of the necessary data from Cortex).
     * @returns {View.DefaultLayout}  fully rendered registration DefaultLayout
     */
    var defaultController = function () {
      // Trigger a request to Cortex to get the submitUrl for the form
      EventBus.trigger('registration.requestFormSubmitUrl');

      return registrationLayout;
    };

    // ========================================
    // CONTROLLER HELPER FUNCTIONS
    // ========================================

    /**
     * Builds and returns a JSON object of name/values from the input fields of the registration form.
     *
     * @param form A DOM object representation of the registration form
     * @returns JSON object
     */
    function getJSONFormData(form) {
      var dataObj = {};
      for (var i= 0, len = form.length; i < len; i++) {
        var input = form[i];
        // Add all form fields (EXCEPT the password confirmation field) to the data object
        if (input.name && input.name !== 'passwordConfirm') {
          dataObj[input.name] = input.value;
        }
      }
      return JSON.stringify(dataObj);
    }

    /**
     * Helper function to create a CollectionView based on the current state of the errors collection and
     * render it in the feedback message region of the registration form layout.
     */
    function renderErrorMessagesToFeedbackRegion () {
      View.clearPasswordFields(registrationLayout.registrationFormRegion);

      var errorCollectionView = new View.RegistrationErrorCollectionView({
        collection: formErrorsCollection
      });

      registrationLayout.registrationFeedbackMsgRegion.show(errorCollectionView);
    }

    /**
     * Inspects the 'password' and 'passwordConfirm' inputs of a form DOM element (the registration form)
     * and returns true if the values of the two fields match. If the values do not match, a localized
     * error message is added to the collection of form errors so it can be displayed to the user.
     *
     * @param form The registration form DOM element whose password fields are to be validated
     * @returns {boolean} True if the fields match, false if they do not match
     */
    function isPasswordConfirmed (form) {
      if (form.password && form.passwordConfirm) {
        var passwordValue = form.password.value;
        var passwordConfirmValue = form.passwordConfirm.value;

        if (passwordValue !== passwordConfirmValue) {
          formErrorsCollection.add({
            "error": i18n.t('registration.errorMsg.passwordsDoNotMatch')
          });
          return false;
        }
      } else {
        ep.logger.warn("Registration form password fields are missing or mis-named");
        return false;
      }
      return true;
    }

    /**
     * Attempts to parse a route (stored in JSON) from the 'registrationFormReturnTo' sessionStorage item.
     *
     * @returns {string} Undefined or the URL fragment (including parameters) from sessionStorage
     */
    function getRouteObjFromStorage() {
      // Attempt to get a stored route from sessionStorage
      var storedRoute = ep.io.sessionStore.getItem('registrationFormReturnTo');

      var urlFragment;

      if (storedRoute) {
        var storedRouteObj = {};

        // Remove the return route from sessionStorage
        ep.io.sessionStore.removeItem('registrationFormReturnTo');

        // Attempt to parse the route object from the stored JSON
        try {
          storedRouteObj = JSON.parse(storedRoute);
        } catch (error) {
          ep.logger.error("Unable to parse JSON route from sessionStorage: " + error);
        }

        if (storedRouteObj.name) {
          urlFragment = ep.router.rebuildUrlFragment(ep.app.config.routes, storedRouteObj.name, storedRouteObj.params);
        }
      }

      return urlFragment;
    }

    // ========================================
    // EVENT HANDLERS
    // ========================================

    /**
     * Called when a submit URL for the registration form is successfully retrieved from Cortex.
     * Parses the submit URL from the raw JSON response and uses it to render the registration form view
     * in the appropriate region of the registration layout.
     */
    EventBus.on('registration.requestFormSubmitUrlSuccess', function(response) {
      // Parse the submit URL from the JSON response
      var parsedSubmitUrl = jsonPath(response, '$..links[?(@.rel="registeraction")].href');
      if (parsedSubmitUrl && _.isArray(parsedSubmitUrl)) {
        // Render the registration form with the submit URL
        registrationLayout.registrationFormRegion.show(
          new View.RegistrationFormItemView({
            model: new Backbone.Model({
              submitUrl: parsedSubmitUrl[0]
            })
          })
        );
      } else {
        ep.logger.error('Unable to parse registration form submit URL');
      }
    });

    /**
     * Makes an AJAX request to Cortex to retrieve the submit URL for the registration form.
     */
    EventBus.on('registration.requestFormSubmitUrl', function() {
      var ajaxModel = new ep.io.defaultAjaxModel({
        type: 'GET',
        url: ep.io.getApiContext() + '/registrations/' + ep.app.config.cortexApi.scope + '/newaccount/form',
        success: function(response) {
          EventBus.trigger('registration.requestFormSubmitUrlSuccess', response);
        }
      });

      ep.io.ajax(ajaxModel.toJSON());
    });

    /**
     * Routes the user to a return route held in sessionStorage or back to the homepage
     * @param showLogin {Boolean} Show the login form after navigating to the return route
     */
    EventBus.on('registration.navigateToReturnRoute', function (showLogin) {
      var routeFromStorage = getRouteObjFromStorage();
      if (routeFromStorage) {
        // Navigate to the route and call its associated function
        ep.router.navigate(routeFromStorage, true);
      } else {
        // Navigate to the homepage route
        ep.router.navigate('', true);
      }

      if (showLogin) {
        // Prompt the user to login
        EventBus.trigger('layout.loadRegionContentRequest', {
          region: 'appModalRegion',
          module: 'auth',
          view: 'LoginFormView'
        });
      }
    });

    /**
     * Called when an error other than an HTTP 400 is returned by Cortex when the registration form is submitted.
     * Renders the appropriate localized error message to the feedback region of the layout.
     */
    EventBus.on('registration.submitFormFailed', function (response) {
      // The return error message
      var errorMsg = '';

      switch (response.status) {
        case 403:
          errorMsg = i18n.t('registration.errorMsg.alreadyLoggedIn');
          break;
        case 409:
          errorMsg = i18n.t('registration.errorMsg.usernameAlreadyExists');
          break;
        default:
          errorMsg = i18n.t('registration.errorMsg.generic');
      }

      formErrorsCollection.add({
        "error": errorMsg
      });

      // Re-enable the save button and render error messages
      ep.ui.enableButton(registrationLayout.registrationFormRegion.currentView, 'saveButton');
      renderErrorMessagesToFeedbackRegion();
    });

    /**
     * Called when a HTTP 400 error is returned by Cortex when the registration form is submitted.
     * Translates the raw Cortex error message into a Backbone Collection of localized strings
     * and renders it to the appropriate region.
     *
     * NOTE: this is temporary until Cortex returns specific error codes/keys for localization mapping.
     */
    EventBus.on('registration.submitFormFailed.invalidFields', function (errMsg) {
      // Get the array of translated error messages
      var translatedErrorsArr = View.translateRegistrationErrorMessage(errMsg);

      // Iterate over the array of error messages and add them to the Collection as Backbone Models
      for (var i = 0, len = translatedErrorsArr.length; i < len; i++) {
        formErrorsCollection.add({
          "error": translatedErrorsArr[i]
        });
      }

      // Re-enable the save button and render error messages
      ep.ui.enableButton(registrationLayout.registrationFormRegion.currentView, 'saveButton');
      renderErrorMessagesToFeedbackRegion();
    });

    /**
     * Handler for the event triggered in the success callback of the AJAX registration request to Cortex.
     * Triggers an event to return the user to the page they were on prior to registration
     */
    EventBus.on('registration.submitFormSuccess', function() {
      // Load the referring route from sessionStorage
      // The boolean parameter will cause the login form to be displayed after navigating to the route
      EventBus.trigger('registration.navigateToReturnRoute', true);
    });


    /**
     * Make an AJAX POST request to cortex server with the given registration form, and trigger corresponding events
     * in case of success or error.
     *
     * @param form A registration form DOM object
     */
    EventBus.on('registration.submitForm', function(form) {
      var formData = getJSONFormData(form);

      // Remove any form errors that were previously generated before we make the AJAX request
      formErrorsCollection.reset();

      // Check that the password fields match before proceeding
      if (isPasswordConfirmed(form)) {
        var ajaxModel = new ep.io.defaultAjaxModel({
          type: 'POST',
          url: form.action,
          data: formData,
          success: function() {
            EventBus.trigger('registration.submitFormSuccess');
          },
          customErrorFn: function(response) {
            if (response.status === 400) {
              EventBus.trigger('registration.submitFormFailed.invalidFields', response.responseText);
            }
            else {
              EventBus.trigger('registration.submitFormFailed', response);
            }
          }
        });
        ep.io.ajax(ajaxModel.toJSON());
      } else {
        // Re-enable the save button and render error messages
        ep.ui.enableButton(registrationLayout.registrationFormRegion.currentView, 'saveButton');
        renderErrorMessagesToFeedbackRegion();
      }
    });

    /**
     * Event handler for the registration form save button click event.
     * Checks if the form parameter is a DOM element and then triggers the submitForm event.
     */
    EventBus.on('registration.cancelButtonClicked', function() {
      EventBus.trigger('registration.navigateToReturnRoute');
    });

    /**
     * Event handler for the registration form save button click event.
     * Checks if the form parameter is a DOM element and then triggers the submitForm event.
     */
    EventBus.on('registration.saveButtonClicked', function(form) {
      ep.ui.disableButton(registrationLayout.registrationFormRegion.currentView, 'saveButton');

      if (_.isElement(form)) {
        EventBus.trigger('registration.submitForm', form);
      } else {
        ep.logger.error("Registration form parameter is not a valid HTML element");
      }
    });

    /* test-code */
    var __test_only__ = {};
    __test_only__.getJSONFormData = getJSONFormData;
    __test_only__.getRouteObjFromStorage = getRouteObjFromStorage;
    __test_only__.isPasswordConfirmed = isPasswordConfirmed;
    __test_only__.renderErrorMessagesToFeedbackRegion = renderErrorMessagesToFeedbackRegion;
    /* end-test-code */

    return {
      /* test-code */
      __test_only__: __test_only__,
      /* end-test-code */
      DefaultController: defaultController
    };
  }
);