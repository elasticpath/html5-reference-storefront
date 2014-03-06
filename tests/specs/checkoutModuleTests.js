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
 * Functional Storefront Unit Test - Checkout Module
 */
define(function (require) {
  'use strict';

  describe('Checkout Module Tests', function () {

    /*
     * Controller Tests
     */
    // Default Controller Tests
    require('specs/checkoutTests/controller/checkoutDefaultControllerTest.js');

    // submit Order Events Tests
    require('specs/checkoutTests/controller/submitOrderEventsTests.js');

    // billing / shipping address (option) Events Tests
    require('specs/checkoutTests/controller/billShipAddressesEventsTests.js');

    // payment method events tests
    require('specs/checkoutTests/controller/paymentMethodEventsTests.js');


    /*
     * View Tests
     */
    // checkout defaultLayout + TitleView Tests
    require('specs/checkoutTests/view/checkoutDefaultLayoutTests.js');

    // checkout Summary Views Tests
    require('specs/checkoutTests/view/checkoutSummaryViewTests.js');

    // Billing / Shipping Address Views Tests
    require('specs/checkoutTests/view/billShipAddressViewsTests.js');

    // Shipping Option Views Tests
    require('specs/checkoutTests/view/shippingOptionViewsTests.js');

    // Payment Method Views Tests
    require('specs/checkoutTests/view/paymentMethodViewsTests.js');

    // ViewHelpers Tests
    require('specs/checkoutTests/view/checkoutViewHelpersTests.js');


    /*
     * Models Tests
     */
    // checkout Models Tests
    require('specs/checkoutTests/model/checkoutModelsTests.js');

    // checkout Model Helpers Tests
    require('specs/checkoutTests/model/checkoutModelHelpersTests.js');

  });

});
