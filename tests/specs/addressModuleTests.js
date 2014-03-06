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
 * Functional Storefront Unit Test - Address Component
 */
define(function (require) {
  'use strict';

  describe('Address Component Tests', function () {

    /*
     * Controller Tests
     */
    // defaultEditAddressController Tests
    require('specs/addressTests/controller/defaultEditAddressControllerTests.js');

    // defaultCreateAddressController Tests
    require('specs/addressTests/controller/defaultCreateAddressControllerTests.js');

    // defaultAddressFormController Tests
    require('specs/addressTests/controller/defaultAddressFormControllerTests.js');

    // General Events tests
    require('specs/addressTests/controller/addressEventsTests.js');

    // Submit Address Events Tests
    require('specs/addressTests/controller/submitAddressEventsTests.js');


    /*
     * View Tests
     */
    // defaultAddressItemView Tests
    require('specs/addressTests/view/defaultAddressItemViewTests.js');

    // defaultCreateAddressLayout Tests
    require('specs/addressTests/view/defaultCreateAddressLayoutTests.js');

    // defaultEditAddressLayout Tests
    require('specs/addressTests/view/defaultEditAddressLayoutTests.js');

    // defaultAddressFormView Tests
    require('specs/addressTests/view/defaultAddressFormViewTests.js');

    // defaultOptionItemView + defaultSelectionNoneOptionView Tests
    require('specs/addressTests/view/defaultOptionItemViewTests.js');

    // defaultCountriesView Tests
    require('specs/addressTests/view/defaultCountriesViewTests.js');

    // defaultRegionsView Tests
    require('specs/addressTests/view/defaultRegionsViewTests.js');

    // Address Helpers Functions Tests
    require('specs/addressTests/view/addressHelpersTests.js');


    /*
     * Models Tests
     */
    // Address Model Tests
    require('specs/addressTests/model/addressModelTests.js');

    // Country Collection Tests
    require('specs/addressTests/model/countryCollectionTests.js');

    // Region Collection Tests
    require('specs/addressTests/model/regionCollectionTests.js');

    // modelHelpers Tests
    require('specs/addressTests/model/modelHelpersTests.js');

  });

});