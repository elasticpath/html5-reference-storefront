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
 * Functional Storefront Unit Test - Profile Module
 */
define(function (require) {
  'use strict';

  describe('Profile Module Tests', function () {

    /*
     * Controller Tests
     */
    //profile DefaultController Test
    require('specs/profileTests/controller/profileDefaultControllerTest.js');

    // profile Address Events Test
    require('specs/profileTests/controller/profileAddressEventsTest.js');

    // profile Summary Events Test
    require('specs/profileTests/controller/profileEditInfoEventsTest.js');

    // profile Payment Methods Test
    require('specs/profileTests/controller/profilePaymentMethodEventsTest.js');


    /*
     * View Tests
     */
    // profile DefaultLayout + TitleView Test
    require('specs/profileTests/view/defaultLayoutTests.js');

    // profile SummaryView Test
    require('specs/profileTests/view/summaryViewsTests.js');

    // profile PurchasesView Test
    require('specs/profileTests/view/purchasesViewTests.js');

    // profile SubscriptionView Test
    require('specs/profileTests/view/subscriptionViewTests.js');

    // profile AddressesView Test
    require('specs/profileTests/view/addressesViewTests.js');

    // profile PaymentView Test
    require('specs/profileTests/view/paymentsViewTests.js');

    // profile ViewHelpers Test
    require('specs/profileTests/view/profileViewHelpersTests.js');


    /*
     * Models Tests
     */
    // profile Models Test
    require('specs/profileTests/model/profileModelsTests.js');

  });

});