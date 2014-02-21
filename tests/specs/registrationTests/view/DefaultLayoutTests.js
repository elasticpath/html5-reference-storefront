/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 * Functional Storefront Unit Test - Registration Module Views
 */

define(function (require) {
  'use strict';

  var ep = require('ep');
  var Marionette = require('marionette');

  var registrationView = require('registration.views');
  var registrationTemplate = require('text!modules/base/registration/base.registration.templates.html');

  describe('Registration Module: Views: DefaultLayout', function () {
    before(function () {
      $("#Fixtures").append(registrationTemplate);

      this.view = new registrationView.DefaultLayout();
      this.view.render();
    });

    after(function () {
      $("#Fixtures").empty();
      delete(this.view);
    });

    describe('should have valid regions', function () {
      it('registrationFeedbackMsgRegion', function () {
        expect(this.view.registrationFeedbackMsgRegion).to.exist;
        expect(this.view.$el.find('[data-region="registrationFeedbackMsgRegion"]')).to.be.length(1);
      });
      it('registrationFormRegion', function () {
        expect(this.view.registrationFormRegion).to.exist;
        expect(this.view.$el.find('[data-region="registrationFormRegion"]')).to.be.length(1);
      });
    });

    describe('renders', function () {
      it('as an instance of Layout object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.Layout);
      });
      it('as div element', function () {
        expect(this.view.el.nodeName).to.equal('DIV');
      });
      it('some child DOM elements (view content rendered)', function () {
        expect(this.view.el.childElementCount).to.be.above(0);
      });
    });
  });

});