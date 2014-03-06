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
      ui: {
        cancelButton: '[data-el-label="registration.cancel"]',
        saveButton: '[data-el-label="registration.save"]'
      },
      events: {
        'click @ui.saveButton': function(event) {
          event.preventDefault();
          // Get the registration form and trigger an event to process it and send it to Cortex
          var registrationForm = $(event.currentTarget).parents('form').get(0);
          EventBus.trigger('registration.saveButtonClicked', registrationForm);
        },
        'click @ui.cancelButton': function(event) {
          event.preventDefault();
          EventBus.trigger('registration.cancelButtonClicked');
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