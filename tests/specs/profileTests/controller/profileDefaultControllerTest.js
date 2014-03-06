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
 * Functional Storefront Unit Test - Profile Controller
 */
define(function (require) {
  var Backbone = require('backbone');
  var Mediator = require('mediator');
  var ep = require('ep');

  var controller = require('profile');
  var template = require('text!modules/base/profile/base.profile.templates.html');

  describe("Profile Module: DefaultController", function () {
    before(function () {
      sinon.stub(Backbone, 'sync');

      $("#Fixtures").append(template);
    });

    after(function () {
      $("#Fixtures").empty();
      Backbone.sync.restore();
    });

    describe('called when user logged in', function () {
      before(function () {
        sinon.stub(ep.app, 'isUserLoggedIn', function () {
          return true;
        });
        this.viewLayout = new controller.DefaultController();
        this.viewLayout.render();
      });

      after(function () {
        ep.app.isUserLoggedIn.restore();
      });

      it('should be an instance of Marionette Layout object', function () {
        expect(this.viewLayout).to.be.an.instanceOf(Marionette.Layout);
      });
      it('view\'s DOM is rendered with 6 children (view content rendered)', function () {
        expect(this.viewLayout.el.childElementCount).to.be.equal(6);
      });
      it('Model should have fetched info from server once', function () {
        expect(Backbone.sync).to.be.calledOnce;
      });
    });
    describe('called when user not logged in', function () {
      before(function () {
        sinon.stub(Mediator, 'fire');
        sinon.stub(ep.app, 'isUserLoggedIn', function () {
          return false;
        });

        this.viewLayout = new controller.DefaultController();
      });

      after(function () {
        ep.app.isUserLoggedIn.restore();
        Mediator.fire.restore();
      });

      it('DefaultView should exist', function () {
        expect(this.viewLayout).to.exist;
      });
      it('triggered with 2 arguments', function () {
        expect(Mediator.fire).to.be.calledWithExactly('mediator.loadRegionContent', 'loginModal');
      });
    });
  });

});