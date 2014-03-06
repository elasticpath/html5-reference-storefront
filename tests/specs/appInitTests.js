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

  // ["ERROR:  Exception[home][IndexLayout]: Cannot call method 'show' of undefined : TypeError: Cannot call method 'show' of undefined"]

  describe('EP Client App', function () {
    before(function(){
      ep.io.localStore.removeItem('testItem');
    });
    it('ep.app namespace should exist', function () {
      expect(ep.app).to.be.ok;
    });
    it('ep.app.deployMode method should exist', function () {
      expect(ep.app.deployMode).to.be.ok;
    });
    it('ep.app.cortexApi property should exist', function () {
      expect(ep.app.config.cortexApi).to.be.ok;
    });
    // cortexApi.host and port are currently removed since we don't seem to use them.
/*    it('ep.app.cortexApi.host property should exist', function () {
      expect(ep.app.config.cortexApi.host).to.be.ok;
    });
    it('ep.app.cortexApi.port property should exist', function () {
      expect(ep.app.config.cortexApi.port).to.be.ok;
    });*/
    it('ep.app.cortexApi.path property should exist', function () {
      expect(ep.app.config.cortexApi.path).to.be.ok;
    });
    it('ep.app.cortexApi.scope property should exist', function () {
      expect(ep.app.config.cortexApi.scope).to.be.ok;
    });

    it('viewPortRegion should exist', function () {
      expect(ep.app.viewPortRegion).to.be.ok;
    });
    it('app.getUserPref should exist', function () {
      expect(ep.app.getUserPref).to.be.ok;
    });
    it('app.setUserPref should exist', function () {
      expect(ep.app.setUserPref).to.be.ok;
    });
    it('userPref should set and get value', function () {
      ep.app.setUserPref('myUserPref', 'fastest');
      expect(ep.app.getUserPref('myUserPref')).to.equal('fastest');
    });
    it('IO namespace should exist', function () {
      expect(ep.io).to.be.ok;
    });
    it('IO AJAX namespace should exist', function () {
      expect(ep.io.ajax).to.be.ok;
    });
    it('ep.io.getApiContext method should exist', function () {
      expect(ep.io.getApiContext).to.be.ok;
    });
    it('ep.io.getApiContext() value should be not null', function () {
      var apiUrl = ep.io.getApiContext();
      expect(apiUrl).to.be.ok;
    });
    describe("EP IO localStore",function(){
      it('ep.io.localStore namespace should exist', function () {
        expect(ep.io.localStore).to.exist;
      });
      it("localStore getItem testItem should be null",function(){

        expect(ep.io.localStore.getItem('testItem')).to.be.null;
      });
      it("setItem 'testItem = test' in localStore",function(){
        ep.io.localStore.setItem('testItem','test');
        expect(ep.io.localStore.getItem('testItem')).to.equal('test');
      });
      it("localStore can set get and remove item (testItem)",function(){
        ep.io.localStore.setItem('testItem','test');
        expect(ep.io.localStore.getItem('testItem')).to.equal('test');
        ep.io.localStore.removeItem('testItem');
        expect(ep.io.localStore.getItem('testItem')).to.be.null;
      });
    });


    it(' UI namespace should exist', function () {
      expect(ep.ui).to.be.ok;
    });
    it('UI touchEnabled method should exist', function () {
      expect(ep.ui.touchEnabled).to.be.ok;
    });

    it('logger namespace should exist', function () {
      expect(ep.logger).to.be.ok;
    });
    it('logger.info should exist', function () {
      expect(ep.logger.info).to.be.ok;
    });
    it('logger.warn should exist', function () {
      expect(ep.logger.warn).to.be.ok;
    });
    it('logger.error should exist', function () {
      expect(ep.logger.error).to.be.ok;
    });
    it("isUserLoggedIn method should exist",function(){
      expect(ep.app.isUserLoggedIn).to.exist;
    });
    it("user should not be logged in",function(){
      expect(ep.app.isUserLoggedIn()).to.be.false;
    });
  });


  // start the app

  describe('EP EventBus', function () {
    it('should exist', function () {
      var EventBus = require('eventbus');
      expect(EventBus).to.be.ok;
    });
  });
/*
  // ["ERROR:  Exception[home][IndexLayout]: Cannot call method 'show' of undefined : TypeError: Cannot call method 'show' of undefined"]
  // bug caused because app trying to load IndexLayout, but it's not loaded into test
  describe('EP Application Init', function () {

    var EventBus = require('eventbus');
    EventBus.trigger('app.bootstrapInitSuccess');

    it('app start event should fire', function () {
      EventBus.on('ep.startAppRequest', function (done) {
        done();
      });
    });
    it('ep.router should exist', function () {
      expect(ep.router).to.be.ok;
    });
    it('ep.router.controller should exist', function () {
      expect(ep.router.controller).to.be.ok;
    });
    it('ep.router.appRoutes should exist', function () {
      expect(ep.router.appRoutes).to.be.ok;
    });
    it('ep.router.appRoutes.home should exist', function () {
      expect(ep.router.appRoutes.home).to.be.ok;
    });
    it('ep.app.config should exist', function () {
      expect(ep.app.config).to.be.ok;
    });
  });
*/

});
