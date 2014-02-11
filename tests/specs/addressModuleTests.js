/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
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