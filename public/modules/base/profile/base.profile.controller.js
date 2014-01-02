/**
 * Copyright Elastic Path Software 2013.
 *
 * Default Profile Controller
 * The HTML5 Reference Storefront's MVC controller instantiates the profile model and views,
 * renders profile views in destinated regions. It also manages events and functions to add a new address.
 */
define(function (require) {
    var ep = require('ep');
    var EventBus = require('eventbus');
    var Mediator = require('mediator');
    var Backbone = require('backbone');

    var Model = require('profile.models');
    var View = require('profile.views');
    var template = require('text!modules/base/profile/base.profile.templates.html');

    $('#TemplateContainer').append(template);

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

        profileModel.fetch({
          success: function (response) {
            // Profile Title
            var profileTitleView = new View.ProfileTitleView({});
            defaultLayout.profileTitleRegion.show(profileTitleView);

            // Profile Summary
            var profileSummaryView = new View.ProfileSummaryView({
              model: response
            });
            defaultLayout.profileSummaryRegion.show(profileSummaryView);

            // Profile Subscriptions
            var profileSubs = response.get('subscriptions');
            if (profileSubs.length > 0) {
              var profileSubscriptionView = new View.ProfileSubscriptionSummaryView({
                collection: new Backbone.Collection(profileSubs)
              });
              defaultLayout.profileSubscriptionSummaryRegion.show(profileSubscriptionView);
            }

            // Profile Addresses
            var profileAddressesView = new View.ProfileAddressesView({
              collection: new Backbone.Collection(response.get('addresses'))
            });
            defaultLayout.profileAddressesRegion.show(profileAddressesView);


            // Profile Payment Methods
            var profilePaymentMethodsView = new View.ProfilePaymentMethodsView({
              collection: new Backbone.Collection(response.get('paymentMethods'))
            });
            defaultLayout.profilePaymentMethodsRegion.show(profilePaymentMethodsView);
          },
          error: function (response) {
            ep.logger.error('Error getting profile model: ' + JSON.stringify(response));
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
     * Reload addresses region with newly feteched data from Cortex server.
     */
    function updateAddressRegion() {
      var addressesRegion = new Marionette.Region({
        el: '[data-region="profileAddressesRegion"]'
      });

      var profileModel = new Model.ProfileModel();
      profileModel.fetch({
        success: function () {
          addressesRegion.show(new View.ProfileAddressesView({
            collection: new Backbone.Collection(profileModel.get('addresses'))
          }));
        },
        error: function () {
          ep.logger.error('Error getting profile model');
        }
      });
    }

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
    EventBus.on('profile.addressesUpdated', updateAddressRegion);

    return {
      DefaultView: defaultView
    };
  }
);
