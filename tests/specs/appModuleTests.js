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
  var ep = require('ep');
  var EventBus = require('eventbus');
  var app = require('app');
  var appview = require('app.views');


  describe('EP App module view default layout regions ', function () {
    EventBus.trigger('ep.startAppRequest');
    var baseLayoutView = new appview.BaseLayout();
    //baseLayoutView.render();


    it('app view base layout exists', function () {
      EventBus.on('ep.startAppRequest', function (done) {
        expect(baseLayoutView).to.be.ok;
        done();
      });

    });
    it('app view app appHeaderRegion exists', function () {

      EventBus.on('ep.startAppRequest', function (done) {
        expect(ep.app.appHeaderRegion).to.be.ok;
        done();
      });


    });
    it('app view app mainNavRegion exists', function () {
      EventBus.on('ep.startAppRequest', function (done) {
        expect(ep.app.mainNavRegion).to.be.ok;
        done();
      });

    });
    it('app view app appMainRegion exists', function () {
      EventBus.on('ep.startAppRequest', function (done) {
        expect(ep.app.appMainRegion).to.be.ok;
        done();
      });

    });

    it('app view app appFooterRegion exists', function () {
      EventBus.on('ep.startAppRequest', function (done) {
        expect(ep.app.appFooterRegion).to.be.ok;
        done();
      });

    });

  });
});
