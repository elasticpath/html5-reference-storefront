/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * Functional Storefront Unit Test - Profile Views
 */
define(function (require) {
  var Backbone = require('backbone');
  var EventTestFactory = require('testfactory.event');
  var ep = require('ep');

  var views = require('profile.views');
  var template = require('text!modules/base/profile/base.profile.templates.html');

  describe('Profile Module: Profile Personal Info Views', function () {
    var StandardProfileInfoModel = Backbone.Model.extend({
      defaults: {
        givenName: 'ben',
        familyName: 'boxer',
        actionLink: 'fakeActionLink'
      }
    });

    before(function () {
      $("#Fixtures").append(template);
    });

    after(function () {
      $("#Fixtures").empty();
    });

    describe('ProfilePersonalInfoView', function () {
      before(function () {
        // mock the model
        this.model = new StandardProfileInfoModel();
        this.view = new views.ProfilePersonalInfoView({model: this.model});
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
        expect(this.view.$el.find('button[data-el-label="profile.editPersonalInfoBtn"]')).to.have.length(1);
      });
      it('defines ui component: editBtn ', function () {
        expect(this.view.ui.editBtn).to.be.ok;
      });

      describe('edit summary button clicked',
        EventTestFactory.simpleBtnClickTest('profile.editPersonalInfoBtnClicked', '[data-el-label="profile.editPersonalInfoBtn"]'));
    });

    describe('PersonalInfoFormView', function () {
      before(function () {
        // mock the model
        this.model = new StandardProfileInfoModel();
        this.view = new views.PersonalInfoFormView({model: this.model});
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
        expect(this.view.$el.find('[data-region="profileInfoFeedbackRegion"]')).to.have.length(1);
      });
      it('renders a save button ', function () {
        expect(this.view.$el.find('button[data-el-label="profile.personalInfo.saveBtn"]')).to.have.length(1);
      });
      it('renders a cancel button ', function () {
        expect(this.view.$el.find('button[data-el-label="profile.personalInfo.cancelBtn"]')).to.have.length(1);
      });

      it('defines ui component: saveBtn ', function () {
        expect(this.view.ui.saveBtn).to.be.ok;
      });
      it('defines ui component: cancelBtn ', function () {
        expect(this.view.ui.cancelBtn).to.be.ok;
      });

      describe('save button clicked',
        EventTestFactory.simpleBtnClickTest('profile.personalInfoFormSaveBtnClicked', '[data-el-label="profile.personalInfo.saveBtn"]'));

      describe('cancel button clicked',
        EventTestFactory.simpleBtnClickTest('profile.personalInfoFormCancelBtnClicked', '[data-el-label="profile.personalInfo.cancelBtn"]'));
    });

    describe("PersonalInfoFormErrorCollectionView", function() {
      before(function() {
        this.view = new views.PersonalInfoFormErrorCollectionView();
        this.view.render();
      });

      after(function() {
        delete(this.view);
      });

      it("should be an instance of Marionette CollectionView", function() {
        expect(this.view).to.be.an.instanceOf(Marionette.CollectionView);
      });

      it("defines has a childView", function() {
        expect(this.view.itemView).to.be.ok;
      });
      it("renders as UL element", function() {
        expect(this.view.tagName).to.be.equal("ul");
      });
  });

    describe("ErrorItemView", function() {
      before(function() {
        this.view = new views.__test_only__.ErrorItemView();
        this.view.render();
      });

      after(function() {
        delete(this.view);
      });

      it("should be an instance of Marionette ItemView", function() {
        expect(this.view).to.be.an.instanceOf(Marionette.ItemView);
      });

      it("renders as LI element", function() {
        expect(this.view.tagName).to.be.equal("li");
      });
    });
  });

});