define(function (require) {
  'use strict';

  describe('Registration Module Tests', function () {

    /*
     * Controller Tests
     */
    // defaultEditAddressController Tests
//    require('specs/addressTests/controller/defaultEditAddressControllerTests.js');

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