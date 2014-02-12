/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 * Default Registration Views
 *
 */
define(function (require) {
    var EventBus = require('eventbus');
    var Marionette = require('marionette');
    var ViewHelpers = require('viewHelpers');
    var ep = require('ep');
    var utils = require('utils');

    /**
     * The default registration layout with regions for registration form and validation errors.
     * @type Marionette.Layout
     */
    var defaultLayout = Marionette.Layout.extend({
      template: '#RegistrationDefaultTemplate',
      templateHelpers: ViewHelpers,
      className: 'registration-container container',
      regions: {
        registrationFeedbackMsgRegion: '[data-region="registrationFeedbackMsgRegion"]',
        registrationFormRegion: '[data-region="registrationFormRegion"]'
      }
    });

    /**
     * Renders the registration form.
     * @type Marionette.ItemView
     */
    var registrationFormItemView = Marionette.ItemView.extend({
      className: 'container',
      template: '#RegistrationFormTemplate',
      templateHelpers: ViewHelpers,
      events: {
        'click [data-el-label="registration.save"]': function(event) {
          event.preventDefault();
          // Get the registration form and trigger an event to process it and send it to Cortex
          var registrationForm = $(event.currentTarget).parents('form').get(0);
          EventBus.trigger('registration.saveButtonClicked', registrationForm);
        }
      }
    });

    /**
     * Renders individual validation errors as list items (used by registrationErrorCollectionView).
     * @type Marionette.ItemView
     */
    var registrationErrorItemView = Marionette.ItemView.extend({
      tagName: 'li',
      template: '#RegistrationFormErrorItemTemplate',
      templateHelpers: ViewHelpers
    });

    /**
     * Renders an unordered list of validation errors (using registrationErrorItemView).
     * @type Marionette.CollectionView
     */
    var registrationErrorCollectionView = Marionette.CollectionView.extend({
      className: 'error-list',
      itemView: registrationErrorItemView,
      tagName: 'ul'
    });

    /**
     * Uses the translateErrorMessage() utility function to localize Cortex error messages for the registration form.
     * @param rawMsg The raw Cortex error message string
     * @returns {Array} an array of form errors
     */
    function translateRegistrationErrorMessage(rawMsg) {
      // The registration-specific keys to map
      var cortexMsgToKeyMap = {
        "username: not a well-formed email address"                         : 'invalidEmailUsername',
        "username: Failed username validation"                              : 'invalidEmailUsername',
        "username: may not be null"                                         : 'missingEmailUsername',
        "username: attribute is required"                                   : 'missingEmailUsername',
        "password: Password must not be blank"                              : 'missingPassword',
        "password: Password must be between 8 to 255 characters inclusive"  : 'invalidPassword',
        "given-name: attribute is required"                                 : 'missingFirstName',
        "family-name: attribute is required"                                : 'missingLastName'
      };

      return utils.translateErrorMessage(rawMsg, cortexMsgToKeyMap, {
        localePrefix: 'registration.errorMsg.'
      });
    }

    /**
     * A helper function to empty password fields in a given Marionette.Region.
     * @param region A Marionette.Region
     */
    function clearPasswordFields(region) {
      // If this is a populated Marionette.Region
      if (region.$el) {
        // Use jQuery to find password input fields and empty them
        $(':password', region.$el).val("");
      }
    }

    return {
      DefaultLayout: defaultLayout,
      RegistrationFormItemView: registrationFormItemView,
      RegistrationErrorCollectionView: registrationErrorCollectionView,
      clearPasswordFields: clearPasswordFields,
      translateRegistrationErrorMessage: translateRegistrationErrorMessage
    };
  }
);