/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 * Functional Storefront Unit Test - Address Component
 */
define(function(require) {
  'use strict';

  var Backbone = require('backbone');

  var controller = require('address');
  var view = require('address.views');
  var template = require('text!modules/base/components/address/base.component.address.template.html');

  describe('DefaultEditAddressView', function () {
    before(function (done) {
      // Append templates to the DOM
      $("#Fixtures").append(template);
      $("#Fixtures").append('<div id="testingRegion"></div>'); // append an region to render tested view into

      sinon.stub(Backbone.Model.prototype, 'fetch');
      sinon.stub(Backbone.Collection.prototype, 'fetch');

      var fakeGetLink = "/integrator/address/fakeUrl";
      this.view = controller.DefaultEditAddressView(fakeGetLink);

      // Short delay to allow the fake AJAX request to complete
      setTimeout(done, 200);
    });

    after(function () {
      $("#Fixtures").empty();
      Backbone.Model.prototype.fetch.restore();
      Backbone.Collection.prototype.fetch.restore();
    });

    it('returns an instance of DefaultEditAddressLayout', function () {
      expect(this.view).to.be.instanceOf(view.DefaultEditAddressLayout);
    });

    it('Model should have fetched info from server once', function () {
      expect(Backbone.Model.prototype.fetch).to.be.calledOnce;
    });
  });

});