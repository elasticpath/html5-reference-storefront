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
 * Functional Storefront Unit Test - Auth Controllers
 */
define(function (require) {
  var ep = require('ep');
  var EventTestFactory = require('testfactory.event');
  var EventTestHelpers = require('testhelpers.event');
  var authController = require('auth');
  var authView = require('auth.views');
  var authModel = require('auth.models');

  describe('Auth Module: Controllers', function () {
    before(function() {
      this.ajax_stub = sinon.stub(ep.io,'ajax',function(options){
      });
    });

    after(function() {
      $("#Fixtures").empty();
      delete(this.ajax_stub);
      ep.io.ajax.restore();
    });

    it("DefaultView should exist", function () {
      expect(authController.DefaultView).to.exist;
    });
    it("LoginFormView should exist", function () {
      expect(authController.LoginFormView).to.exist;
    });
    it("ProfileMenuView should exist", function () {
      expect(authController.ProfileMenuView).to.exist;
    });

    it("log user in",function(done){
      var aModel = new authModel.LoginModel();
      aModel.set('username','ben.boxer@elasticpath.com');
      aModel.set('password','password');
      aModel.set('scope','mobee');
      aModel.set('role','REGISTERED');

      var authString = 'grant_type=password&username=' + aModel.get('userName')
        + '&password=' + aModel.get('password')
        + '&scope=' + aModel.get('scope')
        + '&role=' + aModel.get('role');

      aModel.set('data', authString);

      this.ajax_stub(aModel.attributes);
      expect(ep.io.ajax.calledOnce).to.be.true;
      done();
    });

    describe('Events tests', function() {
      before(function() {
        // Stub and unbind some events for all of the button enablement functions
        EventTestHelpers.unbind('auth.authenticationRequest');
      });

      after(function() {
        EventTestHelpers.reset('auth.authenticationRequest');
      });

      describe('responds to event: auth.loginRequestFailed',
        EventTestFactory.createEventBusBtnEnablementTest('auth.loginRequestFailed', 'enableButton'));

      describe('loginFormSubmitButtonClicked event tests', function() {
        before(function() {
          // Unbind this handler just for the loginFormSubmitButtonClicked tests
          EventTestHelpers.unbind('auth.loginFormValidationFailed');
        });

        after(function() {
          EventTestHelpers.reset('auth.loginFormValidationFailed');
        });

        describe('responds to event: auth.loginButtonClicked',
          EventTestFactory.createEventBusBtnEnablementTest('auth.loginButtonClicked', 'disableButton'));
      });

    });

  });


    /*
     // ["ERROR:  Exception[auth][LoginFormView]: Cannot call method 'show' of undefined : TypeError: Cannot call method 'show' of undefined"]
     it("Login Button click should fire auth.btnAuthGlobalMenuItemClicked", function (done) {
     EventBus.on('auth.btnAuthGlobalMenuItemClicked', function () {
     done();
     });
     $('button.btn-auth-menu').trigger('click');
     });

     it("ep.app.mainAuthRegion should exist", function () {
     expect(ep.app.mainAuthView).to.exist;
     });
     */

    /*
     // ["ERROR:  Exception[auth][ProfileMenuView]: Could not find template: '#AuthProfileMenuTemplate' : NoTemplateError: Could not find template: '#AuthProfileMenuTemplate'"]
     describe("Login Global Nav Item Tests",function(){
     // public (trigger modal)

     // registered (show profile menu)
     it("auth.btnAuthGlobalMenuItemClicked event with REGISTERED state should trigger loadRegionContentRequest with ProfileMenuView ", function (done) {
     var state = 'REGISTERED';

     EventBus.on('layout.loadRegionContentRequest', function (obj) {
     if (obj.view === 'ProfileMenuView') {
     done();
     }
     });
     EventBus.trigger('auth.loadAuthMenuRequest', state);
     });

     });
     */

    // ["ERROR:  Exception[auth][LoginFormView]: Cannot call method 'show' of undefined : TypeError: Cannot call method 'show' of undefined"]
    // above error logged by ep.client layout.loadRegionContentRequest event, at line 346
    // this bug might be caused because view is not required by this test
    /*
     it("auth.btnAuthGlobalMenuItemClicked event with PUBLIC state should trigger modal with LoginFormView ", function (done) {
     ep.io.localStore.setItem('oAuthRole','PUBLIC');
     //          ep.app.addRegions({
     //            appModalRegion:'[data-region="authMenuItemRegion"]'
     //          });
     EventBus.on('layout.loadRegionContentRequest', function (obj) {
     if (obj.view === 'LoginFormView') {
     done();
     }
     });
     EventBus.trigger('auth.btnAuthGlobalMenuItemClicked');
     });
     */

});