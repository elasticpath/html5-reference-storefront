/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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