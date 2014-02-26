/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 * Functional Storefront Unit Test - Registration Module Views
 */

define(function (require) {
  'use strict';

  var ep = require('ep');
  var Backbone = require('backbone');
  var Marionette = require('marionette');

  var registrationView = require('registration.views');
  var registrationTemplate = require('text!modules/base/registration/base.registration.templates.html');

  var registrationErrorCollection = new Backbone.Collection([
    {"error": "Error message example 1"},
    {"error": "Error message example 2"}
  ]);

  describe('RegistrationErrorCollectionView', function () {
    before(function () {
      // append templates
      $("#Fixtures").append(registrationTemplate);

      this.collectionView = new registrationView.RegistrationErrorCollectionView({
        collection: registrationErrorCollection
      });

      this.collectionView.render();
    });

    after(function () {
      $("#Fixtures").empty();
      delete(this.collectionView);
    });

    describe('can render', function () {
      it('should be an instance of CollectionView object', function () {
        expect(this.collectionView).to.be.an.instanceOf(Marionette.CollectionView);
      });
      it('render() should return the CollectionView object', function () {
        expect(this.collectionView.render()).to.be.equal(this.collectionView);
      });
      it('2 list items with the appropriate content', function() {
        expect($('li',this.collectionView.$el).length).to.be.equal(2);
        expect($('li:eq(0)',this.collectionView.$el).text()).to.have.string("Error message example 1");
        expect($('li:eq(1)',this.collectionView.$el).text()).to.have.string("Error message example 2");
      });
    });
  });

});