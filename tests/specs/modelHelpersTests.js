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

    var testDataTax = {
      "amount": 13.6,
      "currency": "CAD",
      "display": "$13.60",
      "title": "PST"
    };
    var expectedTax = {
      amount: 13.6,
      currency: 'CAD',
      display: '$13.60',
      title:'PST'
    };
    describe('helper: parseTax',
      parserTestFactory(testDataTax, expectedTax, helpers.parseTax));


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
        parserTestFactory(testDataAddress, expectedAddress, helpers.parseAddress));


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
        parserTestFactory(testDataSubscription, expectedSubscription, helpers.parseSubscription));

      var testDataToken = {
        "display-value": "timmins-token-X"
      };
      var expectedToken = {
        displayValue: 'timmins-token-X'
      };
      describe('helper: parseSubscription',
        parserTestFactory(testDataToken, expectedToken, helpers.parseTokenPayment));

    });


    describe('Item Parsers', function () {
      var testDataPrice = {
        "amount": 192.09,
        "currency": "CAD",
        "display": "$192.09"
      };
      var expectedPrice = {
        amount: 192.09,
        currency: "CAD",
        display: "$192.09"
      };
      describe('helper: parsePrice',
        parserTestFactory(testDataPrice, expectedPrice, helpers.parsePrice));

      var testDataRate = {
        "display": "$12.00/year",
        "cost": {
          "amount": 12,
          "currency": "USD",
          "display": "$12.00"
        },
        "recurrence": {
          "display": "annually",
          "interval": "ANNUAL"
        }
      };
      var expectedRate = {
        display: "$12.00/year",
        cost: {
          amount: 12,
          currency: "USD",
          display: "$12.00"
        },
        recurrence: {
          display: "annually",
          interval: "ANNUAL"
        }
      };
      describe('helper: parseRate',
        parserTestFactory(testDataRate, expectedRate, helpers.parseRate));

      var testDataPreOrder = {
        "state": "AVAILABLE_FOR_PRE_ORDER",
        "release-date": {
          "display-value": "December 25, 2013 12:00:00 AM",
          "value": 1387958400000
        }
      };
      var expectedPreOrder = {
        state: "AVAILABLE_FOR_PRE_ORDER",
        releaseDate: {
          displayValue: "December 25, 2013 12:00:00 AM",
          value: 1387958400000
        }
      };
      describe('helper: parseAvailability with release date',
        parserTestFactory(testDataPreOrder, expectedPreOrder, helpers.parseAvailability));

      var testDataAvailable = {
        "state": "AVAILABLE_FOR_PRE_ORDER"
      };
      var expectedAvailable = {
        state: "AVAILABLE_FOR_PRE_ORDER"
      };
      describe('helper: parseAvailability without release date',
        parserTestFactory(testDataAvailable, expectedAvailable, helpers.parseAvailability));
    });

  });

  function parserTestFactory(testData, expected, fnToTest) {
    return function() {
      beforeEach(function () {
        sinon.stub(ep.logger, 'warn');
      });

      afterEach(function () {
        ep.logger.warn.restore();
      });

      it("parses JSON object correctly", function () {
        var model = fnToTest(testData);
        for(var attr in expected) {
          expect(model[attr]).to.be.eql(expected[attr]);
        }
      });

      it("logs error given undefined argument", function() {
        fnToTest(undefined);
        expect(ep.logger.warn).to.be.calledOnce;
      });

      it("return empty object{} given invalid data to parse", function() {
        var model = fnToTest({});
        expect(model).to.be.ok;
      });
    };
  }

});
