/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 *
 */
define(function (require) {
    var ep = require('ep'),
      EventBus = require('eventbus'),
      pace = require('pace'),
      Backbone = require('backbone'),
      Model = require('profile.models'),
      View = require('profile.views'),
      template = require('text!modules/base/profile/base.profile.templates.html');

    /**
     * Inject the address template into TemplateContainer for the views to reference
     */
    $('#TemplateContainer').append(template);

    /**
     * Creates namespace to template to reference model and viewHelpers
     */
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
            ep.logger.error('Error getting profile subscription model');
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
    var addressFormModal = {
      region: 'appModalRegion',
      module: 'address',
      view: 'DefaultCreateAddressView'
    };

    EventBus.on('profile.addNewAddressBtnClicked', function() {
      EventBus.trigger('layout.loadRegionContentRequest', addressFormModal);
    });

    return {
      DefaultView: defaultView
    };
  }
);
