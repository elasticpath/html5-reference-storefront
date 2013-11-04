/**
 * Copyright Elastic Path Software 2013.
 *
 */
define(['marionette'],
  function(Marionette) {
    /**
     * Default Address ItemView
     * Will render an default address
     * @type Marionette.ItemView
     */
    var defaultAddressItemView = Marionette.ItemView.extend({
      template: '#DefaultAddressTemplate',
      tagName: 'ul',
      className: 'address-container',
      attributes: {
        'data-el-label' : 'profile.noAddressMsg'
      }
    });

    return {
      DefaultAddressItemView: defaultAddressItemView
    };
  });