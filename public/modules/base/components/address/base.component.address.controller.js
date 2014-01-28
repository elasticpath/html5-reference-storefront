/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 *
 * Address Component Controller
 * The HTML5 Reference Storefront's MVC controller for displaying an address, and creating an address.
 */

define(function (require) {
  var ep = require('ep');
  var i18n = require('i18n');
  var EventBus = require('eventbus');
  var Mediator = require('mediator');
  var Backbone = require('backbone');

  var Views = require('address.views');
  var Models = require('address.models');
  var template = require('text!modules/base/components/address/base.component.address.template.html');

  $('#TemplateContainer').append(template);

  _.templateSettings.variable = 'E';

  var countryCollection = new Models.CountryCollection();
  var regionCollection = new Models.RegionCollection();

  /**
   * Instantiate an DefaultCreateAddressLayout and load views into corresponding regions on DefaultCreateAddressLayout.
   * @returns {Views.DefaultCreateAddressLayout} fully rendered DefaultCreateAddressLayout
   */
  var defaultCreateAddressView = function () {
    // Ensure the user is authenticated before rendering the address form
    if (ep.app.isUserLoggedIn()) {
      var addressLayout = new Views.DefaultCreateAddressLayout();

      addressLayout.on('show', function () {
        addressLayout.addressFormRegion.show(defaultAddressFormView());
      });
      return addressLayout;
    } else {
      // CheckIn centralize this reference: loginModal
      EventBus.trigger('layout.loadRegionContentRequest', {
        region: 'appModalRegion',
        module: 'auth',
        view: 'LoginFormView'
      });
    }
  };

  /**
   * Instantiate an DefaultEditAddressLayout and load views into corresponding regions on DefaultEditAddressLayout.
   * @returns {Views.DefaultEditAddressLayout} fully rendered DefaultEditAddressLayout
   */
  var defaultEditAddressView = function(href) {
    var addressLayout = new Views.DefaultEditAddressLayout();
    var addressModel = new Models.AddressModel();

    addressModel.fetch({
      url: ep.ui.decodeUri(href),
      success: function(response) {
        addressLayout.addressFormRegion.show(defaultAddressFormView(response));
      }
    });

    return addressLayout;
  };

  /**
   * Instantiate a DefaultAddressFormView and load country and regions views into corresponding regions.
   * @param addressModel  data model of address to edit.
   * @returns {Views.DefaultAddressFormView}  fully rendered DefaultAddressFormView
   */
  var defaultAddressFormView = function(addressModel) {
   var addressFormView = new Views.DefaultAddressFormView();
    if (addressModel) {
      addressFormView.model = addressModel;
    }

    countryCollection.fetch({
      success: function(response) {
        // show countryCompositeView, regionCompositeView(empty collection)
      }
    });

    return addressFormView;
  };

  /* *************** Event Listeners Functions *************** */
  /**
   * Renders a Default Address ItemView with regions and models passed in
   * @param addressObj  contains region to render in and the model to render with
   */
  function loadAddressView(addressObj) {
    try {
      var addressView = new Views.DefaultAddressItemView({
        model: addressObj.model
      });

      addressObj.region.show(addressView);
    } catch (error) {
      ep.logger.error('failed to load Address Views: ' + error.message);
    }
  }


  /**
   * Request an empty address form & the link to POST or PUT address form to.
   * Currently, only information used is the link to POST or PUT address form to.
   */
  function getAddressForm() {
    var ajaxModel = new ep.io.defaultAjaxModel({
      type: 'GET',
      url: ep.io.getApiContext() + '/profiles/' + ep.app.config.cortexApi.scope + '/default?zoom=addresses:addressform',
      success: function (response) {
        var submitAddressFormLink = jsonPath(response, "$..links[?(@.rel=='createaddressaction')].href")[0];
        EventBus.trigger('address.createNewAddressRequest', submitAddressFormLink);
      },
      customErrorFn: function () {
        EventBus.trigger('address.submitAddressFormFailed');
      }
    });

    ep.io.ajax(ajaxModel.toJSON());
  }

  /**
   * Send an address request to cortex.
   * @param type The AJAX type of the request POST (create) or PUT (update)
   * @param submitAddressFormLink to POST the request to.
   */
  function createAddressRequest(type, submitAddressFormLink) {
    var form = Views.getAddressFormValues();

    var ajaxModel = new ep.io.defaultAjaxModel({
      type: type,
      url: submitAddressFormLink,
      data: JSON.stringify(form),
      success: function () {
        EventBus.trigger('address.submitAddressFormSuccess');
      },
      customErrorFn: function (response) {
        if (response.status === 400) {
          EventBus.trigger('address.submitAddressFormFailed.invalidFields', response.responseText);
        }
        else {
          EventBus.trigger('address.submitAddressFormFailed');
        }
      }
    });

    ep.io.ajax(ajaxModel.toJSON());
  }

  /* *************** Event Listeners: create address  *************** */
  /**
   * Listening to create address button clicked signal,
   * will trigger request to get address form (to get action link to post form to)
   */
  EventBus.on('address.createAddressBtnClicked', function () {
    EventBus.trigger('address.getAddressFormRequest');
  });

  EventBus.on('address.editAddressBtnClicked', function(href) {
    createAddressRequest('PUT', href);
  });

  /**
   * Listening to get address form request,
   * will request address form from cortex,
   * on success, will trigger submit address form request,
   * and pass on create address action link acquired from address form
   */
  EventBus.on('address.getAddressFormRequest', getAddressForm);

  /**
   * Listening to create new address request,
   * will submit address form to cortex,
   */
  EventBus.on('address.createNewAddressRequest', function(href) {
    createAddressRequest('POST', href);
  });

  /**
   * Listening to address form submission failed signal (general error),
   * will display generic error message.
   */
  EventBus.on('address.submitAddressFormFailed', function () {
    Views.displayAddressFormErrorMsg(i18n.t('addressForm.errorMsg.generalSaveAddressFailedErrMsg'));
  });

  /**
   * Listening to address form submission failed signal (invalid form),
   * will display error message sent back from cortex.
   * @param errMsg an error message, or a i18n key to the error message
   */
  EventBus.on('address.submitAddressFormFailed.invalidFields', function (errMsg) {
    // in the future, also highlight the invalid input box
    var translatedMsg = Views.translateErrorMessage(errMsg);
    Views.displayAddressFormErrorMsg(translatedMsg);
  });

  /**
   * Listening to submit address form success signal,
   * will call mediator strategy to notify storefront addressForm module is done.
   */
  EventBus.on('address.submitAddressFormSuccess', function() {
    Mediator.fire('mediator.addressFormComplete');
  });

  /**
   * Listen to cancel button clicked signal,
   * will redirect page set by returnUrl.
   */
  EventBus.on('address.cancelBtnClicked', function() {
    Mediator.fire('mediator.addressFormComplete');
  });

  /* *********** Event Listeners: load display address view  *********** */
  /**
   * Listening to load default display address view request,
   * will load the default view in appMainRegion.
   */
  EventBus.on('address.loadAddressesViewRequest', loadAddressView);

  return{
    DefaultCreateAddressView: defaultCreateAddressView,
    DefaultEditAddressView: defaultEditAddressView,
    testVariables: {
      defaultAddressFormView: defaultAddressFormView
    }
  };
});