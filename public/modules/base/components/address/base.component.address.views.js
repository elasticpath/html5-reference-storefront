/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 *
 * Address Component Views
 * The HTML5 Reference Storefront's MVC Views for an address, address form,
 * and helper functions that manipulate DOM elements.
 */
define(['ep', 'marionette', 'eventbus', 'i18n', 'viewHelpers'],
  function (ep, Marionette, EventBus, i18n, ViewHelpers) {

    /**
     * Template helper functions
     */
    var viewHelpers = ViewHelpers.extend();

    /**
     * Default Address ItemView
     * Will render a default address
     * @type Marionette.ItemView
     */
    var defaultAddressItemView = Marionette.ItemView.extend({
      template: '#DefaultAddressTemplate',
      tagName: 'ul',
      className: 'address-container'
    });

    /**
     * Default Address Form ItemView
     * will render a default address form
     * @type Marionette.ItemView
     */
    var defaultAddressFormView = Marionette.ItemView.extend({
      template: '#DefaultAddressFormTemplate',
      className: 'address-form-container',
      templateHelpers: viewHelpers
    });

    /**
     * Default Create Address Layout
     * wraps a default address form with elements specific to create address
     * @type Marionette.Layout
     */
    var defaultCreateAddressLayout = Marionette.Layout.extend({
      template: '#DefaultCreateAddressTemplate',
      templateHelpers: viewHelpers,
      className: 'create-address-container container',
      regions: {
        addressFormRegion: '[data-region="componentAddressFormRegion"]',
        addressFeedbackMsgRegion: '[data-region="componentAddressFeedbackRegion"]'
      },
      events: {
        'click [data-el-label="addressForm.create"]': function (event) {
          event.preventDefault();
          EventBus.trigger('address.createAddressBtnClicked');
        },
        'click [data-el-label="addressForm.cancel"]': function (event) {
          event.preventDefault();
          EventBus.trigger('address.cancelBtnClicked');
        }
      }
    });

    /**
     * Default Edit Address Layout
     * wraps a default address form with elements specific to editing an address
     * @type Marionette.Layout
     */
    var defaultEditAddressLayout = Marionette.Layout.extend({
      template: '#DefaultEditAddressTemplate',
      templateHelpers: viewHelpers,
      className: 'create-address-container container',
      regions: {
        addressFormRegion: '[data-region="componentAddressFormRegion"]',
        addressFeedbackMsgRegion: '[data-region="componentAddressFeedbackRegion"]'
      },
      events: {
        'click [data-el-label="addressForm.edit"]': function (event) {
          event.preventDefault();
          var addressHref = this.addressFormRegion.currentView.model.get('href');
          if (addressHref) {
            EventBus.trigger('address.editAddressBtnClicked', addressHref);
          } else {
            EventBus.trigger('address.editAddressBtnClicked');
          }
        },
        'click [data-el-label="addressForm.cancel"]': function (event) {
          event.preventDefault();
          EventBus.trigger('address.cancelBtnClicked');
        }
      }
    });

    /**
     * Get form values from from markup, and save it into a object corresponding to Cortex address form
     * @returns {*} a filled cortex address form object
     */
    function getAddressFormValues() {
      return {
        "address": {
          "street-address": $('#StreetAddress').val(),
          "extended-address": $('#ExtendedAddress').val(),
          "locality": $('#City').val(),
          "region": $('#Region').val(),
          "country-name": $('#Country').val(),
          "postal-code": $('#PostalCode').val()
        },
        "name": {
          "given-name": $('#FirstName').val(),
          "family-name": $('#LastName').val()
        }
      };
    }

    /**
     * Displays error message feedback for address form operations
     * @param errorMsg error message to display
     */
    function displayAddressFormErrorMsg(errorMsg) {
      if (!errorMsg) {
        ep.logger.warn('displayAddressFormErrorMsg called without error message');
        return; // skip rest of the function
      }

      $('html, body').animate({ scrollTop: 0 }, 'fast');
      $('[data-region="componentAddressFeedbackRegion"]').html(errorMsg);
//      $('[data-region="componentAddressFeedbackRegion"]').attr('data-i18n', key);
    }

    /**
     * Translate raw error response coming back from Cortex.
     * (This is a temporary fix until cortex return specific error code / key for localization mapping.)
     * @param rawMsg  error message from Cortex.
     * @returns String localized error message formatted as list.
     */
      // this is a temporary solution, should not match & parse String.
    function translateErrorMessage(rawMsg) {
      var rawMsgList;
      var errMsgKeyList = [];
      var unHandledErrMsgList = [];
      var translatedMsgList = [];

      // make this a map, key is locale key
      // chekin check with cortex team when getting null, change to generalSaveAddressFailedErrMsg
      var cortexMsgToKeyMap = {
        "No valid address fields specified" : 'generalSaveAddressFailedErrMsg',
        "family-name: may not be null" : 'missingFamilyNameErrMsg',
        "given-name: may not be null" : 'missingGivenNameErrMsg',
        "postal-code: may not be null" : 'missingPostalCodeErrMsg',
        "street-address: may not be null" : 'missingStreetAddErrMsg',
        "locality: may not be null": 'missingLocalityErrMsg',
        "country-name: may not be null" : 'missingCountryErrMsg',
        "family-name: must not be blank" : 'missingFamilyNameErrMsg',
        "given-name: must not be blank" : 'missingGivenNameErrMsg',
        "postal-code: must not be blank" : 'missingPostalCodeErrMsg',
        "street-address: must not be blank" : 'missingStreetAddErrMsg',
        "region: must not be blank" : 'missingRegionErrMsg',
        "locality: must not be blank": 'missingLocalityErrMsg',
        "country-name: must not be blank" : 'missingCountryErrMsg',
        "family-name: size must be between 1 and 100": 'invalidFamilyNameErrMsg',
        "given-name: size must be between 1 and 100": 'invalidGivenNameErrMsg',
        "postal-code: size must be between 1 and 50": 'invalidPostalCodeErrMsg',
        "street-address: size must be between 1 and 200" : 'invalidStreetAddErrMsg',
        "extended-address: size must be between 0 and 200" : 'invalidExtendedAddErrMsg',
        "locality: size must be between 1 and 200" : 'invalidLocalityErrMsg',
        "region: size must be between 0 and 200": 'invalidRegionErrMsg',
        "region: does not exist in list of supported codes": 'invalidRegionErrMsg',
        "country-name: size must be between 1 and 200": 'invalidCountryErrMsg',
        "country-name: does not exist in list of supported codes": 'invalidCountryErrMsg'
      };

      // parse message by ';' separator into separate lines
      rawMsgList = rawMsg.split('; ');

      // match raw messages to localization keys
      _.each(rawMsgList, function (cortexMsg) {
        // match message against cortexMsgToKeyMap
        if (cortexMsgToKeyMap.hasOwnProperty(cortexMsg)){
          var key = 'addressForm.errorMsg.' + cortexMsgToKeyMap[cortexMsg];
          // check there isn't duplicate error message key
          if (errMsgKeyList.indexOf(key) < 0) {
            errMsgKeyList.push(key);
          }
        }
        // if matches nothing in cortexMsgToKeyMap, store in separate list
        else {
          unHandledErrMsgList.push(cortexMsg);
        }
      });

      // if non of raw messages are unhandled display a generic error message
      if (unHandledErrMsgList.length > 0) {
        if (errMsgKeyList.length === 0) {
          errMsgKeyList.push('addressForm.errorMsg.generalSaveAddressFailedErrMsg');
        }
        else {
          ep.logger.warn('Unhandled address form err message: ' + unHandledErrMsgList);
        }
      }

      _.each(errMsgKeyList, function(key) {
        translatedMsgList.push(i18n.t(key));
      });

      translatedMsgList.sort();

      return formatMsgAsList(translatedMsgList);
    }

    /**
     * Format message list into HTML unordered list.
     * @param msgList array of messages
     * @returns String messages in unordered list, or just message if only 1 line.
     */
    function formatMsgAsList(msgList) {
      var formattedMsg = '';

      // if there is more than 1 line, format it as list
      if (msgList.length > 1) {
        formattedMsg = '<UL class="address-form-error-list">';
        msgList.forEach(function (line) {
          formattedMsg += '<LI>' + line + '</LI>';
        });
        formattedMsg += '</UL>';
      }
      else if (msgList.length === 1){
        formattedMsg = msgList[0];
      }

      return formattedMsg;
    }

    return {
      DefaultAddressItemView: defaultAddressItemView,
      DefaultAddressFormView: defaultAddressFormView,
      DefaultCreateAddressLayout: defaultCreateAddressLayout,
      DefaultEditAddressLayout: defaultEditAddressLayout,
      getAddressFormValues: getAddressFormValues,
      displayAddressFormErrorMsg: displayAddressFormErrorMsg,
      translateErrorMessage: translateErrorMessage,
      testVariables: {
        formatMsgAsList: formatMsgAsList
      }
    };
  });