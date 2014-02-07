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
      className: 'address-container',
      onRender: function() {
        if (!this.model.get('region')) {
          $('[data-el-value="address.region"]', this.$el).hide();
        }

        if (!this.model.get('city')) {
          $('[data-el-value="address.city"]', this.$el).hide();
        }
      }
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
          var addressHref = this.model.get('href');
          if (addressHref) {
            EventBus.trigger('address.createAddressBtnClicked', addressHref);
          } else {
            ep.logger.warn('unable to retrieve url to post address form');
          }
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
          var addressHref = this.model.get('href');
          if (addressHref) {
            EventBus.trigger('address.editAddressBtnClicked', addressHref);
          } else {
            ep.logger.warn('unable to retrieve url to post address form');
          }
        },
        'click [data-el-label="addressForm.cancel"]': function (event) {
          event.preventDefault();
          EventBus.trigger('address.cancelBtnClicked');
        }
      }
    });

    /**
     * Default Address Form ItemView
     * will render a default address form
     * @type Marionette.ItemView
     */
    var defaultAddressFormView = Marionette.Layout.extend({
      template: '#DefaultAddressFormTemplate',
      className: 'address-form-container',
      regions: {
        countriesRegion: '[data-region="addressCountryRegion"]',
        regionsRegion: '[data-region="addressRegionsRegion"]'
      },
      templateHelpers: viewHelpers
    });

    /**
     * Default Option View
     * will render an option of a dropDown menu(select), set as selected if marked so in model
     * @type Marionette.ItemView
     */
    var defaultOptionsItemView = Marionette.ItemView.extend({
      template: '#DefaultAddressOptionTemplate',
      templateHelpers: viewHelpers,
      tagName: 'option',
      onRender: function() {
        // set dynamic attribute value + selected for wrapper tag
        var element = this.el;
        $(element).attr('value', this.model.get('name'));
        if (this.model.get('selected')) {
          $(element).attr('selected', true);
        }
      }
    });

    /**
     * Select None Option ItemView
     * will render an option representing no country / region selected. Used as emptyView for defaultRegionsView.
     * @type Marionette.ItemView
     */
    var defaultSelectionNoneOptionView = Marionette.ItemView.extend({
      template: '#DefaultAddressSelectNoneOptionTemplate',
      templateHelpers: viewHelpers,
      tagName: 'option',
      attributes: {
        'value': ''
      }
    });

    /**
     * Default Countries View
     * renders a wrapper, select element, for country options collection
     * @type Marionette.CompositeView
     */
    var defaultCountriesView = Marionette.CompositeView.extend({
      template: '#DefaultAddressCountriesTemplate',
      itemView: defaultOptionsItemView,
      templateHelpers: viewHelpers,
      itemViewContainer: 'select',
      collectionEvents: {
        'reset': 'render',
        'change': 'render'
      },
      events: {
        'change #Country': function(event) {
          var regionsLink = '';
          var country = $(event.target).val();
          var selectedCountry = this.collection.where({name: country})[0];
          if (selectedCountry) {
            regionsLink = selectedCountry.get('regionLink');
          }
          else {
            ep.logger.warn('No country with given countryCode (' + country + ') was found while retrieving regionLink');
          }
          EventBus.trigger('address.countrySelectionChanged', country, regionsLink);
        }
      }
    });

    /**
     * Default Regions View
     * renders a wrapper, select element, for region options collection
     * @type Marionette.CompositeView
     */
    var defaultRegionsView = Marionette.CompositeView.extend({
      template: '#DefaultAddressRegionsTemplate',
      emptyView: defaultSelectionNoneOptionView,
      itemView: defaultOptionsItemView,
      templateHelpers: viewHelpers,
      itemViewContainer: 'select',
      collectionEvents: {
        'reset': 'render',
        'change': 'render'
      },
      ui: {
        // A jQuery selector for the DOM element to which an activity indicator should be applied.
        activityIndicatorEl: '.activity-indicator-loading-region'
      },
      onRender: function () {
        // hide regions area if model.fetch returned an empty region array
        // test collection == 1 because collection.parse will insert a blank option, increase collection.length by 1
        // when page load with no country selected, when don't want to hide the whole region but show a dropDown with
        // ---- option to show consistency. when no country is selected, no regionLink is provide, and
        // so regions collection didn't fetch, collection.parse wasn't called, and thus collection.length = 0
        if(this.collection.length === 1) {
          $('[data-region="addressRegionsRegion"]').slideUp();
        }
        else {
          $('[data-region="addressRegionsRegion"]').show();
        }
      },
      events: {
        'change #Region': function (event) {
          var region = $(event.target).val();
          EventBus.trigger('address.regionSelectionChanged', region);
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
        formattedMsg = '<UL class="error-list">';
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

    var __test_only__ = {};
    __test_only__.formatMsgAsList = formatMsgAsList;
    __test_only__.defaultOptionsItemView = defaultOptionsItemView;
    __test_only__.defaultSelectionNoneOptionView = defaultSelectionNoneOptionView;

    return {
      /* test-code */
      __test_only__: __test_only__,
      /* end-test-code */
      DefaultAddressItemView: defaultAddressItemView,
      DefaultCreateAddressLayout: defaultCreateAddressLayout,
      DefaultEditAddressLayout: defaultEditAddressLayout,
      DefaultAddressFormView: defaultAddressFormView,
      DefaultCountriesView: defaultCountriesView,

      DefaultRegionsView: defaultRegionsView,
      getAddressFormValues: getAddressFormValues,
      displayAddressFormErrorMsg: displayAddressFormErrorMsg,
      translateErrorMessage: translateErrorMessage
    };
  });