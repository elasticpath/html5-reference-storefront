/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.

 * User: sbrookes
 * Date: 19/06/13
 * Time: 2:33 PM
 *
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
