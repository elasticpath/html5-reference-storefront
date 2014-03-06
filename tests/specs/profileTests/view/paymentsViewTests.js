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

  describe('Profile Payment Methods Views', function () {
    before(function () {
      $("#Fixtures").append(profileTemplate);
    });

    after(function () {
      $("#Fixtures").empty();
    });

    describe('ProfilePaymentMethodItemView', function () {
      before(function () {
        // mock the model
        this.model = new Backbone.Model();
        // setup the view
        this.view = new profileViews.__test_only__.ProfilePaymentMethodItemView({model: new Backbone.Model()});
        this.view.render();
      });

      after(function () {
        this.model.destroy();
      });

      it('should be an instance of Marionette Layout object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.Layout);
      });
      it('is referencing the template with correct ID', function () {
        var templateId = '#DefaultProfilePaymentMethodLayoutTemplate';
        expect(this.view.getTemplate()).to.be.equal(templateId);
        expect($(templateId)).to.exist;
      });
      it('render() should return the view object', function () {
        expect(this.view.render()).to.be.equal(this.view);
      });
      it('view content is rendered with DOM elements', function () {
        expect(this.view.el.childElementCount).to.be.above(0);
      });
      it('should have a profilePaymentMethodComponentRegion region', function () {
        expect(this.view.profilePaymentMethodComponentRegion).to.exist;
        expect(this.view.$el.find('[data-region="profilePaymentMethodComponentRegion"]')).to.be.length(1);
      });
    });

    describe('ProfilePaymentMethodsView', function () {
      before(function () {
        // mock the collection, and adds multiple model into collection
        this.collection = new Backbone.Collection();
        this.collection.add(new Backbone.Model());
        this.collection.add(new Backbone.Model());

        // setup the view
        this.view = new profileViews.ProfilePaymentMethodsView({collection: this.collection});
        this.view.render();
      });

      after(function () {
        this.collection.reset();
      });

      describe('renders correctly', function () {
        // test the view itself rendered
        it('should be an instance of Marionette CompositeView object', function () {
          expect(this.view).to.be.an.instanceOf(Marionette.CompositeView);
        });
        it('is referencing the template with correct ID', function () {
          var templateId = '#DefaultProfilePaymentsTemplate';
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
          expect(this.view.$itemViewContainer.children().length).to.be.equal(2);
        });
      });
    });

  });
});