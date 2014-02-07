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
    var Mediator = require('mediator');
    var Backbone = require('backbone');
    var i18n = require('i18n');

    var View = require('registration.views');
    var template = require('text!modules/base/registration/base.registration.templates.html');

    $('#TemplateContainer').append(template);

    var registrationModel = new Backbone.Model();
    var formErrorsCollection = new Backbone.Collection();
    var registrationLayout = new View.DefaultLayout();

    /**
     *
     * @returns {View.DefaultLayout}  fully rendered registration DefaultLayout
     */
    var defaultController = function () {
      EventBus.trigger('registration.requestFormSubmitUrl');


      return registrationLayout;
    };


    EventBus.on('registration.submitFormFailed', function () {
      // Generic fail message here
    });

    EventBus.on('registration.submitFormFailed.invalidFields', function (errMsg) {
      // TODO: translate error messages here

      formErrorsCollection.add([
        {error: 'Error message #1'},
        {error: 'Error message #2'}
      ]);

      var errorCollectionView = new View.RegistrationErrorItemCollection({
        collection: formErrorsCollection
      });
      registrationLayout.registrationFeedbackMsgRegion.show(errorCollectionView);
    });

    EventBus.on('registration.submitFormSuccess', function() {
      //
    });

    /**
     *
     * @param actionLink url to post request to server with.
     */
    EventBus.on('registration.requestFormSubmitUrl', function() {
      if (actionLink) {
        var ajaxModel = new ep.io.defaultAjaxModel({
          type: 'GET',
          url: actionLink,
          success: function() {
            EventBus.trigger('checkout.updateChosenShippingAddressSuccess');
          },
          customErrorFn: function() {
            EventBus.trigger('checkout.updateChosenShippingAddressFail');
          }
        });

        ep.io.ajax(ajaxModel.toJSON());
      }
      else {
        ep.logger.error("Trying to update chosen shipping address without action link");
      }
    });


    /**
     * Make a ajax POST request to cortex server with given action links, and trigger corresponding events
     * in case of success or error. Start activity indicator in affected regions.
     *
     * @param actionLink url to post request to server with.
     */
    EventBus.on('registration.submitForm', function(actionLink) {
      var ajaxModel = new ep.io.defaultAjaxModel({
        type: 'POST',
        url: actionLink,
        success: function() {
          // Clear ep.io.sessionStore
          // Load the referring route from sessionStorage
          // Prompt the user to login
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

    return {
      DefaultController: defaultController
    };
  }
);