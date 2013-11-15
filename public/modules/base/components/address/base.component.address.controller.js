/**
 * Copyright Elastic Path Software 2013.
 */

define(function (require) {
  var ep = require('ep');
  var EventBus = require('eventbus');
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
        var addressFormUri = jsonPath(response, '$.._addresses.._addressform..self..uri')[0];
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
    var addressModel = View.getAddressModel();

    var ajaxModel = new ep.io.defaultAjaxModel({
      type: 'PUT',
      url: actionLink,
      data: JSON.stringify(addressModel),
      success: function (data, textStatus, XHR) {
        EventBus.trigger('address.submitAddressFormSuccess');
      },
      customErrorFn: function (response) {
        if (response.status === 400) {
          // FIXME Currently cortex provide no way to differentiate missing and invalid fields
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
  EventBus.on('address.createAddressBtnClicked', function () {
    EventBus.trigger('address.getAddressFormRequest');
  });

  EventBus.on('address.getAddressFormRequest', getAddressForm);

  EventBus.on('address.createNewAddressRequest', createNewAddress);

  EventBus.on('address.submitAddressFormFailed', function () {
    var errMsgKey = 'address.generalSaveAddressFailedErrMsg';
    View.displayAddressFormErrorMsg(errMsgKey);
  });

  EventBus.on('address.submitAddressFormFailed.invalidFields', function (errMsg) {
    // in the future, also highlight the invalid input box
    View.displayAddressFormErrorMsg(errMsg);
  });

  /* *********** Event Listeners: load display address view  *********** */
  EventBus.on('address.loadAddressesViewRequest', loadAddressView);

  return{
    DefaultCreateAddressView: defaultCreateAddressView
  };
});