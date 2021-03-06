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
 * Default Profile Controller
 * The HTML5 Reference Storefront's MVC controller instantiates the profile model and views,
 * renders profile views in designated regions. It also manages events and functions to add a new address,
 * edit personal info.
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

  $('#TemplateContainer').append(template);

  _.templateSettings.variable = 'E';

  var profileModel = new Model.ProfileModel();
  var personalInfoModel = new Backbone.Model();
  var subscriptionCollection = new Backbone.Collection();
  var purchaseHistoryCollection = new Model.ProfilePurchaseCollection();
  var addressesCollection = new Backbone.Collection();
  var paymentsCollection = new Backbone.Collection([], {comparator: "displayValue"});
  var formErrorsCollection = new Backbone.Collection({}, {comparator: "error"});

  var defaultLayout = new View.DefaultLayout();

  /**
   * Controller logic to render profile personal info views in designated region
   * @param region  region to render the view into
   */
  var showPersonalInfoView = function (region) {
    var profileInfoView = new View.ProfilePersonalInfoView({
      model: personalInfoModel
    });
    region.show(profileInfoView);
  };

  /**
   * Controller logic to render profile subscription views in designated region
   * @param region  region to render the view into
   */
  var showSubscriptionView = function (region) {
    var profileSubscriptionView = new View.ProfileSubscriptionSummaryView({
      collection: subscriptionCollection
    });
    region.show(profileSubscriptionView);
  };

  /**
   * Controller logic to render profile purchases views in designated region
   * @param region  region to render the view into
   */
  var showPurchaseView = function (region) {
      var profilePurchaseView = new View.ProfilePurchasesHistoryView({
        collection: purchaseHistoryCollection
      });
      region.show(profilePurchaseView);
  };

  /**
   * Controller logic to render profile payment methods views in designated region
   * @param region  region to render the view into
   */
  var showPaymentMethodsView = function (region) {
      var profilePaymentMethodsView = new View.ProfilePaymentMethodsView({
        collection: paymentsCollection
      });
      region.show(profilePaymentMethodsView);
  };

  /**
   * Controller logic to render profile addresses views in designated region
   * @param region  region to render the view into
   */
  var showAddressesView = function (region) {
    var profileAddressesView = new View.ProfileAddressesView({
      collection: addressesCollection
    });
    region.show(profileAddressesView);
  };

  /**
   * If user is logged in renders the DefaultLayout of profile module, and fetch model from backend;
   * upon model fetch success, renders profile views in designated regions.
   * If user isn't logged in, trigger request to prompt user login.
   * @returns {View.DefaultLayout}  with populated data and child views ready to render.
   */
  var defaultController = function () {

    // ensure the user is authenticated before continuing to process the request
    if (ep.app.isUserLoggedIn()) {
      profileModel.fetch({
        success: function (response) {
          // Profile Title
          var profileTitleView = new View.ProfileTitleView();
          defaultLayout.profileTitleRegion.show(profileTitleView);

          personalInfoModel.set(response.get('personalInfo'));
          showPersonalInfoView(defaultLayout.profilePersonalInfoRegion);

          subscriptionCollection.update(response.get('subscriptions'));
          showSubscriptionView(defaultLayout.profileSubscriptionSummaryRegion);

          purchaseHistoryCollection.update(response.get('purchaseHistories'));
          showPurchaseView(defaultLayout.profilePurchaseHistoryRegion);

          addressesCollection.update(response.get('addresses'));
          showAddressesView(defaultLayout.profileAddressesRegion);

          paymentsCollection.update(response.get('paymentMethods'));
          showPaymentMethodsView(defaultLayout.profilePaymentMethodsRegion);
        },
        error: function (response) {
          ep.logger.error('Error getting profile model: ' + JSON.stringify(response));
        }
      });

      return defaultLayout;
    }
    else {
      Mediator.fire('mediator.loadRegionContent', 'loginModal');
    }

  };

  /* ********* Address EVENT LISTENERS ************ */
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
    Mediator.fire('mediator.editAddressRequest', {
      returnModule: 'profile',
      href: href
    });
  });

  /**
   * Handler for the delete address button clicked signal, which triggers a mediator strategy
   * to communicate the request to the address module.
   */
  EventBus.on('profile.deleteAddressBtnClicked', function (href) {
    Mediator.fire('mediator.deleteAddressRequest', {
      href: href,
      indicatorView: defaultLayout.profileAddressesRegion.currentView,
      returnModule: 'profile'
    });
  });

  /**
   * Fetches a simple Backbone model that requests from Cortex the URL to which the payment method form
   * should be submitted (when it needs to save the payment method to the shopper's profile).
   *
   * When a URL is successfully retrieved, a mediator strategy is fired to return the action URL and
   * data to the payment module so it can be sent to Cortex.
   *
   * @param formData {Object} Data to be submitted from the payment method form.
   */
  EventBus.on('profile.getSavePaymentMethodToProfileUrl', function (formData) {
    var paymentActionModel = new Model.ProfilePaymentMethodActionModel();
    paymentActionModel.fetch({
      success: function (response) {
        Mediator.fire('mediator.submitPaymentMethodForm', {
          data: formData,
          url: response.get('url')
        });
      },
      error: function (response) {
        ep.logger.error('Error retrieving profile save payment token URL: ' + JSON.stringify(response));
      }
    });
  });

  /**
   * Called when an address has been successfully deleted from Cortex. Performs a fetch of the profile
   * model and updates the collection of addresses with the updated array from Cortex.
   */
  EventBus.on('profile.updateAddresses', function (indicatorView) {
    profileModel.fetch({
      success: function (response) {
        // Update the collection of addresses with the new array of addresses from Cortex
        var newAddresses = response.get('addresses');

        if (indicatorView) {
          // Stop the activity indicators on the cart regions that are being updated
          ep.ui.stopActivityIndicator(indicatorView);
        }

        addressesCollection.update(newAddresses);
      }
    });
  });

  /* ********* Personal Info EVENT LISTENERS ************ */
  EventBus.on('profile.editPersonalInfoBtnClicked', function (model) {
    EventBus.trigger('profile.loadPersonalInfoFormViewRequest', model);
  });

  EventBus.on('profile.loadPersonalInfoFormViewRequest', function (model) {
    var personalInfoFormView = new View.PersonalInfoFormView({
      model: model
    });

    defaultLayout.profilePersonalInfoRegion.show(personalInfoFormView);
  });

  EventBus.on('profile.personalInfoFormSaveBtnClicked', function (actionLink) {
    ep.ui.disableButton(defaultLayout.profilePersonalInfoRegion.currentView, 'saveBtn');
    EventBus.trigger('profile.submitPersonalInfoFormRequest', actionLink);
  });

  EventBus.on('profile.personalInfoFormCancelBtnClicked', function () {
    EventBus.trigger('profile.loadPersonalInfoViewRequest');
  });

  /**
   * Loads personal info view into profilePersonalInfoRegion.
   */
  EventBus.on('profile.loadPersonalInfoViewRequest', function () {
    profileModel.fetch({
      success: function (response) {
        personalInfoModel.set(response.get('personalInfo'));
        showPersonalInfoView(defaultLayout.profilePersonalInfoRegion);
      }
    });
  });

  /**
   * Submit Personal Info Form to cortex to update user's profile personal information.
   * Will trigger notification events on success or failure.
   */
  EventBus.on('profile.submitPersonalInfoFormRequest', function (actionLink) {
    var formValue = View.getPersonalInfoFormValue();

    // Remove any form errors that were previously generated before we make the AJAX request
    formErrorsCollection.reset();

    var ajaxModel = new ep.io.defaultAjaxModel({
      type: 'PUT',
      url: actionLink,
      data: JSON.stringify(formValue),
      success: function () {
        EventBus.trigger('profile.submitPersonalInfoFormSuccess');
      },
      customErrorFn: function (response) {
        EventBus.trigger('profile.submitPersonalInfoFormFailed', response);
      }
    });

    ep.io.ajax(ajaxModel.toJSON());
  });

  /**
   * Will trigger event to load personal info view in place of edit form view.
   */
  EventBus.on('profile.submitPersonalInfoFormSuccess', function () {
    EventBus.trigger('profile.loadPersonalInfoViewRequest');
  });

  /**
   * Will localize error message coming back from cortex, and display the localized messages into feedback region.
   */
  EventBus.on('profile.submitPersonalInfoFormFailed', function (response) {
    var errorMsg = i18n.t('profile.personalInfo.errorMsg.generic');
    if (response && response.status === 400) {
      errorMsg = response.responseText;
    }

    var translatedErrorsArr = View.translatePersonalInfoFormErrorMessage(errorMsg);
    formErrorsCollection.update(translatedErrorsArr);

    var personalInfoFormView = defaultLayout.profilePersonalInfoRegion.currentView;
    var feedbackRegion = new Marionette.Region({
      el: '[data-region="profileInfoFeedbackRegion"]'
    });

    ep.ui.enableButton(personalInfoFormView, 'saveBtn');

    feedbackRegion.show(
      new View.PersonalInfoFormErrorCollectionView({
        collection: formErrorsCollection
      })
    );
  });

  /* ********* Payment Method EVENT LISTENERS ************ */
  EventBus.on('profile.addNewPaymentMethodBtnClicked', function () {
    Mediator.fire('mediator.addNewPaymentMethodRequest', 'profile');
  });

  /**
   * Handler for the delete payment button clicked signal, which triggers a mediator strategy
   * to communicate the request to the payment module.
   */
  EventBus.on('profile.deletePaymentBtnClicked', function (href) {
    Mediator.fire('mediator.deletePaymentRequest', {
      href: href,
      indicatorView: defaultLayout.profilePaymentMethodsRegion.currentView,
      returnModule: 'profile'
    });
  });

  /**
   * Called when an payment method has been successfully deleted from Cortex. Performs a fetch of the profile
   * model and updates the collection of payment methods with the updated array from Cortex.
   */
  EventBus.on('profile.updatePaymentMethods', function (indicatorView) {
    profileModel.fetch({
      success: function (response) {
        if (indicatorView) {
          // Stop the activity indicators on the cart regions that are being updated
          ep.ui.stopActivityIndicator(indicatorView);
        }

        // Update the collection of addresses with the new array of addresses from Cortex
        var newPaymentMethods = response.get('paymentMethods');
        paymentsCollection.update(newPaymentMethods);
      }
    });
  });


  return {
    DefaultController: defaultController
  };
});
