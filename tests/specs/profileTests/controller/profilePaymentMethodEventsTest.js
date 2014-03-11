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
 * Functional Storefront Unit Test - Profile controller payment method events tests
 */
define(function (require) {
  var Backbone = require('backbone');
  var EventBus = require('eventbus');
  var ep = require('ep');

  describe('Profile Module: Payment Method Events', function () {
    require('profile');

    describe('Responds to event: profile.getSavePaymentMethodToProfileUrl', function () {
      before(function () {
        sinon.stub(Backbone.Model.prototype, 'fetch');

        this.model = require('profile.models');
        sinon.stub(this.model, 'ProfilePaymentMethodActionModel', Backbone.Model);
        EventBus.trigger('profile.getSavePaymentMethodToProfileUrl', {});
      });

      after(function () {
        delete(this.model);
        Backbone.Model.prototype.fetch.restore();
      });

      it('defines a new ProfilePaymentMethodActionModel and calls Backbone.Model fetch', function () {
        expect(this.model.ProfilePaymentMethodActionModel).to.be.called;
        expect(Backbone.Model.prototype.fetch).to.be.called;
      });
    });
  });
});