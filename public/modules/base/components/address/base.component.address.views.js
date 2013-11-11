/**
 * Copyright Elastic Path Software 2013.
 *
 */
define(['marionette', 'eventbus'],
  function(Marionette, EventBus) {

    var viewHelpers = {};

    /**
     * Default Address ItemView
     * Will render an default address
     * @type Marionette.ItemView
     */
    var defaultAddressItemView = Marionette.ItemView.extend({
      template: '#DefaultAddressTemplate',
      tagName: 'ul',
      className: 'address-container'
    });

    var defaultAddressFormView = Marionette.ItemView.extend({
      template: '#DefaultAddressFormTemplate',
      tagName: 'ul',
      className: 'address-form-container',
      templateHelpers: viewHelpers
    });

    var defaultCreateAddressLayout = Marionette.Layout.extend({
      template: '#DefaultCreateAddressTemplate',
      templateHelpers: viewHelpers,
      regions: {
        addressFormRegion: '[data-region="componentAddressFormRegion"]',
        addressFeedbackMsgRegion: '[data-region="componentAddressFeedbackRegion"]'
      },
      events: {
        'click [data-el-label="addressForm.create"]' : function(event) {
          event.preventDefault();
          EventBus.trigger('address.createAddressBtnClicked');
        },
        'click [data-el-label="addressForm.cancel"]' : function(event) {
          event.preventDefault();
          $.modal.close();
        }
      }
    });

    function getAddressModel() {

    }

    function displayAddressFormErrorMsg(errMsg) {

    }
    /*
     var getLoginRequestModel = function(){
     var retVal = new Model.LoginFormModel();
     retVal.set('userName',$('#OAuthUserName').val());
     retVal.set('password',$('#OAuthPassword').val());
     retVal.set('role','REGISTERED');
     retVal.set('scope',ep.app.config.cortexApi.scope);
     return retVal;
     };

     var displayLoginErrorMsg = function(msg){
     if (msg) {
     var key = 'auth.' + msg;
     var errMsg = viewHelpers.getI18nLabel(key);
     $('.auth-feedback-container').text(errMsg);
     $('.auth-feedback-container').attr('data-i18n', key);
     }
     else {
     ep.logger.warn('DisplayLoginErrorMsg called without error message');
     }
     };
     */

    return {
      DefaultAddressItemView: defaultAddressItemView,
      DefaultAddressFormView: defaultAddressFormView,
      DefaultCreateAddressLayout: defaultCreateAddressLayout,
      getAddressModel: getAddressModel,
      displayAddressFormErrorMsg: displayAddressFormErrorMsg
    };
  });