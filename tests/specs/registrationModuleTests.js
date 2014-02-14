/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 * Functional Storefront Unit Test - Registration Module Views
 */

define(function (require) {
  'use strict';

  describe('Registration Module Tests', function () {

    /*
     * Controller Tests
     */
    // Registration events tests
    require('specs/registrationTests/controller/registrationEventsTests.js');

    // Registration controller helper functions
    require('specs/registrationTests/controller/registrationHelperTests.js');

    /*
     * View Tests
     */
    // DefaultLayout Tests
    require('specs/registrationTests/view/DefaultLayoutTests.js');

    // RegistrationFormItemView Tests
    require('specs/registrationTests/view/RegistrationFormItemViewTests.js');

    // RegistrationErrorCollectionView Tests
    require('specs/registrationTests/view/RegistrationErrorCollectionViewTests.js');



  });

});