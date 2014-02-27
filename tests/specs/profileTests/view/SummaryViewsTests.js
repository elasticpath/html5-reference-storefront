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

  describe('Profile Summary Views', function () {
    var StandardProfileInfoModel = Backbone.Model.extend({
      defaults: {
        givenName: 'ben',
        familyName: 'boxer'
      }
    });

    before(function () {
      $("#Fixtures").append(profileTemplate);
    });

    after(function () {
      $("#Fixtures").empty();
    });

    describe('ProfileSummaryView', function () {
      before(function () {
        // mock the model
        this.model = new StandardProfileInfoModel();
        this.view = new profileViews.ProfileSummaryView({model: this.model});
        this.view.render();
      });

      after(function () {
        delete(this.model);
        delete(this.view);
      });

      it('should be an instance of Marionette ItemView object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.ItemView);
      });
      it('render() should return the view object', function () {
        expect(this.view.render()).to.be.equal(this.view);
      });

      // test view's content rendered correctly
      it('renders user given name ', function () {
        expect(this.view.$el.text()).to.have.string(this.model.get('givenName'));
      });
      it('renders user family name ', function () {
        expect(this.view.$el.text()).to.have.string(this.model.get('familyName'));
      });
      it('renders a profile information edit button ', function () {
        expect(this.view.$el.find('button[data-el-label="profile.editSummaryBtn"]')).to.have.length(1);
      });
      it('defines ui component: editBtn ', function () {
        expect(this.view.ui.editBtn).to.be.ok;
      });

      describe('edit summary button clicked',
        EventTestFactory.simpleBtnClickTest('profile.editSummaryBtnClicked', '[data-el-label="profile.editSummaryBtn"]'));
    });

    describe('ProfileSummaryFormView', function () {
      before(function () {
        // mock the model
        this.model = new StandardProfileInfoModel();
        // CheckIn
        this.view = new profileViews.ProfileSummaryView({model: this.model});
        this.view.render();
      });

      after(function () {
        delete(this.model);
        delete(this.view);
      });

      it('should be an instance of Marionette ItemView object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.ItemView);
      });
      it('render() should return the view object', function () {
        expect(this.view.render()).to.be.equal(this.view);
      });


    });

  });

});