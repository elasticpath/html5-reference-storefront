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
 */
define(function (require) {
  describe('UI Storefront Home Module  ', function () {

    describe('Home Controller', function () {
      var home = require('home');
      describe("DefaultView", function () {
        var defaultView = new home.IndexLayout();
        it('DefaultView should exist', function () {
          expect(defaultView).to.exist;
        });
      });
    });

    describe('Home Views', function () {
    var homeView = require('home.views');
      describe('DefaultView ', function () {
        var defaultView = new homeView.DefaultHomeLayout();
        it('DefaultView should exist', function () {
          expect(defaultView).to.exist;
        });
        it('DefaultView should have a homeContentRegion', function () {
          expect(defaultView.homeContentRegion).to.exist;
        });
      });
    });

  });
});
