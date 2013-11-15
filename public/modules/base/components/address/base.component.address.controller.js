/**
 * Copyright Elastic Path Software 2013.
 */

define(function (require) {
  var ep = require('ep');
  var EventBus = require('eventbus');
  var Mediator = require('mediator');
  var i18n = require('i18n');

  var View = require('address.views');
  var template = require('text!modules/base/components/address/base.component.address.template.html');

  $('#TemplateContainer').append(template);

  _.templateSettings.variable = 'E';

  /**
   * Instantiate an DefaultCreateAddressLayout and load views into corresponding regions on DefaultCreateAddressLayout.
   * @returns {View.DefaultCreateAddressLayout}
   */
  var defaultCreateAddressView = function () {
    var addressLayout = new View.DefaultCreateAddressLayout();
    var addressFormView = new View.DefaultAddressFormView();

    addressLayout.on('show', function () {
      addressLayout.addressFormRegion.show(addressFormView);
    });

    return addressLayout;
  };

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
   * Request an empty address form & the uri to POST or PUT address form to.
   * Currently, only information used is the uri to POST or PUT address form to.
   */
  function getAddressForm() {
    var ajaxModel = new ep.io.defaultAjaxModel({
      type: 'GET',
      url: ep.app.config.cortexApi.path + '/profiles/' + ep.app.config.cortexApi.scope + '/default?zoom=addresses:addressform',
      success: function (response) {
        var addressFormUri = jsonPath(response, "$..links[?(@.rel=='createaddressaction')].uri")[0];
//        var actionLink = ep.app.config/cortexApi.path + addressFormUri
        EventBus.trigger('address.createNewAddressRequest', addressFormUri);
      },
      customErrorFn: function (response) {
        EventBus.trigger('address.submitAddressFormFailed');
      }
    });

    ep.io.ajax(ajaxModel.toJSON());
  }

  /**
   * POST the new address to cortex.
   * @param actionLink uri to make the POST request.
   */
  function createNewAddress(actionLink) {
    var form = View.getAddressForm();

    var ajaxModel = new ep.io.defaultAjaxModel({
      type: 'POST',
      url: ep.app.config.cortexApi.path + actionLink,
      data: JSON.stringify(form),
      success: function (data, textStatus, XHR) {
        EventBus.trigger('address.submitAddressFormSuccess');
      },
      customErrorFn: function (response) {
        if (response.status === 400) {
          // FIXME Currently cortex provide no way to differentiate missing and invalid fields, and even bad request
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
    var errMsgKey = 'addressForm.generalSaveAddressFailedErrMsg';
    View.displayAddressFormErrorMsg(errMsgKey);
  });

  /**
   * Listening to address form submission failed signal (invalid form),
   * will display error message sent back from cortex.
   */
  EventBus.on('address.submitAddressFormFailed.invalidFields', function (errMsg) {
    // in the future, also highlight the invalid input box
    View.displayAddressFormErrorMsg(errMsg);
  });

  /**
   * Listening to submit address form success signal,
   * will fire mediator event to notify other modules.
   */
  EventBus.on('address.submitAddressFormSuccess', function() {
    $.modal.close();
    Mediator.fire('mediator.addressFormSaved');
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