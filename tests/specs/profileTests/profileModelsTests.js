/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.
 *
 * Functional Storefront Unit Test - Profile Models
 */
define(function (require) {
  var profileModels = require('profile.models');
  var dataJSON = require('text!/tests/data/profile.json');

  describe('Profile Module: Models', function () {
    var data = JSON.parse(dataJSON).response;
    var profileModel = new profileModels.ProfileModel();

    describe('Given complete and valid profile data', function () {
      before(function() {
        this.rawData = _.clone(data);
        this.model = profileModel.parse(this.rawData);
        this.subscription = this.model.subscriptions[0];
        this.secondAddress = this.model.addresses[1];
      });

      after(function() {
        delete(this.model);
        delete(this.subscription);
      });

      describe('Model should parse personal data correctly', function () {
        it("must have a family name", function () {
          expect(this.model.familyName).to.be.string('Harris');
        });
        it("must have a given name", function () {
          expect(this.model.givenName).to.be.string('Oliver');
        });
      });

      describe('Model should parse subscription data correctly', function () {
        it("should have a subscription array", function () {
          expect(this.model.subscriptions).to.be.an.instanceOf(Array);
        });
        it("should have 1 subscription", function () {
          expect(this.model.subscriptions).to.have.length(1);
        });

        it("should have display name", function () {
          expect(this.subscription.displayName).to.be.string('iTest Master Plan CAD');
        });
        it("should have quantity", function () {
          expect(this.subscription.quantity).to.equal(1);
        });
        it("should have next billing date", function () {
          expect(this.subscription.nextBillingDate).to.be.string('November 9, 2013');
        });
        it("should have status", function () {
          expect(this.subscription.status).to.be.string('ACTIVE');
        });
      });

      describe('Model should parse address data correctly', function() {
        it("should be an array of 3 addresses", function () {
          expect(this.model.addresses).to.be.an.instanceOf(Array);
          expect(this.model.addresses).to.have.length(3);
        });

        describe('The second address should be completely populated', function() {
          it("should have given name", function () {
            expect(this.secondAddress.givenName).to.be.string('Karen');
          });
          it("should have family name", function () {
            expect(this.secondAddress.familyName).to.be.string('Harris');
          });
          it("should have street address", function () {
            expect(this.secondAddress.streetAddress).to.be.string('#1999 12 floor');
          });
          it("should have extended address", function () {
            expect(this.secondAddress.extendedAddress).to.be.string('100 City Centre Drive');
          });
          it("should have city", function () {
            expect(this.secondAddress.city).to.be.string('Mississauga');
          });
          it("should have region", function () {
            expect(this.secondAddress.region).to.be.string('ON');
          });
          it("should have country", function () {
            expect(this.secondAddress.country).to.be.string('CA');
          });
          it("should have postal code", function () {
            expect(this.secondAddress.postalCode).to.be.string('L5C 2B9');
          });
        });
      });
    });

    describe('Given profile data without a subscription or an address', function() {
      before(function() {
        this.model = profileModel.parse({});
      });

      after(function() {
        delete(this.model);
      });

      it("should have an empty subscription array", function () {
        expect(this.model.subscriptions).to.be.an.instanceOf(Array);
        expect(this.model.subscriptions).to.have.length(0);
      });

      it("should have an empty address array", function () {
        expect(this.model.addresses).to.be.an.instanceOf(Array);
        expect(this.model.addresses).to.have.length(0);
      });
    });
  });
});