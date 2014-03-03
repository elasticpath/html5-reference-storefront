/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
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