/**
 * Copyright Elastic Path Software 2013.
 *
 * Default Profile Controller
 * The HTML5 Reference Storefront's MVC controller instantiates the profile model and views,
 * renders profile views in designated regions. It also manages events and functions to add a new address.
 */
define(function (require) {
    var ep = require('ep');
    var EventBus = require('eventbus');
    var Mediator = require('mediator');
    var Backbone = require('backbone');

    var Model = require('profile.models');
    var View = require('profile.views');
    var template = require('text!modules/base/profile/base.profile.templates.html');
    var profileParser = require('helpers/profile.parsers');

    $('#TemplateContainer').append(template);

    _.templateSettings.variable = 'E';

    var profileModel = new Model.ProfileModel();
    var purchaseHistoryCollection = new Model.ProfilePurchaseCollection();

    /**
     * If user is logged in renders the DefaultLayout of profile module, and fetch model from backend;
     * upon model fetch success, renders profile views in designated regions.
     * If user isn't logged in, trigger request to prompt user login.
     * @returns {View.DefaultLayout}  with populated data and child views ready to render.
     */
    var defaultView = function () {

      // ensure the user is authenticated before continuing to process the request
      if (ep.app.isUserLoggedIn()) {
        var defaultLayout = new View.DefaultLayout();

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

            var profilePurchaseView = new View.ProfilePurchasesHistoryView({
              collection: purchaseHistoryCollection.update(response.get('purchaseHistories'))
            });
            defaultLayout.profilePurchaseHistoryRegion.show(profilePurchaseView);

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

    /**
     * Attempts to fetch an address model based on a href link that identifies an individual address in Cortex.
     * If successful, fires a mediator event to render the DefaultEditAddressLayout layout of the address component
     * which renders the edit address form.
     * @param href A href used to identify the address to be edited in Cortex
     */
    var editProfileAddressView = function(href) {
      // Get the address model from Cortex that corresponds to the href link
      var address = new Backbone.Model();
      address.fetch({
        url: ep.ui.decodeUri(href),
        success: function(response) {
          // Parse the address raw JSON response into a Cortex address object
          var addressModel = profileParser.parseAddress(response.toJSON());

          Mediator.fire('mediator.loadEditAddressViewRequest', {
            returnModule: 'profile',
            model: new Backbone.Model(addressModel),
            region: ep.app.appMainRegion
          });
        },
        error: function(response) {
          ep.logger.error('Error getting address model: ' + JSON.stringify(response));
        }
      });
    };

    /* ********* EVENT LISTENERS ************ */
    /**
     * Listen to add new address button clicked signal
     * will load address form
     */
    EventBus.on('profile.addNewAddressBtnClicked', function () {
      Mediator.fire('mediator.addNewAddressRequest', 'profile');
    });

    /**
     * Handler for the edit profile address request event that navigates to the corresponding route.
     */
    EventBus.on('profile.editAddressRequest', function(href) {
      var editAddressLink = ep.app.config.routes.editAddress + '/' + ep.ui.encodeUri(href);
      ep.router.navigate(editAddressLink, true);
    });

    return {
      DefaultView: defaultView,
      EditProfileAddressView: editProfileAddressView
    };
});
