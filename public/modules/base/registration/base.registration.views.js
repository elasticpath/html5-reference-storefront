/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 * Default Registration Views

 */
define(function (require) {
    var EventBus = require('eventbus');
    var Mediator = require('mediator');
    var Marionette = require('marionette');
    var ViewHelpers = require('viewHelpers');

    /**
     *
     * @type Marionette.Layout
     */
    var defaultLayout = Marionette.Layout.extend({
      template: '#DefaultRegistrationLayoutTemplate',
      templateHelpers: ViewHelpers,
      className: 'registration-container container',
      regions: {
        registrationFeedbackMsgRegion: '[data-region="registrationFeedbackMsgRegion"]',
        registrationFormRegion: '[data-region="registrationFormRegion"]'
      },
      events: {
        'click [data-el-label="registration.save"]': function(event) {
          event.preventDefault();

          EventBus.trigger('registration.saveButtonClicked');
        }
      }
    });

    /**
     *
     * @type Marionette.ItemView
     */
    var registrationErrorItem = Marionette.ItemView.extend({
      tagName: 'li',
      template: '#RegistrationFormErrorItemTemplate',
      templateHelpers: ViewHelpers
    });

    /**
     *
     * @type Marionette.CollectionView
     */
    var registrationErrorItemCollection = Marionette.CollectionView.extend({
      className: 'error-list',
      itemView: registrationErrorItem,
      tagName: 'ul'
    });

    return {
      DefaultLayout: defaultLayout,
      RegistrationErrorItemCollection: registrationErrorItemCollection
    };
  }
);