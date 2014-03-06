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
 * Default Profile Models
 * The HTML5 Reference Storefront's MVC Model manages zoom queries the model uses to ask cortex server.
 * It also parses the raw data returned from server, so necessary data are surfaced, and renamed into desired format.
 */
define(function (require) {
  var ep = require('ep');
  var Backbone = require('backbone');
  var ModelHelper = require('modelHelpers');

  // Array of zoom parameters to pass to Cortex
  var zoomArray = [
    'subscriptions:element',
    'purchases:element',
    'addresses:element',
    'paymentmethods:element'
  ];

  var urlBase = ep.io.getApiContext() + '/profiles/' + ep.app.config.cortexApi.scope + '/default';

  /**
   * Model containing profile information of a registered user.
   * @type Backbone.Model
   */
  var profileModel = Backbone.Model.extend({
    baseUrl: urlBase,
    url: urlBase + '?zoom=' + zoomArray.join(),
    parse: function (response) {
      var profileObj = {
        personalInfo: {},
        subscriptions: [],
        purchaseHistories: [],
        addresses: [],
        paymentMethods: []
      };

      if (response) {
        // Profile Personal Info
        profileObj.personalInfo = {
          familyName : jsonPath(response, 'family-name')[0],
          givenName : jsonPath(response, 'given-name')[0],
          actionLink: jsonPath(response, 'self.href')[0]
        };

        // Payment methods (tokenized only)
        // Only select payment methods with a display-value property (credit cards do not have this property)
        var paymentMethodsArray = jsonPath(response, "$._paymentmethods.._element[?(@.self.type=='application/vnd.elasticpath.paymenttoken')]");
        if(paymentMethodsArray) {
          profileObj.paymentMethods = modelHelpers.parseArray(paymentMethodsArray, modelHelpers.parseTokenPayment);
        }

        // Profile Subscription Info
        var subscriptionsArray = jsonPath(response, '$._subscriptions.._element')[0];
        if (subscriptionsArray) {
          profileObj.subscriptions = modelHelpers.parseArray(subscriptionsArray, modelHelpers.parseSubscription);
        }

        // Profile Purchase History
        var purchaseHistoryArray = jsonPath(response, '$._purchases.._element')[0];
        if (purchaseHistoryArray) {
          profileObj.purchaseHistories = modelHelpers.parseArray(purchaseHistoryArray, modelHelpers.parsePurchaseHistory);
        }

        // Profile addresses
        var addressesArray = jsonPath(response, '$._addresses.._element')[0];
        if (addressesArray) {
          profileObj.addresses = modelHelpers.parseArray(addressesArray, modelHelpers.parseAddress);
        }
      }
      else {
        ep.logger.error("Profile model wasn't able to fetch valid data for parsing. ");
      }

      return profileObj;
    }
  });

  /**
   * Model that returns the action href to which the new payment method form should be submitted.
   * This href can be used either:
   * - when payment methods are added from profile
   * - when payment methods are added from checkout AND the shopper has chosen to save the payment method to profile
   * @type Backbone.Model
   */
  var profilePaymentMethodActionModel = Backbone.Model.extend({
    url: urlBase + '?zoom=paymentmethods:createpaymenttokenform',
    parse: function (response) {
      if (response) {
        // parse the JSON response and return the href if one is found
        return {
          url: jsonPath(response, "$..links[?(@.rel=='createpaymenttokenaction')].href")[0]
        };
      }
      ep.logger.error("Unable to fetch profile model payment method action link.");
      return false;
    }
  });

  /**
   * Placeholder to keep purchase collection for keeping track of model changes.
   * Do not fetch or parse data itself, Will have data passed in.
   * @type Backbone.Collection
   */
  var profilePurchaseCollection = Backbone.Collection.extend();

  /**
   * Collection of helper functions to parse the model.
   * @type Object collection of modelHelper functions
   */
  var modelHelpers = ModelHelper.extend({
    /**
     * Parses 1 purchase history record with purchase number, date, total, and status.
     * @param rawObject raw JSON object of 1 purchase history record
     * @returns Object  1 parsed purchase history record
     */
    parsePurchaseHistory: function(rawObject) {
      var purchaseRecord = {};

      if(rawObject) {
        purchaseRecord = {
          purchaseNumber: jsonPath(rawObject, '$.purchase-number')[0],
          date: {
            displayValue: jsonPath(rawObject, '$.purchase-date..display-value')[0],
            value: jsonPath(rawObject, '$.purchase-date..value')[0]
          },
          total: modelHelpers.parsePrice(jsonPath(rawObject, '$.monetary-total[0]')[0]),
          status: jsonPath(rawObject, '$.status')[0],
          link: jsonPath(rawObject, '$.self..href')[0]
        };
      }
      else {
        ep.logger.warn('Error building purchase record object: raw purchase record object was undefined.');
      }

      return purchaseRecord;
    }
  });

  var __test_only__ = {
    modelHelpers: modelHelpers
  };

  return {
    /* test-code */
    testVariable: __test_only__,
    /* end-test-code */

    ProfileModel: profileModel,
    ProfilePaymentMethodActionModel: profilePaymentMethodActionModel,
    ProfilePurchaseCollection: profilePurchaseCollection
  };
});