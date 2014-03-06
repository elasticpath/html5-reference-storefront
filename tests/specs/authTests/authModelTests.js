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
 * Functional Storefront Unit Test - Auth Models
 */
define(function (require) {
  var authModel = require('auth.models');

  describe('Auth Module: Models', function () {
    it("LogoutModel should exist", function () {
      expect(authModel.LogoutModel).to.exist;
    });
    it("LoginFormModel should exist", function () {
      expect(authModel.LoginFormModel).to.exist;
    });
    it("LoginModel should exist", function () {
      expect(authModel.LoginModel).to.exist;
    });
  });
});