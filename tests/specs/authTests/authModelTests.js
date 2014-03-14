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
  var ep = require('ep');
  var _ = require('underscore');

  var authModels = require('auth.models');
  var dataJSON = require('text!../../../tests/data/auth.json');

  describe("Auth Module: Models", function() {
    it("LogoutModel should exist", function () {
      expect(authModels.LogoutModel).to.exist;
    });
    it("LoginModel should exist", function () {
      expect(authModels.LoginModel).to.exist;
    });

    describe('AnonymousCheckoutModel', function () {
      var authData = JSON.parse(_.clone(dataJSON)).response.anonymousForm;
      var anonymousModel = new authModels.AnonymousCheckoutModel();

      describe('given valid response', function () {
        before(function () {
          this.model = anonymousModel.parse(authData);
        });

        after(function () {
          delete(this.model);
        });

        it('returns create email action link', function () {
          expect(this.model.emailActionLink).to.be.equal('ROOT/emails/campus');
        });
      });

      describe('given no response', function () {
        before(function () {
          sinon.stub(ep.logger, 'error');
          this.model = anonymousModel.parse(undefined);
        });

        after(function () {
          ep.logger.error.restore();
        });

        it('logs an error', function () {
          expect(ep.logger.error).to.be.called;
        });

        it('returns empty object', function () {
          expect(this.model).to.be.eql({});
        });
      });
    });
  });
});