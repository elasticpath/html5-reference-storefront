/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
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
