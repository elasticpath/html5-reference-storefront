/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 * Functional Storefront Unit Test - Profile Views
 */
define(function (require) {
  var Backbone = require('backbone');
  var EventTestFactory = require('EventTestFactory');

  describe('Profile Module: Views', function () {
    var profileViews = require('profile.views');
    var profileTemplate = require('text!modules/base/profile/base.profile.templates.html');

    before(function () {
      $("#Fixtures").append(profileTemplate);
    });

    after(function () {
      $("#Fixtures").empty();
    });

    describe('DefaultLayout', function () {
      before(function () {
        this.view = new profileViews.DefaultLayout();
        this.view.render();
      });

      it('should be an instance of Marionette Layout object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.Layout);
      });
      it('render() should return the view object', function () {
        expect(this.view.render()).to.be.equal(this.view);
      });
      it('view contents are rendered', function () {
        expect(this.view.el.childElementCount).to.be.above(0);
      });

      describe('regions', function () {
        it('should have a profileTitleRegion region', function () {
          expect(this.view.profileTitleRegion).to.exist;
          expect(this.view.$el.find('[data-region="profileTitleRegion"]')).to.be.length(1);
        });
        it('should have a profileSummaryRegion region', function () {
          expect(this.view.profileSummaryRegion).to.exist;
          expect(this.view.$el.find('[data-region="profileSummaryRegion"]')).to.be.length(1);
        });
        it('should have a profileSubscriptionSummaryRegion region', function () {
          expect(this.view.profileSubscriptionSummaryRegion).to.exist;
          expect(this.view.$el.find('[data-region="profileSubscriptionSummaryRegion"]')).to.be.length(1);
        });
        it('should have a address region', function () {
          expect(this.view.profileAddressesRegion).to.exist;
          expect(this.view.$el.find('[data-region="profileAddressesRegion"]')).to.be.length(1);
        });
        it('should have a profilePaymentMethodsRegion region', function () {
          expect(this.view.profilePaymentMethodsRegion).to.exist;
          expect(this.view.$el.find('[data-region="profilePaymentMethodsRegion"]')).to.be.length(1);
        });
      });
    });

    describe('ProfileTitleView', function () {
      before(function () {
        this.view = new profileViews.ProfileTitleView();
        this.view.render();
      });

      it('should be an instance of Marionette ItemView object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.ItemView);
      });
      it('render() should return the view object', function () {
        expect(this.view.render()).to.be.equal(this.view);
      });
      /*it('view content is rendered', function() {
       // don't know how to test it yet
       });*/
    });

    describe('ProfileSummaryView', function () {
      before(function () {
        // mock the model
        this.model = new Backbone.Model({
          givenName: 'ben',
          familyName: 'boxer'
        });
        this.view = new profileViews.ProfileSummaryView({model: this.model});
        this.view.render();
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

    describe('Profile Subscription Views', function () {

      describe('ProfileSubscriptionItemView', function () {
        before(function () {
          // mock the model
          this.model = new Backbone.Model({
            displayName: 'Subscription Plan',
            quantity: 3,
            nextBillingDate: 'December 25, 2013'
          });
          this.view = new profileViews.testVariables.ProfileSubscriptionItemView({model: this.model});
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

    describe('Profile Addresses Views', function () {

      describe('ProfileAddressItemView', function () {
        before(function () {
          // mock the model
          this.model = new Backbone.Model();
          // setup the view
          this.view = new profileViews.testVariables.ProfileAddressItemView({model: new Backbone.Model()});
          this.view.render();
        });

        after(function () {
          this.model.destroy();
        });

        it('should be an instance of Marionette Layout object', function () {
          expect(this.view).to.be.an.instanceOf(Marionette.Layout);
        });
        it('is referencing the template with correct ID', function () {
          var templateId = '#DefaultProfileAddressLayoutTemplate';
          expect(this.view.getTemplate()).to.be.string(templateId);
          expect($(templateId)).to.exist;
        });
        it('render() should return the view object', function () {
          expect(this.view.render()).to.be.equal(this.view);
        });
        it('view content is rendered with DOM elements', function () {
          expect(this.view.el.childElementCount).to.be.above(0);
        });
        it('should have a profileAddressComponentRegion region', function () {
          expect(this.view.profileAddressComponentRegion).to.exist;
          expect(this.view.$el.find('[data-region="profileAddressComponentRegion"]')).to.be.length(1);
        });

      });

      describe('ProfileAddressesView', function () {
        before(function () {
          // mock the collection, and adds multiple model into collection
          this.collection = new Backbone.Collection();
          this.collection.add(new Backbone.Model());
          this.collection.add(new Backbone.Model());

          // setup the view
          this.view = new profileViews.ProfileAddressesView({collection: this.collection});
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
            var templateId = '#DefaultProfileAddressesTemplate';
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

        describe('add new address button clicked',
          EventTestFactory.simpleBtnClickTest('profile.addNewAddressBtnClicked', '[data-el-label="profile.addNewAddressBtn"]'));
      });

    });

    describe('Profile Payment Methods Views', function () {

      describe('ProfilePaymentMethodItemView', function () {
        before(function () {
          // mock the model
          this.model = new Backbone.Model();
          // setup the view
          this.view = new profileViews.testVariables.ProfilePaymentMethodItemView({model: new Backbone.Model()});
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
});