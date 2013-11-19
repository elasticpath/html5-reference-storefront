/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 *
 */
define(function (require) {
    var ep = require('ep');
    var EventBus = require('eventbus');
    var Mediator = require('mediator');
    var Backbone = require('backbone');
    var pace = require('pace');

    var Model = require('profile.models');
    var View = require('profile.views');
    var template = require('text!modules/base/profile/base.profile.templates.html');

    // Inject the address template into TemplateContainer for the views to reference
    $('#TemplateContainer').append(template);

    // Creates namespace to template to reference model and viewHelpers
    _.templateSettings.variable = 'E';

    /**
     * Renders the DefaultLayout of profile module, and fetch model from backend;
     * upon model fetch success, renders profile views in destinated regions.
     * @returns {View.DefaultLayout}
     */
    var defaultView = function () {

      // ensure the user is authenticated befor continuing to process the request
      if (ep.app.isUserLoggedIn()) {
        var defaultLayout = new View.DefaultLayout();

        var profileModel = new Model.ProfileModel();

        var profileSummaryRegion = new Marionette.Region({
          el: '[data-region="profileSummaryRegion"]'
        });
        var profilePaymentMethodsRegion = new Marionette.Region({
          el: '[data-region="profilePaymentMethodsRegion"]'
        });
        var profileSubscriptionSummaryRegion = new Marionette.Region({
          el: '[data-region="profileSubscriptionSummaryRegion"]'
        });
        var profileSummaryView = new View.ProfileSummaryView({
          model: profileModel
        });
        var profileTitleView = new View.ProfileTitleView({});

        profileModel.fetch({
          success: function (response) {
            // Profile Title

            defaultLayout.profileTitleRegion.show(profileTitleView);

            // Profile Summary
            profileSummaryRegion.show(profileSummaryView);

            // Profile Subscriptions
            var profileSubs = profileModel.get('subscriptions');
            if (profileSubs.length > 0) {
              profileSubscriptionSummaryRegion.show(new View.ProfileSubscriptionSummaryView({
                collection: new Backbone.Collection(profileModel.get('subscriptions'))
              }));
            }

            // Profile Payment Methods
            profilePaymentMethodsRegion.show(new View.PaymentMethodsView({
              collection: new Backbone.Collection(profileModel.get('paymentMethods'))
            }));

            // Profile Addresses
            var profileAddressesView = new View.ProfileAddressesView({
              collection: new Backbone.Collection(profileModel.get('addresses'))
            });

            defaultLayout.profileAddressesRegion.show(profileAddressesView);

          },
          error: function (response) {
            ep.logger.error('Error getting profile model');
          }
        });

        return defaultLayout;
      }
      else {
        EventBus.trigger('layout.loadRegionContentRequest', {
          region: 'appModalRegion',
          module: 'auth',
          view: 'LoginFormView'
        });
      }


    };

    /* ********* EVENT LISTENERS ************ */
    /**
     * Listen to add new address button clicked signal
     * will load address form
     */
    EventBus.on('profile.addNewAddressBtnClicked', function () {
      window.location.href = ep.app.config.routes.newAddress;
      Mediator.fire('mediator.setReturnUrlInAddressForm', ep.app.config.routes.profile);
    });

    /**
     * Listen to addresses updated signal,
     * will reload profile addresses region
     */
    EventBus.on('profile.addressesUpdated', function () {
      var addressesRegion = new Marionette.Region({
        el: '[data-region="profileAddressesRegion"]'
      });

      var profileModel = new Model.ProfileModel();
      profileModel.fetch({
        success: function (response) {
          addressesRegion.show(new View.ProfileAddressesView({
            collection: new Backbone.Collection(profileModel.get('addresses'))
          }));
        },
        error: function (response) {
          ep.logger.error('Error getting profile model');
        }
      });
    });

    return {
      DefaultView: defaultView
    };
  }
);
