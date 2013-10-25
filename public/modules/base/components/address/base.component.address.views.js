/**
 * Copyright Elastic Path Software 2013.
 *
 */
define(['backbone'],
  function(Backbone) {
    var defaultAddressItemView = Backbone.Marionette.ItemView.extend({
      template: '#DefaultAddressTemplate',
      tagName: 'ul',
      className: 'address-container'
    });

    return {
      DefaultAddressItemView: defaultAddressItemView
    };
  });