/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.
 *
 * Functional Storefront Unit Test - Profile Controller
 */
define(function (require) {
  var Backbone = require('backbone');
  var EventBus = require('eventbus');
  var Mediator = require('mediator');
  var ep = require('ep');

  describe('Profile Module: Controller', function () {
    var profileController = require('profile');
    var profileTemplate = require('text!modules/base/profile/base.profile.templates.html');

    describe("DefaultView", function () {
      before(function () {
        sinon.stub(Backbone, 'sync');

        $("#Fixtures").append(profileTemplate);
      });

      after(function () {
        $("#Fixtures").empty();
        Backbone.sync.restore();
      });

      describe('called when user logged in', function () {
        before(function () {
          sinon.stub(ep.app, 'isUserLoggedIn', function () {
            return true;
          });
          this.viewLayout = new profileController.DefaultView();
          this.viewLayout.render();
        });

        after(function () {
          ep.app.isUserLoggedIn.restore();
        });

        it('should be an instance of Marionette Layout object', function () {
          expect(this.viewLayout).to.be.an.instanceOf(Marionette.Layout);
        });
        it('view\'s DOM is rendered with 6 children (view content rendered)', function () {
          expect(this.viewLayout.el.childElementCount).to.be.equal(6);
        });
        it('Model should have fetched info from server once', function () {
          expect(Backbone.sync).to.be.calledOnce;
        });
      });
      describe('called when user not logged in', function () {
        before(function () {
          sinon.spy(EventBus, 'trigger');
          sinon.stub(ep.app, 'isUserLoggedIn', function () {
            return false;
          });

          EventBus.unbind('layout.loadRegionContentRequest');  // isolate event
          this.viewLayout = new profileController.DefaultView();
        });

        after(function () {
          ep.app.isUserLoggedIn.restore();
          EventBus.trigger.restore();
        });

        it('DefaultView should exist', function () {
          expect(this.viewLayout).to.exist;
        });
        it('triggers layout.loadRegionContentRequest', function () {
          expect(EventBus.trigger).to.be.calledWith('layout.loadRegionContentRequest');
        });
        it('triggered with 2 arguments', function () {
          var module = { module: "auth", region: "appModalRegion", view: "LoginFormView" };
          expect(EventBus.trigger).to.be.calledWithExactly('layout.loadRegionContentRequest', module);
        });
      });
    });

    describe('Responds to event: profile.addNewAddressBtnClicked', function () {
      before(function () {
        sinon.stub(Mediator, 'fire');
        EventBus.trigger('profile.addNewAddressBtnClicked');
      });

      after(function () {
        Mediator.fire.restore();
      });

      it('registers correct event listener', function () {
        expect(EventBus._events['profile.addNewAddressBtnClicked']).to.have.length(1);
      });
      it('and call correct mediator strategy to add new address', function () {
        expect(Mediator.fire).to.be.calledWithExactly('mediator.addNewAddressRequest', 'profile');
      });
    });
  });

});