/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.

 * User: sbrookes
 * Date: 19/06/13
 * Time: 10:06 AM
 *
 */
define(function(require) {
  var ep = require('ep');

  describe('EP Client App', function(){
    it('ep.app namespace should exist', function(){
      expect(ep.app).to.be.ok;
    });
    it('ep.app.deployMode method should exist', function(){
      expect(ep.app.deployMode).to.be.ok;
    });
    it('ep.app.cortexApi property should exist', function(){
      expect(ep.app.config.cortexApi).to.be.ok;
    });
    it('ep.app.cortexApi.host property should exist', function(){
      expect(ep.app.config.cortexApi.host).to.be.ok;
    });
    it('ep.app.cortexApi.port property should exist', function(){
      expect(ep.app.config.cortexApi.port).to.be.ok;
    });
    it('ep.app.cortexApi.path property should exist', function(){
      expect(ep.app.config.cortexApi.path).to.be.ok;
    });
    it('ep.app.cortexApi.store property should exist', function(){
      expect(ep.app.config.cortexApi.store).to.be.ok;
    });
    it('ep.app.showInstrumentation method should exist', function(){
      expect(ep.app.showInstrumentation).to.be.ok;
    });
    it('viewPortRegion should exist', function(){
      expect(ep.app.viewPortRegion).to.be.ok;
    });
    it('app.getUserPref should exist', function(){
      expect(ep.app.getUserPref).to.be.ok;
    });
    it('app.setUserPref should exist', function(){
      expect(ep.app.setUserPref).to.be.ok;
    });
    it('userPref should set and get value', function(){
      ep.app.setUserPref('myUserPref','fastest');
      expect(ep.app.getUserPref('myUserPref')).to.equal('fastest');
    });
    it('IO namespace should exist', function(){
      expect(ep.io).to.be.ok;
    });
    it('IO AJAX namespace should exist', function(){
      expect(ep.io.ajax).to.be.ok;
    });
    it('ep.io.getApiUrl method should exist', function(){
      expect(ep.io.getApiUrl).to.be.ok;
    });
    it('ep.io.getApiUrl() value should be not null', function(){
      var apiUrl = ep.io.getApiUrl();
      expect(apiUrl).to.be.ok;
    });

    it(' UI namespace should exist', function(){
      expect(ep.ui).to.be.ok;
    });
    it('UI touchEnabled method should exist', function(){
      expect(ep.ui.touchEnabled).to.be.ok;
    });
    it('localStorage method should exist', function(){
      expect(ep.ui.localStorage).to.be.ok;
    });
    it('logger namespace should exist', function(){
      expect(ep.logger).to.be.ok;
    });
    it('logger.info should exist', function(){
      expect(ep.logger.info).to.be.ok;
    });
    it('logger.warn should exist', function(){
      expect(ep.logger.warn).to.be.ok;
    });
    it('logger.error should exist', function(){
      expect(ep.logger.error).to.be.ok;
    });
  });


  // start the app

  describe('EP EventBus', function(){
    it('should exist', function(){
      var EventBus = require('eventbus');
      expect(EventBus).to.be.ok;
    });
  });
  describe('EP Application Init', function(){

    var EventBus = require('eventbus');
    EventBus.trigger('app.bootstrapInitSuccess');

    it('app start event should fire', function(){
      EventBus.on('ep.startAppRequest', function(done){
        done();
      });
    });
    it('ep.router should exist', function(){
      expect(ep.router).to.be.ok;
    });
    it('ep.router.controller should exist', function(){
      expect(ep.router.controller).to.be.ok;
    });
    it('ep.router.appRoutes should exist', function(){
      expect(ep.router.appRoutes).to.be.ok;
    });
    it('ep.router.appRoutes.home should exist', function(){
      expect(ep.router.appRoutes.home).to.be.ok;
    });
    it('ep.app.config should exist', function(){
      expect(ep.app.config).to.be.ok;
    });
  });

});
