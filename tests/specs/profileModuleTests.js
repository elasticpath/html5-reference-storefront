/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.

 * User: sbrookes
 * Date: 02/10/13
 * Time: 1:28 PM
 *
 */
define(function (require) {
  var Backbone = require('backbone');

  describe('UI Storefront Profile Module  ', function () {

    /*
     * Profile Controller
     */
    describe('Profile Controller',function(){
      var profileController = require('profile');
      var EventBus = require('eventbus');

      describe("DefaultView", function () {
        var cartTemplate = require('text!modules/base/profile/base.profile.templates.html');
        var ep = require('ep');

        before(function () {
          sinon.stub(Backbone, 'sync');

          $("#Fixtures").append(cartTemplate);
        });

        after(function() {
          $("#Fixtures").empty();
          Backbone.sync.restore();
        });

        describe('called when user logged in', function() {
          before(function() {
            sinon.stub(ep.app, 'isUserLoggedIn', function() {return true;});
            this.viewLayout = new profileController.DefaultView();
            this.viewLayout.render();
          });

          after(function() {
            ep.app.isUserLoggedIn.restore();
          });

          it('DefaultView should exist', function () {
            expect(this.viewLayout).to.exist;
          });
          it('should be an instance of Marionette Layout object', function () {
            expect(this.viewLayout).to.be.an.instanceOf(Marionette.Layout);
          });

          it('render() should return the view object', function () {
            expect(this.viewLayout.render()).to.be.equal(this.viewLayout);
          });
          it('view\'s DOM is rendered with 5 children (view content rendered)', function() {
            expect(this.viewLayout.el.childElementCount).to.be.equal(5);
          });
          it('Model should have fetched info from server once', function () {
            expect(Backbone.sync).to.be.calledOnce;
          });
        });
        describe('called when user not logged in', function() {
          before(function() {
            sinon.spy(EventBus, 'trigger');
            sinon.stub(ep.app, 'isUserLoggedIn', function() {return false;});

            EventBus.unbind('layout.loadRegionContentRequest');  // isolate event
            this.viewLayout = new profileController.DefaultView();
          });

          after(function() {
            ep.app.isUserLoggedIn.restore();
            EventBus.trigger.restore();
          });

          it('DefaultView should exist', function () {
            expect(this.viewLayout).to.exist;
          });
          it('triggers layout.loadRegionContentRequest', function () {
            expect(EventBus.trigger).to.be.calledWith('layout.loadRegionContentRequest');
          });
          it('triggered with 2 arguments', function () {
            var module = { module: "auth", region: "appModalRegion", view: "LoginFormView" };
            expect(EventBus.trigger).to.be.calledWithExactly('layout.loadRegionContentRequest', module);
          });
        });
      });
    });

    /*
     Profile Views
     */
    describe('Profile Views', function () {
      var profileViews = require('profile.views');
      var profileTemplate = require('text!modules/base/profile/base.profile.templates.html');

      before(function() {
        $("#Fixtures").append(profileTemplate);
      });

      after(function() {
        $("#Fixtures").empty();
      });

      describe('All views should exist', function() {
        it('DefaultLayout should exist', function () {
          expect(profileViews.DefaultLayout).to.exist;
        });
        it('ProfileTitleView should exist', function () {
          expect(profileViews.ProfileTitleView).to.exist;
        });
        it('ProfileSummaryView should exist', function () {
          expect(profileViews.ProfileSummaryView).to.exist;
        });
        it('ProfileSubscriptionSummaryView should exist', function () {
          expect(profileViews.ProfileSubscriptionSummaryView).to.exist;
        });
        it('PaymentMethodsView should exist', function () {
          expect(profileViews.PaymentMethodsView).to.exist;
        });
        it('An addresses view should exist', function () {
          expect(profileViews.ProfileAddressesView).to.exist;
        });
      });

      describe('DefaultLayout', function () {
        before(function() {
          this.view = new profileViews.DefaultLayout();
          this.view.render();
        });

        it('should be an instance of Marionette Layout object', function () {
          expect(this.view).to.be.an.instanceOf(Marionette.Layout);
        });
        it('render() should return the view object', function () {
          expect(this.view.render()).to.be.equal(this.view);
        });
        it('view contents are rendered', function() {
          expect(this.view.el.childElementCount).to.be.above(0);
        });

        describe('regions', function() {
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

      describe('ProfileTitleView', function() {
        before(function() {
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

      describe('ProfileSummaryView', function() {
        before(function() {
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
        it('view content is rendered', function() {
          expect(this.view.el.childElementCount).to.be.above(0);
        });

        // test view's content rendered correctly
        it('renders user given name ', function() {
          expect(this.view.$el.text()).to.have.string('ben');
        });
        it('renders user family name ', function() {
          expect(this.view.$el.text()).to.have.string('boxer');
        });
      });

      describe('Profile Subscription Views', function() {

        describe('ProfileSubscriptionItemView', function() {
          before(function() {
            // mock the model
            this.model = new Backbone.Model({
              displayName: 'Subscription Plan',
              quantity: 3,
              nextBillingDate: 'December 25, 2013'
            });
            this.view = new profileViews.ProfileSubscriptionItemView({model: this.model});
            this.view.render();
          });

          after(function() {
            this.model.destroy();
          });

          it('should be an instance of Marionette ItemView object', function () {
            expect(this.view).to.be.an.instanceOf(Marionette.ItemView);
          });
          it('is referencing the template with correct ID', function() {
            it('is referencing the template with correct ID', function() {
              var templateId = '#SubscriptionItemTemplate';
              expect(this.view.getTemplate()).to.be.string(templateId);
              expect($(templateId)).to.exist;
            });
          });
          it('render() should return the view object', function () {
            expect(this.view.render()).to.be.equal(this.view);
          });
          it('view content is rendered with expected # of DOM elements', function() {
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

        describe('ProfileSubscriptionSummaryView', function() {
          before(function() {
            // mock the collection of model
            this.collection = new Backbone.Collection();
            this.collection.add(new Backbone.Model());
            this.view = new profileViews.ProfileSubscriptionSummaryView({collection: this.collection});
            this.view.render();
          });

          after(function() {
            this.collection.reset();
          });

          // test the view itself rendered
          it('should be an instance of Marionette CompositeView object', function () {
            expect(this.view).to.be.an.instanceOf(Marionette.CompositeView);
          });
          it('is referencing the template with correct ID', function() {
            var templateId = '#ProfileSubscriptionSummaryTemplate';
            expect(this.view.getTemplate()).to.be.string(templateId);
            expect($(templateId)).to.exist;
          });
          it('render() should return the view object', function () {
            expect(this.view.render()).to.be.equal(this.view);
          });

          // test the view's content rendered
          it('view content is rendered', function() {
            expect(this.view.el.childElementCount).to.be.above(0);  // not very accurate
          });
          it('renders $itemViewContainer', function() {
            expect(this.view.$itemViewContainer.length).to.be.equal(1);
          });
          it('renders 2 child itemViews', function() {
            expect(this.view.$itemViewContainer.children().length).to.be.equal(1);
          });
        });
      });

      describe('Profile Addresses Views', function() {

        describe('ProfileAddressItemView', function () {
          before(function() {
            // mock the model
            this.model = new Backbone.Model();
            // setup the view
            this.view = new profileViews.ProfileAddressItemView({model: new Backbone.Model()});
            this.view.render();
          });

          after(function() {
            this.model.destroy();
          });

          it('should be an instance of Marionette Layout object', function () {
            expect(this.view).to.be.an.instanceOf(Marionette.Layout);
          });
          it('is referencing the template with correct ID', function() {
            var templateId = '#DefaultProfileAddressLayoutTemplate';
            expect(this.view.getTemplate()).to.be.string(templateId);
            expect($(templateId)).to.exist;
          });
          it('render() should return the view object', function () {
            expect(this.view.render()).to.be.equal(this.view);
          });
          it('view content is rendered with DOM elements', function() {
            expect(this.view.el.childElementCount).to.be.above(0);
          });
          it('should have a profileAddressComponentRegion region', function () {
            expect(this.view.profileAddressComponentRegion).to.exist;
            expect(this.view.$el.find('[data-region="profileAddressComponentRegion"]')).to.be.length(1);
          });

        });

        describe('ProfileAddressesView', function () {
          before(function() {
            // mock the collection, and adds multiple model into collection
            this.collection = new Backbone.Collection();
            this.collection.add(new Backbone.Model());
            this.collection.add(new Backbone.Model());

            // setup the view
            this.view = new profileViews.ProfileAddressesView({collection: this.collection});
            this.view.render();
          });

          after(function() {
            this.collection.reset();
          });

          // test the view itself rendered
          it('should be an instance of Marionette CompositeView object', function () {
            expect(this.view).to.be.an.instanceOf(Marionette.CompositeView);
          });
          it('is referencing the template with correct ID', function() {
            var templateId = '#DefaultProfileAddressesTemplate';
            expect(this.view.getTemplate()).to.be.string(templateId);
            expect($(templateId)).to.exist;
          });
          it('render() should return the view object', function () {
            expect(this.view.render()).to.be.equal(this.view);
          });

          // test the view's content rendered
          it('view content is rendered', function() {
            expect(this.view.el.childElementCount).to.be.above(0);  // not very accurate
          });
          it('renders $itemViewContainer', function() {
            expect(this.view.$itemViewContainer.length).to.be.equal(1);
          });
          it('renders 2 child itemViews', function() {
            expect(this.view.$itemViewContainer.children().length).to.be.equal(2);
          });
        });

      });
    });




    /*
     * Profile Models
     */
    describe('Profile Models', function () {
      var profileModels = require('profile.models');
      it("should exist", function () {
        expect(profileModels.ProfileModel).to.exist;
      });

      describe('Model should parse data correctly', function () {
        var profileModel = new profileModels.ProfileModel();

        describe('profile should parse basic information correctly', function () {
          before(function() {
            var rawData = {
              "family-name": "boxer",
              "given-name": "ben"
            };

            this.model = profileModel.parse(rawData);
          });

          it("must have a family name", function () {
            expect(this.model.familyName).to.be.string('boxer');
          });
          it("must have a given name", function () {
            expect(this.model.givenName).to.be.string('ben');
          });
        });

        describe('profile should parse subscriptions correctly', function () {
          var rawData = {
            "_subscriptions": [
              {
                "_element": [
                  {
                    "display-name": "Subscription Plan",
                    "next-billing-date": {
                      "display-value": "December 18, 2013",
                      "value": 1387324800000
                    },
                    "quantity": 1,
                    "status": "ACTIVE"
                  }
                ]
              }
            ]
          };
          var parsedModel = profileModel.parse(rawData);

          it("should have a subscription array", function () {
            expect(parsedModel.subscriptions).to.be.an.instanceOf(Array);
          });
          it("this model should have 1 subscription", function () {
            expect(parsedModel.subscriptions).to.have.length(1);
          });

          var subscription = parsedModel.subscriptions[0];
          it("the subscription should have display name", function () {
            expect(subscription.displayName).to.be.string('Subscription Plan');
          });
          it("the subscription should have quantity", function () {
            expect(subscription.quantity).to.equal(1);
          });
          it("the subscription should have next billing date", function () {
            expect(subscription.nextBillingDate).to.be.string('December 18, 2013');
          });
          it("the subscription should have status", function () {
            expect(subscription.status).to.be.string('ACTIVE');
          });

        });

        describe('profile could have no subscription', function() {
          var rawData = { };
          var parsedModel = profileModel.parse(rawData);

          it("model should still have an subscription array", function () {
            expect(parsedModel.subscriptions).to.be.an.instanceOf(Array);
          });
          it("model should have 0 subscription", function () {
            expect(parsedModel.subscriptions).to.have.length(0);
          });
        });

        describe('profile should parse addresses correctly', function () {
          var rawData = {
            "_addresses": [
              {
                "_element": [
                  {
                    "address": {
                      "country-name": "CA",
                      "extended-address": "Siffon Ville",
                      "locality": "St. Helens",
                      "postal-code": "v8v8v8",
                      "region": "MB",
                      "street-address": "1234 HappyVille Road"
                    },
                    "name": {
                      "family-name": "boxer",
                      "given-name": "ben"
                    }
                  }
                ]
              }
            ]
          };

          describe('addresses', function() {
            before(function() {
              this.model = profileModel.parse(rawData);
            });

            after(function() {
              // unset the model for next test
              this.model = undefined;
            });

            it("should be an array", function () {
              expect(this.model.addresses).to.be.an.instanceOf(Array);
            });
            it("this model should have 1 address", function () {
              expect(this.model.addresses).to.have.length(1);
            });
          });

          describe('no addresses returned', function() {
            before(function() {
              this.model = profileModel.parse({ /*no address data */ });
            });

            after(function() {
              // unset the model for next test
              this.model = undefined;
            });

            it("model should still have an address array", function () {
              expect(this.model.addresses).to.be.an.instanceOf(Array);
            });
            it("model should have 0 subscription", function () {
              expect(this.model.addresses).to.have.length(0);
            });
          });

          describe('an address with all fields', function() {
            before(function(){
              var parsedModel = profileModel.parse(rawData);
              this.model = parsedModel.addresses[0];
            });

            after(function() {
              // unset the model for next test
              this.model = undefined;
            });

            it("should have given name", function () {
              expect(this.model.givenName).to.be.string('ben');
            });
            it("should have family name", function () {
              expect(this.model.familyName).to.be.string('boxer');
            });
            it("should have street address", function () {
              expect(this.model.streetAddress).to.be.string('1234 HappyVille Road');
            });
            it("should have extended address", function () {
              expect(this.model.extendedAddress).to.be.string('Siffon Ville');
            });
            it("should have city", function () {
              expect(this.model.city).to.be.string('St. Helens');
            });
            it("should have region", function () {
              expect(this.model.region).to.be.string('MB');
            });
            it("should have country", function () {
              expect(this.model.country).to.be.string('CA');
            });
            it("should have postal code", function () {
              expect(this.model.postalCode).to.be.string('v8v8v8');
            });
          });
        });

      });
// -------- end parse model
    });
  });
});
