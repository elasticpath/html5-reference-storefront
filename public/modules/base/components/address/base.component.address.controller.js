/**
 * Copyright Elastic Path Software 2013.
 */

define(function (require) {
  var ep = require('ep'),
    EventBus = require('eventbus'),
    View = require('address.views'),
    template = require('text!modules/base/components/address/base.component.address.template.html');

  /**
   * Inject the address template into TemplateContainer for the views to reference
   */
  $('#TemplateContainer').append(template);

  /**
   * Creates namespace to template to reference model and viewHelpers
   */
  _.templateSettings.variable = 'E';

  /**
   * Renders a Default Address ItemView with regions and models passed in
   * @param addressObj  contains region to render in and the model to render with
   */
  var loadAddressView = function (addressObj) {
    try {
      var addressView = new View.DefaultAddressItemView({
        model: addressObj.model
      });

      addressObj.region.show(addressView);
    } catch (error) {
      ep.logger.error('failed to load Address View: ' + error.message);
    }
  };

  /*
   *
   *
   * Event Listeners
   */
  EventBus.on('components.loadAddressesViewRequest', loadAddressView);
});