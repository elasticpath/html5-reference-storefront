/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 * Functional Storefront Unit Test - Profile Views
 */
define(function (require) {
  var Backbone = require('backbone');
  var ep = require('ep');

  var profileViews = require('profile.views');
  var profileTemplate = require('text!modules/base/profile/base.profile.templates.html');

  describe('Profile Purchases Views', function () {
    before(function () {
      $("#Fixtures").append(profileTemplate);
    });

    after(function () {
      $("#Fixtures").empty();
    });

    describe('ProfilePurchaseDetailView', function () {
      before(function () {
        // mock the model
        this.model = new Backbone.Model({
          purchaseNumber: '20060',
          date: {
            displayValue: 'January 15, 2014 1:40:46 PM',
            value: 1389822046000
          },
          total: {
            amount: 109.99,
            currency: "USD",
            display: "$109.99"
          },
          status: 'COMPLETE',
          link: 'fakePurchaseDetailLink'
        });
        this.view = new profileViews.__test_only__.ProfilePurchaseDetailView({model: this.model});
        this.view.render();
      });

      after(function () {
        this.model.destroy();
      });

      it('should be an instance of Marionette ItemView object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.ItemView);
      });
      it('is referencing the template with correct ID', function () {
        var templateId = '#DefaultProfilePurchaseDetailTemplate';
        expect(this.view.getTemplate()).to.be.string(templateId);
        expect($(templateId)).to.exist;
      });
      it('render() should return the view object', function () {
        expect(this.view.render()).to.be.equal(this.view);
      });

      describe('correctly renders', function() {
        it('purchase number', function () {
          expect($('[data-el-value="purchase.number"]', this.view.$el).text()).to.have.string(this.model.get('purchaseNumber'));
        });
        it('purchase date', function () {
          expect($('[data-el-value="purchase.date"]', this.view.$el).text()).to.have.string(this.model.get('date').displayValue);
        });
        it('purchase total', function () {
          expect($('[data-el-value="purchase.total"]', this.view.$el).text()).to.have.string(this.model.get('total').display);
        });
        it('purchase status', function () {
          expect($('[data-el-value="purchase.status"]', this.view.$el).text()).to.have.string(this.model.get('status'));
        });
        it('purchase detail link', function () {
          expect($('[data-el-value="purchase.number"] a', this.view.$el).attr('href')).to.have.string(ep.app.config.routes.purchaseHistory);
        });
      });
    });

    describe('ProfilePurchasesHistoryView', function () {
      before(function () {
        sinon.stub(ep.logger, 'warn');
        // mock the collection of model
        this.collection = new Backbone.Collection();
        this.collection.add(new Backbone.Model());
        this.collection.add(new Backbone.Model());
        this.view = new profileViews.ProfilePurchasesHistoryView({collection: this.collection});
        this.view.render();
      });

      after(function () {
        ep.logger.warn.restore();
        this.collection.reset();
      });

      it('should be an instance of Marionette CompositeView object', function () {
        expect(this.view).to.be.an.instanceOf(Marionette.CompositeView);
      });
      it('is referencing the template with correct ID', function () {
        var templateId = '#DefaultProfilePurchasesHistoryTemplate';
        expect(this.view.getTemplate()).to.be.string(templateId);
        expect($(templateId)).to.exist;
      });
      it('render() should return the view object', function () {
        expect(this.view.render()).to.be.equal(this.view);
      });
      it('has $itemViewContainer', function () {
        expect(this.view.$itemViewContainer.length).to.be.equal(1);
      });
      it('has an emptyView', function () {
        expect(this.view.emptyView).to.be.ok;
      });

      it('renders a region title', function () {
        expect(this.view.$el.find("h2")).to.be.length(1);
      });
      it('renders a table header', function () {
        expect(this.view.$el.find("thead")).to.be.length(1);
      });

    });
  });
});