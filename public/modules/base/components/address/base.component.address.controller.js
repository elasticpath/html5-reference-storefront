/**
 * Copyright Elastic Path Software 2013.
 *
 * Address Component Controller
 * The HTML5 Reference Storefront's MVC controller for displaying an address, and creating an address.
 */

define(function (require) {
  var ep = require('ep');
  var EventBus = require('eventbus');
  var i18n = require('i18n');

  var View = require('address.views');
  var template = require('text!modules/base/components/address/base.component.address.template.html');

  // url addressFormView will return to upon save form success or cancel button click
  // FIXME [CU-69] should not set this here!
  // re-think the user interaction
  var returnUrl = ep.app.config.routes.profile;

  $('#TemplateContainer').append(template);

  _.templateSettings.variable = 'E';

  /**
   * Instantiate an DefaultCreateAddressLayout and load views into corresponding regions on DefaultCreateAddressLayout.
   * @returns {View.DefaultCreateAddressLayout} fully rendered DefaultCreateAddressLayout
   */
  var defaultCreateAddressView = function () {
    var addressLayout = new View.DefaultCreateAddressLayout();
    var addressFormView = new View.DefaultAddressFormView();

    addressLayout.on('show', function () {
      addressLayout.addressFormRegion.show(addressFormView);
    });

    return addressLayout;
  };

  /* *************** Event Listeners Functions *************** */
  /**
   * Renders a Default Address ItemView with regions and models passed in
   * @param addressObj  contains region to render in and the model to render with
   */
  function loadAddressView(addressObj) {
    try {
      var addressView = new View.DefaultAddressItemView({
        model: addressObj.model
      });

      addressObj.region.show(addressView);
    } catch (error) {
      ep.logger.error('failed to load Address View: ' + error.message);
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
      customErrorFn: function (response) {
        EventBus.trigger('address.submitAddressFormFailed');
      }
    });

    ep.io.ajax(ajaxModel.toJSON());
  }

  /**
   * POST the new address to cortex.
   * @param submitAddressFormLink to POST the request to.
   */
  function createNewAddress(submitAddressFormLink) {
    var form = View.getAddressForm();

    var ajaxModel = new ep.io.defaultAjaxModel({
      type: 'POST',
      url: submitAddressFormLink,
      data: JSON.stringify(form),
      success: function (data, textStatus, XHR) {
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
  EventBus.on('address.createNewAddressRequest', createNewAddress);

  /**
   * Listening to address form submission failed signal (general error),
   * will display generic error message.
   */
  EventBus.on('address.submitAddressFormFailed', function () {
    View.displayAddressFormErrorMsg(i18n.t('addressForm.errorMsg.generalSaveAddressFailedErrMsg'));
  });

  /**
   * Listening to address form submission failed signal (invalid form),
   * will display error message sent back from cortex.
   * @param errMsg an error message, or a i18n key to the error message
   */
  EventBus.on('address.submitAddressFormFailed.invalidFields', function (errMsg) {
    // in the future, also highlight the invalid input box
    var translatedMsg = View.translateErrorMessage(errMsg);
    View.displayAddressFormErrorMsg(translatedMsg);
  });

  /**
   * Listening to submit address form success signal,
   * will redirect page set by returnUrl.
   */
  // FIXME [CU-69] should hand controll back to modules that called address module
  EventBus.on('address.submitAddressFormSuccess', function() {
    window.location.href = returnUrl;
  });

  /**
   * Listen to cancel button clicked signal,
   * will redirect page set by returnUrl.
   */
  EventBus.on('address.cancelBtnClicked', function() {
    // more secure way of changing page (don't allow the url to escape the application)
//    ep.router.navigate(returnUrl, true);
    // FIXME [CU-69] more sophisticated way of returning to previous view
    window.location.href = returnUrl;
  });

  /* *********** Event Listeners: set return url  *********** */
  /**
   * Listen to setReturnUrl request,
   * will set the returnUrl variable to passed in url value
   * @param url url address form will return to upon cancel or success
   */
  EventBus.on('address.setReturnUrl', function(url) {
    returnUrl = url;
  });

  /* *********** Event Listeners: load display address view  *********** */
  /**
   * Listening to load default display address view request,
   * will load the default view in appMainRegion.
   */
  EventBus.on('address.loadAddressesViewRequest', loadAddressView);

  return{
    DefaultCreateAddressView: defaultCreateAddressView
  };
});