/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 * Functional Storefront Unit Test - Profile Views
 */
define(function (require) {
  var Backbone = require('backbone');
  var EventBus = require('eventbus');
  var EventTestFactory = require('testfactory.event');
  var EventTestHelpers = require('testhelpers.event');
  var ep = require('ep');

  var profileViews = require('profile.views');
  var profileTemplate = require('text!modules/base/profile/base.profile.templates.html');

  describe('Profile Summary Views', function () {
    var StandardProfileInfoModel = Backbone.Model.extend({
      defaults: {
        givenName: 'ben',
        familyName: 'boxer',
        actionLink: 'fakeActionLink'
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
        this.view = new profileViews.ProfileSummaryFormView({model: this.model});
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
      it('renders user given name input field with data', function () {
        expect(this.view.$el.find('input[id="GivenName"]').val()).to.have.string(this.model.get('givenName'));
      });
      it('renders user family name input field with data', function () {
        expect(this.view.$el.find('input[id="FamilyName"]').val()).to.have.string(this.model.get('familyName'));
      });
      it('renders a feedback region ', function () {
        expect(this.view.$el.find('[data-region="componentPaymentFeedbackRegion"]')).to.have.length(1);
      });
      it('renders a save button ', function () {
        expect(this.view.$el.find('button[data-el-label="profile.summary.saveBtn"]')).to.have.length(1);
      });
      it('renders a cancel button ', function () {
        expect(this.view.$el.find('button[data-el-label="profile.summary.cancelBtn"]')).to.have.length(1);
      });

      it('defines ui component: saveBtn ', function () {
        expect(this.view.ui.saveBtn).to.be.ok;
      });
      it('defines ui component: cancelBtn ', function () {
        expect(this.view.ui.cancelBtn).to.be.ok;
      });
      it('defines ui component: feedbackRegion ', function () {
        expect(this.view.ui.feedbackRegion).to.be.ok;
      });

      describe('save button clicked',
        EventTestFactory.simpleBtnClickTest('profile.summarySaveBtnClicked', '[data-el-label="profile.summary.saveBtn"]'));

      describe('cancel button clicked',
        EventTestFactory.simpleBtnClickTest('profile.summaryCancelBtnClicked', '[data-el-label="profile.summary.cancelBtn"]'));
    });

  });

});