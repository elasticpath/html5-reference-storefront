/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 * Functional Storefront Unit Test - Payment Method Component
 */
define(function (require) {
  'use strict';

  describe('Payment Method Component Tests', function () {

    /*
     * Controller Tests
     */
    // defaultCreatePaymentController Tests
    require('specs/paymentComponentTests/controller/defaultCreatePaymentControllerTests.js');

    // controller general Events Tests
    require('specs/paymentComponentTests/controller/paymentEventsTests.js');


    /*
     * View Tests
     */
    // DefaultPaymentItemView Tests
    require('specs/paymentComponentTests/view/defaultPaymentItemViewTests.js');

    // DefaultPaymentFormView Tests
    require('specs/paymentComponentTests/view/defaultPaymentFormViewTests.js');

    // ViewHelpers Tests
    require('specs/paymentComponentTests/view/paymentHelpersTests.js');


    /*
     * Models Tests
     */
    // paymentForm Model tests
    require('specs/paymentComponentTests/model/paymentFormModelTests.js');


  });

});
