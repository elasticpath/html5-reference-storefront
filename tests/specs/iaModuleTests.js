/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.

 * User: sbrookes
 * Date: 05/09/13
 * Time: 1:55 PM
 *
 */

define(function (require) {


  describe('EP IA Module ', function () {


    describe("IA Controller",function(){
      var iaController = require('ia');
      it("MainNavView view should exist",function(){
        expect(iaController.MainNavView).to.exist;
      });
    });

    describe("IA Views",function(){
      var iaViews = require('ia.views');
      it("MainNavView view should exist",function(){
        expect(iaViews.MainNavView).to.exist;
      });
      it("NavItemView view should exist",function(){
        expect(iaViews.NavItemView).to.exist;
      });
      it("clearSelectedMainNav method should exist",function(){
        expect(iaViews.clearSelectedMainNav).to.exist;
      });

    });
    describe("IA Models",function(){
      var iaModel = require('ia.models');

        it("MainNavTopCategoryModel should exist",function(){
          expect(iaModel.MainNavTopCategoryModel).to.exist;
        });
    });

    /**
     * Jira CU-90
     *
     * Commenting these tests out for now as we are not working on this story right now.
     * Adding story to jira to track against backlog.
     *
     *     it("global cart navigation should exist");
            it("global login navigation should exist");
     *
     */


  });

});
