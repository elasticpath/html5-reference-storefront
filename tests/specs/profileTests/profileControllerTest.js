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

  var controllerTestFactory = require('testfactory.controller');

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

    describe('Responds to event: profile.deleteAddressConfirm', function () {
      describe('When the user confirms the deletion request', function() {
        before(function () {
          sinon.stub(window, 'confirm', function () {
            return true;
          });

          sinon.stub(ep.ui, 'startActivityIndicator');
          sinon.spy(EventBus, 'trigger');

          EventBus.trigger('profile.deleteAddressConfirm', 'someHref');
        });

        after(function () {
          window.confirm.restore();
          ep.ui.startActivityIndicator.restore();
          EventBus.trigger.restore();
        });

        it('starts the activity indicator and triggers a delete address request', function () {
          expect(window.confirm).to.be.calledWithExactly("Do you really want to delete this address");
          expect(ep.ui.startActivityIndicator).to.be.called;
          expect(EventBus.trigger).to.be.calledWithExactly('profile.deleteAddressRequest', 'someHref');
        });
      });
      describe('When the user cancels the deletion request', function() {
        before(function () {
          sinon.stub(window, 'confirm', function () {
            return false;
          });

          sinon.stub(ep.ui, 'startActivityIndicator');
          sinon.spy(EventBus, 'trigger');

          EventBus.trigger('profile.deleteAddressConfirm', 'someHref');
        });

        after(function () {
          window.confirm.restore();
          ep.ui.startActivityIndicator.restore();
          EventBus.trigger.restore();
        });

        it('does not start the activity indicator or trigger a delete address request', function () {
          expect(ep.ui.startActivityIndicator).to.be.not.called;
          expect(EventBus.trigger).to.be.not.calledWithExactly('profile.deleteAddressRequest', 'someHref');
        });
      });
    });

    describe('Responds to event: profile.deleteAddressRequest', function () {
      before(function () {
        sinon.stub(ep.io, 'ajax');
        EventBus.trigger('profile.deleteAddressRequest', 'someHref');
        // get the arguments passed to ep.io.ajax
        this.ajaxArgs = ep.io.ajax.args[0][0];
      });

      after(function () {
        ep.io.ajax.restore();
      });

      describe('Should make a delete request to Cortex', function () {
        it('exactly once', function () {
          expect(ep.io.ajax).to.be.calledOnce;
        });
        it('with a valid request', function () {
          expect(this.ajaxArgs.type).to.be.string('DELETE');
          expect(this.ajaxArgs.url).to.be.equal('someHref');
        });
      });

      describe('and on success', function() {
        before(function() {
          sinon.stub(Backbone.Model.prototype, 'fetch');
          EventBus.trigger('profile.deleteAddressSuccess');
        });
        after(function() {
          Backbone.Model.prototype.fetch.restore();
        });
        // Backbone.Model.fetch triggers a Backbone.sync call
        it('triggers a Backbone.Model fetch', function() {
          expect(Backbone.Model.prototype.fetch).to.be.called;
        });
      });

      describe('and on failure', function() {
        before(function() {
          sinon.stub($.fn, 'toastmessage');
          sinon.stub(ep.ui, 'stopActivityIndicator');
          EventBus.trigger('profile.deleteAddressFailed');
        });
        after(function() {
          $.fn.toastmessage.restore();
          ep.ui.stopActivityIndicator.restore();
        });
        // Backbone.Model.fetch triggers a Backbone.sync call
        it('shows a toastmessage error and stops the activity indicator', function() {
          expect($.fn.toastmessage).to.be.called;
          expect(ep.ui.stopActivityIndicator).to.be.called;
        });
      });
    });

    describe('EditProfileAddressView', function() {
      describe("Given an address model href", function() {
        before(function (done) {
          // Append templates to the DOM
          $("#Fixtures").append(profileTemplate);

          sinon.stub(Mediator, 'fire');
          sinon.spy(ep.logger, 'error');

          var fakeGetLink = "/integrator/orders/fakeUrl";
          var fakeAddressResponse = {
            "country-name": "CA",
            "locality": "Vancouver",
            "postal-code": "V8C1N1",
            "region": "BC",
            "street-address": "5833 Movaat St."
          };

          // Create a sinon fakeServer object
          this.server = controllerTestFactory.getFakeServer('', fakeAddressResponse, fakeGetLink);

          profileController.EditProfileAddressView(fakeGetLink);

          // Short delay to allow the fake AJAX request to complete
          setTimeout(done, 200);
        });

        after(function() {
          $("#Fixtures").empty();
          ep.io.localStore.removeItem('oAuthToken');

          this.server.restore();

          Mediator.fire.restore();
          ep.logger.error.restore();
        });

        it('fires the mediator.loadEditAddressViewRequest event', function() {
          expect(Mediator.fire).to.be.calledWith('mediator.loadEditAddressViewRequest');
          expect(ep.logger.error).to.not.be.called;
        });
      });
    });

  });

});