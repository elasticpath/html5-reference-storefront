/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 * Functional Storefront Unit Test - Address Component
 */
define(function(require) {
  var ep = require('ep');
  var Backbone = require('backbone');
  var Mediator = require('mediator');

  var controller = require('address');
  var view = require('address.views');
  var template = require('text!modules/base/components/address/base.component.address.template.html');

  describe('DefaultCreateAddressView', function () {
    describe('when a user is logged in', function () {
      before(function () {
        $("#Fixtures").append(template); // append templates

        sinon.stub(ep.app, 'isUserLoggedIn', function () {
          return true;
        });
        sinon.stub(Backbone.Model.prototype, 'fetch');
        sinon.stub(Backbone.Collection.prototype, 'fetch');

        this.controller = controller.DefaultCreateAddressView();
      });

      after(function () {
        $("#Fixtures").empty();
        ep.app.isUserLoggedIn.restore();
        Backbone.Collection.prototype.fetch.restore();
        Backbone.Model.prototype.fetch.restore();
      });

      it('returns an instance of DefaultCreateAddressLayout', function () {
        expect(this.controller).to.be.instanceOf(view.DefaultCreateAddressLayout);
      });
    });

    describe('when a user is not logged in', function () {
      before(function () {
        $("#Fixtures").append(template); // append templates

        sinon.stub(ep.app, 'isUserLoggedIn', function () {
          return false;
        });
        sinon.stub(Mediator, 'fire');

        this.controller = controller.DefaultCreateAddressView();
      });

      after(function () {
        $("#Fixtures").empty();
        ep.app.isUserLoggedIn.restore();
        Mediator.fire.restore();
      });

      it('triggers a request to load the login form', function () {
        expect(Mediator.fire).to.be.calledWith('mediator.loadRegionContent', 'loginModal');
      });
    });
  });

});