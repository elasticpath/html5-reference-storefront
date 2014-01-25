/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
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
    var i18n = require('i18n');

    var Model = require('profile.models');
    var View = require('profile.views');
    var template = require('text!modules/base/profile/base.profile.templates.html');
    var profileParser = require('helpers/profile.parsers');

    $('#TemplateContainer').append(template);

    _.templateSettings.variable = 'E';

    var profileModel = new Model.ProfileModel();
    var purchaseHistoryCollection = new Model.ProfilePurchaseCollection();
    var addressesCollection = new Backbone.Collection();
    var defaultLayout = new View.DefaultLayout();

    /**
     * If user is logged in renders the DefaultLayout of profile module, and fetch model from backend;
     * upon model fetch success, renders profile views in designated regions.
     * If user isn't logged in, trigger request to prompt user login.
     * @returns {View.DefaultLayout}  with populated data and child views ready to render.
     */
    var defaultView = function () {

      // ensure the user is authenticated before continuing to process the request
      if (ep.app.isUserLoggedIn()) {
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
            addressesCollection.update(response.get('addresses'));
            var profileAddressesView = new View.ProfileAddressesView({
              collection: addressesCollection
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
     * Handler for the edit address button clicked signal, which triggers an edit address request.
     */
    EventBus.on('profile.editAddressBtnClicked', function (href) {
      EventBus.trigger('profile.editAddressRequest', href);
    });

    /**
    * Handler for the delete address button clicked signal, which triggers a request for confirmation from the user.
    */
    EventBus.on('profile.deleteAddressBtnClicked', function (href) {
      EventBus.trigger('profile.deleteAddressConfirm', href);
    });

    /**
     * Handler for the edit profile address request event that navigates to the corresponding route.
     */
    EventBus.on('profile.editAddressRequest', function(href) {
      var editAddressLink = ep.app.config.routes.editAddress + '/' + ep.ui.encodeUri(href);
      ep.router.navigate(editAddressLink, true);
    });

    /**
     * Uses a modal window to confirm the delete action for a profile address.
     * @param href A href used to identify the address to be deleted in Cortex
     */
    EventBus.on('profile.deleteAddressConfirm', function (href) {
      EventBus.trigger('layout.loadRegionContentRequest', {
        region: 'appModalRegion',
        module: 'profile',
        view: 'ProfileDeleteAddressConfirmationView',
        data: {
          href: href
        }
      });
    });

    /**
     * Called when the yes button in the confirm deletion modal is clicked. This handler closes any open modal windows,
     * starts the activity indicator in the profile addresses region and trigger the delete request to Cortex.
     */
    EventBus.on('profile.deleteAddressConfirmYesBtnClicked', function(href) {
      $.modal.close();
      ep.ui.startActivityIndicator(defaultLayout.profileAddressesRegion.currentView);
      EventBus.trigger('profile.deleteAddressRequest', href);
    });

    /**
     * Called when a request to delete an address from Cortex has failed. Displays a toast message
     * and stops the activity indicator in the profile addresses region.
     * On close of the toast message, we invoke a full page refresh.
     * @param href A href used to identify the address to be deleted in Cortex
     */
    EventBus.on('profile.deleteAddressFailed', function (response) {
      $().toastmessage('showToast', {
        text: i18n.t('profile.address.msg.deleteErr'),
        sticky: true,
        position: 'middle-center',
        type: 'error',
        close: function() {
          Backbone.history.loadUrl();
        }
      });
      ep.ui.stopActivityIndicator(defaultLayout.profileAddressesRegion.currentView);
    });

    /**
     * Called when an address has been successfully deleted from Cortex. Performs a fetch of the profile
     * model and updates the collection of addresses with the updated array from Cortex.
     */
    EventBus.on('profile.deleteAddressSuccess', function () {
      profileModel.fetch({
        success: function(response) {
          // Update the collection of addresses with the new array of addresses from Cortex
          var newAddresses = response.get('addresses');

          // Stop the activity indicators on the cart regions that are being updated
          ep.ui.stopActivityIndicator(defaultLayout.profileAddressesRegion.currentView);

          addressesCollection.update(newAddresses);
        }
      });
    });

    /**
     * Makes an AJAX request to Cortex to delete an address.
     * @param deleteActionLink A href used to identify the address to be deleted in Cortex
     */
    EventBus.on('profile.deleteAddressRequest', function (deleteActionLink) {
      var ajaxModel = new ep.io.defaultAjaxModel({
        type: 'DELETE',
        url: deleteActionLink,
        success: function () {
          EventBus.trigger('profile.deleteAddressSuccess');
        },
        customErrorFn: function (response) {
          EventBus.trigger('profile.deleteAddressFailed', response);
        }
      });

      ep.io.ajax(ajaxModel.toJSON());
    });

    return {
      DefaultView: defaultView,
      EditProfileAddressView: editProfileAddressView,
      ProfileDeleteAddressConfirmationView: function(options) {
        return new View.ProfileDeleteAddressConfirmationView(options);
      }
    };
});
