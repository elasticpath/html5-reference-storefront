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
  var ep = require('ep');

  var profileViews = require('profile.views');
  var profileTemplate = require('text!modules/base/profile/base.profile.templates.html');

  describe('Profile Subscription Views', function () {
    before(function () {
      $("#Fixtures").append(profileTemplate);
    });

    after(function () {
      $("#Fixtures").empty();
    });

    describe('ProfileSubscriptionItemView', function () {
      before(function () {
        // mock the model
        this.model = new Backbone.Model({
          displayName: 'Subscription Plan',
          quantity: 3,
          nextBillingDate: 'December 25, 2013'
        });
        this.view = new profileViews.__test_only__.ProfileSubscriptionItemView({model: this.model});
        this.view.render();
      });

      after(function () {
        this.model.destroy();
      });

      it('should be an instance of Marionette ItemView object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.ItemView);
      });
      it('is referencing the template with correct ID', function () {
        it('is referencing the template with correct ID', function () {
          var templateId = '#SubscriptionItemTemplate';
          expect(this.view.getTemplate()).to.be.string(templateId);
          expect($(templateId)).to.exist;
        });
      });
      it('render() should return the view object', function () {
        expect(this.view.render()).to.be.equal(this.view);
      });
      it('view content is rendered with expected # of DOM elements', function () {
        expect(this.view.el.childElementCount).to.be.equal(3);
      });

      // test view's content rendered correctly
      it('1st element should render subscription display name', function () {
        expect(this.view.el.children[0].textContent).to.have.string(this.model.get('displayName'));
      });
      it('2nd element should render quantity', function () {
        expect(this.view.el.children[1].textContent).to.have.string(this.model.get('quantity'));
      });
      it('3rd element should render next-billing date', function () {
        expect(this.view.el.children[2].textContent).to.have.string(this.model.get('nextBillingDate'));
      });

    });

    describe('ProfileSubscriptionSummaryView', function () {
      before(function () {
        // mock the collection of model
        this.collection = new Backbone.Collection();
        this.collection.add(new Backbone.Model());
        this.view = new profileViews.ProfileSubscriptionSummaryView({collection: this.collection});
        this.view.render();
      });

      after(function () {
        this.collection.reset();
      });

      // test the view itself rendered
      it('should be an instance of Marionette CompositeView object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.CompositeView);
      });
      it('is referencing the template with correct ID', function () {
        var templateId = '#ProfileSubscriptionSummaryTemplate';
        expect(this.view.getTemplate()).to.be.string(templateId);
        expect($(templateId)).to.exist;
      });
      it('render() should return the view object', function () {
        expect(this.view.render()).to.be.equal(this.view);
      });

      // test the view's content rendered
      it('view content is rendered', function () {
        expect(this.view.el.childElementCount).to.be.above(0);  // not very accurate
      });
      it('renders $itemViewContainer', function () {
        expect(this.view.$itemViewContainer.length).to.be.equal(1);
      });
      it('renders 2 child itemViews', function () {
        expect(this.view.$itemViewContainer.children().length).to.be.equal(1);
      });
    });
  });

});