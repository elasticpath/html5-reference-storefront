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
define(function(require) {
  var ep = require('ep');
  var Backbone = require('backbone');

  var controller = require('address');
  var view = require('address.views');
  var template = require('text!modules/base/components/address/base.component.address.template.html');

  describe('Address Module: Controller: DefaultCreateAddressView', function () {
    describe('when a user is logged in', function () {
      before(function () {
        $("#Fixtures").append(template); // append templates

        sinon.stub(Backbone.Model.prototype, 'fetch');
        sinon.stub(Backbone.Collection.prototype, 'fetch');

        this.controller = controller.DefaultCreateAddressView();
      });

      after(function () {
        $("#Fixtures").empty();
        Backbone.Collection.prototype.fetch.restore();
        Backbone.Model.prototype.fetch.restore();
      });

      it('returns an instance of DefaultCreateAddressLayout', function () {
        expect(this.controller).to.be.instanceOf(view.DefaultCreateAddressLayout);
      });
    });
  });

});