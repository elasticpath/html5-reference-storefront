/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.

 * User: sbrookes
 * Date: 05/09/13
 * Time: 1:55 PM
 *
 */

define(function (require) {
  var iaViews = require('appheader');

  describe('EP IA Module ', function () {
//    MainNavView:MainNavView,
//      BrowseCategoryView:BrowseCategoryView

    describe('- IA Views',function(){
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
