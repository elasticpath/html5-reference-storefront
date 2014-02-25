/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 *
 * Default Payment Method Component Models
 * Collection of backbone models storing payment related data.
 */
define(function (require) {
  var ep = require('ep');
  var Backbone = require('backbone');

  /**
   * Model containing the Cortex server link to which the new payment form should be posted.
   * @type Backbone.Model
   */
  var newPaymentModel = Backbone.Model.extend({
    getUrl: function (href) {
      return href + '?zoom=paymentmethodinfo:createpaymenttokenform';
    },
    parse: function (response) {
      var paymentFormObj = {};

      if (response) {
        paymentFormObj.href = jsonPath(response, "$..links[?(@.rel=='createpaymenttokenfororderaction')].href")[0];
      }
      else {
        ep.logger.error("new payment form model wasn't able to fetch valid data for parsing. ");
      }

      return paymentFormObj;
    }
  });

  return {
    NewPaymentModel: newPaymentModel
  };
});