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
 * Functional Storefront Unit Test - Auth Module
 */
define(function (require) {
  'use strict';

  describe('Auth Module Tests', function () {

    /*
     * Controller Tests
     */
    require('specs/authTests/authControllerTests.js');  // bug


    /*
     * View Tests
     */
    require('specs/authTests/view/defaultAuthViewTests.js');
    require('specs/authTests/view/checkoutAuthOptionViewsTests.js');


    /*
     * Models Tests
     */
    require('specs/authTests/authModelTests.js');

  });

});