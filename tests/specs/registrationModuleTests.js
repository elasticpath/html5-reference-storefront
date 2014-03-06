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