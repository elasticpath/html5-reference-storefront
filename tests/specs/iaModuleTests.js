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
