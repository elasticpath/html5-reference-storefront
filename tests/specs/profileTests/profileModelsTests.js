/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 * Functional Storefront Unit Test - Profile Models
 */
define(function (require) {
  var ep = require('ep');
  var modelTestFactory = require('testfactory.model');
  var models = require('profile.models');
  var dataJSON = require('text!/tests/data/profile.json');

  describe('Profile Module: Models', function () {
    var data = JSON.parse(dataJSON).response;
    var profileModel = new models.ProfileModel();
    var modelHelpers = models.testVariable.modelHelpers;

    describe('given all necessary information', function () {
      before(function () {
        this.rawData = _.extend({}, data);
        var rawArray = this.rawData._paymentmethods[0]._element;
        delete(this.rawData._paymentmethods[0]._element[2]);  // delete credit card payment
        this.model = profileModel.parse(this.rawData);
      });

      after(function () {
        // Clean up created variables
        delete(this.rawData);
        delete(this.model);
      });

      it('has non-empty familyName', function () {
        expect(this.model.familyName).to.be.ok;
      });
      it('has non-empty givenName', function () {
        expect(this.model.givenName).to.be.ok;
      });
      it('has non-empty subscriptions array', function () {
        expect(this.model.subscriptions).to.be.instanceOf(Array);
        expect(this.model.subscriptions).to.have.length.above(0);
      });
      it('has non-empty addresses array', function () {
        expect(this.model.addresses).to.be.instanceOf(Array);
        expect(this.model.addresses).to.have.length.above(0);
      });
      it('has non-empty paymentMethods array', function () {
        expect(this.model.paymentMethods).to.be.instanceOf(Array);
        expect(this.model.paymentMethods).to.have.length.above(0);
      });
    });

    describe('given response', function () {
      before(function () {
        sinon.stub(ep.logger, 'error');
      });

      beforeEach(function() {
        ep.logger.error.reset();
      });

      after(function () {
        ep.logger.error.restore();
      });

      describe('is undefined', function() {
        it('logs an error', function () {
          profileModel.parse(undefined);
          expect(ep.logger.error).to.be.called;
        });
      });

      describe('with no subscription data',
        modelTestFactory.simpleExpectEmptyArrayTestFactory(data, '_subscriptions', profileModel, 'subscriptions'));

      describe('with no addresses data',
        modelTestFactory.simpleExpectEmptyArrayTestFactory(data, '_addresses', profileModel, 'addresses'));

      describe('with no payment-methods data',
        modelTestFactory.simpleExpectEmptyArrayTestFactory(data, '_paymentmethods', profileModel, 'paymentMethods'));

      describe('with token  & credit card payment-methods', function() {
        before(function() {
          sinon.spy(modelHelpers, 'parseTokenPayment');
          var rawData = JSON.parse(JSON.stringify(data));
          this.model = profileModel.parse(rawData);
        });

        after(function() {
          modelHelpers.parseTokenPayment.restore();
          delete(this.model);
        });

        it('parses token payments with parseTokenPayment function', function() {
          expect(modelHelpers.parseTokenPayment).to.be.called;
        });
        it('returns 2 payment methods in the array', function() {
          var paymentMethodsArray = this.model.paymentMethods;
          expect(paymentMethodsArray).to.have.length(2);
        });
      });

      describe('with only credit card payment', function() {
        before(function() {
          sinon.spy(modelHelpers, 'parseTokenPayment');

          var rawData = JSON.parse(JSON.stringify(data));
          var rawArray = rawData._paymentmethods[0]._element;
          delete(rawArray[0]);  // delete token payment
          delete(rawArray[1]);  // delete token payment
          this.model = profileModel.parse(rawData);        });

        after(function() {
          modelHelpers.parseTokenPayment.restore();
          delete(this.model);
        });

        it('doesnot call parseTokenPayment function', function() {
          expect(modelHelpers.parseTokenPayment).to.be.not.called;
        });
        it('returns 0 payment methods in the array', function() {
          var paymentMethodsArray = this.model.paymentMethods;
          expect(paymentMethodsArray).to.have.length(0);
        });

      });
    });

  });

});
