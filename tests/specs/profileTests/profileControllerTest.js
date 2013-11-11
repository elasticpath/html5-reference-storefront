/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.
 *
 * Functional Storefront Unit Test - Profile Controller
 */
define(function (require) {
  var Backbone = require('backbone'),
      EventBus = require('eventbus'),
      EventTestHelpers = require('EventTestHelpers'),
      ep = require('ep');

  describe('Profile Module: Controller', function () {
    var profileController = require('profile');

    describe("DefaultView", function () {
      var cartTemplate = require('text!modules/base/profile/base.profile.templates.html');

      before(function () {
        sinon.stub(Backbone, 'sync');

        $("#Fixtures").append(cartTemplate);
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

        it('DefaultView should exist', function () {
          expect(this.viewLayout).to.exist;
        });
        it('should be an instance of Marionette Layout object', function () {
          expect(this.viewLayout).to.be.an.instanceOf(Marionette.Layout);
        });

        it('render() should return the view object', function () {
          expect(this.viewLayout.render()).to.be.equal(this.viewLayout);
        });
        it('view\'s DOM is rendered with 5 children (view content rendered)', function () {
          expect(this.viewLayout.el.childElementCount).to.be.equal(5);
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

    describe('Responds to event: profile.addNewAddressBtnClicked', function() {
      before(function() {
        sinon.spy(EventBus, 'trigger');
        EventTestHelpers.unbind('layout.loadRegionContentRequest');
        EventBus.trigger('profile.addNewAddressBtnClicked');
      });

      after(function() {
        EventBus.trigger.restore();
        EventTestHelpers.reset();
      });

      it('registers correct event listener', function() {
        expect(EventBus._events['profile.addNewAddressBtnClicked']).to.have.length(1);
      });
      it('and triggers event to load address form modal', function() {
        var addressFormModal = {
          region: 'appModalRegion',
          module: 'address',
          view: 'DefaultCreateAddressView'
        };
        expect(EventBus.trigger).to.be.calledWithExactly('layout.loadRegionContentRequest', addressFormModal);
      });
    });
  });

});