/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.
 *
 */
define(function (require) {
  var ep = require('ep');

  describe("Model Helpers", function () {
    var helpers = require('modelHelpers');

    describe('helper: parseArray', function () {
      var stubFunction = function (data) {
        data.called = true;
        return data;
      };

      describe('given a non-empty array', function () {
        var rawData = [
          {called: false},
          {called: false}
        ];

        before(function () {
          this.model = helpers.parseArray(rawData, stubFunction);
        });

        after(function () {
          this.model = undefined;
        });

        it('returns a non-empty array', function () {
          expect(this.model).to.be.an.instanceOf(Array);
          expect(this.model).to.be.length(rawData.length);
        });
        it('called parse function for each item in the array', function () {
          this.model.forEach(function (entry) {
            expect(entry.called).to.be.true;
          });
        });
      });

      describe('given an empty array', function () {
        before(function () {
          this.model = helpers.parseArray([], stubFunction);
        });

        after(function () {
          this.model = undefined;
        });

        it('returns a empty array', function () {
          expect(this.model).to.be.an.instanceOf(Array);
          expect(this.model).to.be.length(0);
        });
      });
    });


    describe('Profile Parsers', function () {
      var testDataAddress = {
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
      };
      var expectedAddress = {
        givenName: 'ben',
        familyName: 'boxer',
        streetAddress: '1234 HappyVille Road',
        extendedAddress: 'Siffon Ville',
        city: "St. Helens",
        region: "MB",
        country: "CA",
        postalCode: "v8v8v8"
      };
      describe('helper: parseAddress',
        parserTestFactory(testDataAddress, helpers.parseAddress, expectedAddress));


      var testDataSubscription = {
        "display-name": "Subscription Plan",
        "next-billing-date": {
          "display-value": "December 18, 2013",
          "value": 1387324800000
        },
        "quantity": 3,
        "status": "ACTIVE"
      };
      var expectedSubscription = {
        displayName: 'Subscription Plan',
        quantity: 3,
        nextBillingDate: 'December 18, 2013'
      };
      describe('helper: parseSubscription',
        parserTestFactory(testDataSubscription, helpers.parseSubscription, expectedSubscription));
    });


    describe('Item Parsers', function () {
      var testDataPrice = {};
      var expectedPrice = {};
      describe('helper: parsePrice',
        parserTestFactory(testDataPrice, helpers.parsePrice, expectedPrice));

      var testDataRate = {};
      var expectedRate = {};
      describe('helper: ',
        parserTestFactory(testDataRate, helpers.parseRate, expectedRate));

      var testDataAvailability = {};
      var expectedAvailability = {};
      describe('helper: ',
        parserTestFactory(testDataAvailability, helpers.parseAvailability, expectedAvailability));
    });

  });

  function parserTestFactory (testData, fnToTest, expected) {
    return function() {
      beforeEach(function () {
        sinon.stub(ep.logger, 'error');
      });

      afterEach(function () {
        ep.logger.error.restore();
      });

      it("parses JSON object correctly", function () {
        for(var attr in expected) {
          var model = fnToTest(testData);
          expect(model[attr]).to.be.equal(expected[attr]);
        }
      });

      it("logs error given undefined argument", function() {
        fnToTest(undefined);
        expect(ep.logger.error).to.be.calledOnce;
      });

      it("return empty object{} given invalid data to parse", function() {
        var model = fnToTest({});
        expect(model).to.be.ok;
      });
    };
  }

});
