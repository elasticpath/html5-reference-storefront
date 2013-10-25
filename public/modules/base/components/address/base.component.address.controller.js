/**
 * Copyright Elastic Path Software 2013.
 */

define(function (require) {
  var EventBus = require('eventbus'),
    View = require('address.views'),
    template = require('text!modules/base/components/address/base.component.address.template.html');

  $('#TemplateContainer').append(template);
  _.templateSettings.variable = 'E';

  EventBus.on('components.loadAddressesViewRequest', function (addressObj) {
    var addressView = new View.DefaultAddressItemView({
      model: addressObj.model
    });

    addressObj.region.show(addressView);
  });
});