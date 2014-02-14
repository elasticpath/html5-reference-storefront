/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
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
    require('specs/checkoutTests/view/BillShipAddressViewsTests.js');

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