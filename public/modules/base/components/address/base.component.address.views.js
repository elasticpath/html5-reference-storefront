/**
 * Copyright Elastic Path Software 2013.
 *
 */
define(['marionette'],
  function(Marionette) {
    var defaultAddressItemView = Marionette.ItemView.extend({
      template: '#DefaultAddressTemplate',
      tagName: 'ul',
      className: 'address-container'
    });

    return {
      DefaultAddressItemView: defaultAddressItemView
    };
  });