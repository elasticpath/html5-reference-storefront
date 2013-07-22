/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.

 * User: sbrookes
 * Date: 19/06/13
 * Time: 2:33 PM
 *
 */
define(function(require) {
  var home   = require('home');

  describe('EP Home Index View ', function(){
    it('should exist', function(){
      var homeIndexView = home.IndexView();
      expect(homeIndexView).to.be.ok;
    });
  });
  describe('EP Home Index Layout ', function(){
    it('should exist', function(){
      var homeIndexLayout = home.IndexLayout();
      expect(homeIndexLayout).to.be.ok;
    });
  });
});
