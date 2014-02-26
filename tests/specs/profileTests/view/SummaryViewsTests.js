/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 * Functional Storefront Unit Test - Profile Views
 */
define(function (require) {
  var Backbone = require('backbone');
  var EventTestFactory = require('testfactory.event');
  var ep = require('ep');

  var profileViews = require('profile.views');
  var profileTemplate = require('text!modules/base/profile/base.profile.templates.html');

  describe('ProfileSummaryView', function () {
    before(function () {
      $("#Fixtures").append(profileTemplate);

      // mock the model
      this.model = new Backbone.Model({
        givenName: 'ben',
        familyName: 'boxer'
      });
      this.view = new profileViews.ProfileSummaryView({model: this.model});
      this.view.render();
    });

    after(function () {
      $("#Fixtures").empty();
    });

    it('should be an instance of Marionette ItemView object', function () {
      expect(this.view).to.be.an.instanceOf(Marionette.ItemView);
    });
    it('render() should return the view object', function () {
      expect(this.view.render()).to.be.equal(this.view);
    });
    it('view content is rendered', function () {
      expect(this.view.el.childElementCount).to.be.above(0);
    });

    // test view's content rendered correctly
    it('renders user given name ', function () {
      expect(this.view.$el.text()).to.have.string('ben');
    });
    it('renders user family name ', function () {
      expect(this.view.$el.text()).to.have.string('boxer');
    });
  });
});