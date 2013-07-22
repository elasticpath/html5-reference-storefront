/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.

 * User: sbrookes
 * Date: 19/06/13
 * Time: 2:41 PM
 *
 */
define(function(require) {
  var appHeader   = require('appheader');

  describe('EP App Header View ', function(){
    it('should exist', function(){
      var appHeaderView = appHeader.AppHeaderView();
      expect(appHeaderView).to.be.ok;
    });
  });
  describe('EP App Header Logo View ', function(){
    it('should exist', function(){
      var appHeaderLogoView = appHeader.HeaderLogoView();
      expect(appHeaderLogoView).to.be.ok;
    });
  });
});
