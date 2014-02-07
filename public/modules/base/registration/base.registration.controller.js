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
        },
        customErrorFn: function() {
          ep.logger.error("Unable to retrieve registration form submit URL from Cortex");
        }
      });

      ep.io.ajax(ajaxModel.toJSON());
    });

    EventBus.on('registration.submitFormFailed', function () {
      // Generic fail message here
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

      // Empty the Collection of form errors
      formErrorsCollection.reset();

      // Iterate over the array of error messages and add them to the Collection as Backbone Models
      for (var i = 0, len = translatedErrorsArr.length; i < len; i++) {
        formErrorsCollection.add({
          "error": translatedErrorsArr[i]
        });
      }

      var errorCollectionView = new View.RegistrationErrorCollectionView({
        collection: formErrorsCollection
      });

      registrationLayout.registrationFeedbackMsgRegion.show(errorCollectionView);
    });

    EventBus.on('registration.submitFormSuccess', function() {
      // Revoke the public auth token by removing it from local storage
      ep.io.localStore.removeItem('oAuthToken');

      // TODO: load the referring route from sessionStorage

      // Prompt the user to login
      EventBus.trigger('layout.loadRegionContentRequest', {
        region: 'appModalRegion',
        module: 'auth',
        view: 'LoginFormView'
      });
    });


    /**
     * Make a ajax POST request to cortex server with give registration form, and trigger corresponding events
     * in case of success or error.
     *
     * @param form A registration form DOM object
     */
    EventBus.on('registration.submitForm', function(form) {
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
          if (input.name) {
            dataObj[input.name] = input.value;
          }
        }
        return JSON.stringify(dataObj);
      }

      var formData = getJSONFormData(form);

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
            EventBus.trigger('registration.submitFormFailed');
          }
        }
      });

      ep.io.ajax(ajaxModel.toJSON());
    });

    /**
     * Event handler for the registration form save button click event.
     * Checks if the form parameter is a DOM element and then triggers the submitForm event.
     */
    EventBus.on('registration.saveButtonClicked', function(form) {
      if (_.isElement(form)) {
        EventBus.trigger('registration.submitForm', form);
      } else {
        ep.logger.error("Registration form parameter is not a valid HTML element");
      }
    });

    return {
      DefaultController: defaultController
    };
  }
);
