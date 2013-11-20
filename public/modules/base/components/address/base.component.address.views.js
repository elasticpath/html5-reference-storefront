/**
 * Copyright Elastic Path Software 2013.
 *
 * Storefront - Address Component Views
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
     * Get form values from from markup, and save it into a object corresponding to Cortex address form
     * @returns {*} a filled cortex address form object
     */
    function getAddressForm() {
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
     * @param errMsgKey i18n key for corresponding error message, or error message itself.
     */
    function displayAddressFormErrorMsg(errMsgKey) {
      if (!errMsgKey) {
        ep.logger.warn('displayAddressFormErrorMsg called without error message');
        return; // skip rest of the function
      }

      var errMsg = i18n.t(errMsgKey);
      var formattedMsg = formatMsgAsList(errMsg);

      $('[data-region="componentAddressFeedbackRegion"]').html(formattedMsg);
//      $('[data-region="componentAddressFeedbackRegion"]').attr('data-i18n', key);
    }

    function formatMsgAsList(msg) {
      var formattedMsg;
      var msgList = [];

      // parse message by ';' separator into separate lines
      msgList = msg.split('; ');

      // if there is more than 1 line, format it as list
      if (msgList.length > 1) {
        formattedMsg = '<UL class="address-form-error-list">';
        msgList.forEach(function (line) {
          formattedMsg += '<LI>' + line + '</LI>';
        });
        formattedMsg += '</UL>';
      }
      else {
        formattedMsg = msg;
      }

      return formattedMsg;
    }

    return {
      DefaultAddressItemView: defaultAddressItemView,
      DefaultAddressFormView: defaultAddressFormView,
      DefaultCreateAddressLayout: defaultCreateAddressLayout,
      getAddressForm: getAddressForm,
      displayAddressFormErrorMsg: displayAddressFormErrorMsg,
      testVariables: {
        formatMsgAsList: formatMsgAsList
      }
    };
  });