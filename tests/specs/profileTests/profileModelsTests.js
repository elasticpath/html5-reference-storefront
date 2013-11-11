/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.
 *
 * Functional Storefront Unit Test - Profile Models
 */
define(function (require) {

  describe('Profile Module: Models', function () {
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
  });

});
