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
        expect(iaController.MainNavView).to.exsist;
      });
      it("BrowseCategoryView view should exist",function(){
        expect(iaController.BrowseCategoryView).to.exsist;
      });

    });
    describe("IA Views",function(){
      var iaViews = require('modules/ia/ia.views');
      it("MainNavView view should exist",function(){
        expect(iaViews.MainNavView).to.exsist;
      });
      it("NavItemView view should exist",function(){
        expect(iaViews.NavItemView).to.exsist;
      });
      it("BrowseCategoryLayout view should exist",function(){
        expect(iaViews.BrowseCategoryLayout).to.exsist;
      });
      it("BrowseCategoryList view should exist",function(){
        expect(iaViews.BrowseCategoryList).to.exsist;
      });
      it("BrowseItemView view should exist",function(){
        expect(iaViews.BrowseItemView).to.exsist;
      });
      it("CatagoryNodeView view should exist",function(){
        expect(iaViews.CatagoryNodeView).to.exsist;
      });
      it("MainNavPreferencesView view should exist",function(){
        expect(iaViews.MainNavPreferencesView).to.exsist;
      });
      it("clearSelectedMainNav method should exist",function(){
        expect(iaViews.clearSelectedMainNav).to.exist;
      });

    });
    describe("IA Models",function(){
      var iaModel = require('modules/ia/ia.models');

        it("MainNavCollection should exist",function(){
          expect(iaModel.MainNavCollection).to.exist;
        });
        it("BrowseItemCollection should exist",function(){
          expect(iaModel.BrowseItemCollection).to.exist;
        });
        it("BrowseCategoryCollection should exist",function(){
          expect(iaModel.BrowseCategoryCollection).to.exist;
        });
        it("BrowseCategoryLayout should exist",function(){
          expect(iaModel.BrowseCategoryLayout).to.exist;
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
