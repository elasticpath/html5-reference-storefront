/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.
 *
 * Functional Storefront Unit Test - Checkout Models
 */
define(function (require) {

  describe('Checkout Module: Models', function () {
    var models = require('checkout.models');
    var checkoutModel = new models.CheckoutModel();

    var rawData = {
      "_order": [
        {
          "_billingaddressinfo": [
            {
              "_selector": [
                {
                  "_chosen": [
                    {
                      "_description": [
                        {
                          "address": {
                            "country-name": "US",
                            "extended-address": "110 Liberty Street",
                            "locality": "New York",
                            "postal-code": "NY 10006",
                            "region": "NY",
                            "street-address": "Hoyip Chinese Restaurant"
                          },
                          "name": {
                            "family-name": "boxer",
                            "given-name": "ben"
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          "_tax": [
            {
              "total": {
                "amount": 0,
                "currency": "CAD",
                "display": "$0.00"
              }
            }
          ],
          "_total": [
            {
              "cost": [
                {
                  "amount": 0,
                  "currency": "CAD",
                  "display": "$0.00"
                }
              ]
            }
          ]
        }
      ]
    };

    before(function () {
      this.model = checkoutModel.parse(rawData);
    });

    after(function () {
      this.model = null;
    });

    describe("parse (chosen) billing address correctly", function () {

      it("must have a family name", function () {
        expect(this.model.billingAddresses.chosenBillingAddress.familyName).to.be.equal('boxer');
      });
      it("must have a given name", function () {
        expect(this.model.billingAddresses.chosenBillingAddress.givenName).to.be.equal('ben');
      });
      it("must have a street address", function () {
        expect(this.model.billingAddresses.chosenBillingAddress.streetAddress).to.be.equal('Hoyip Chinese Restaurant');
      });
      it("must have an extended address", function () {
        expect(this.model.billingAddresses.chosenBillingAddress.extendedAddress).to.be.equal('110 Liberty Street');
      });
      it("must have a city", function () {
        expect(this.model.billingAddresses.chosenBillingAddress.city).to.be.equal('New York');
      });
      it("must have a region", function () {
        expect(this.model.billingAddresses.chosenBillingAddress.region).to.be.equal('NY');
      });
      it("must have a country", function () {
        expect(this.model.billingAddresses.chosenBillingAddress.country).to.be.equal('US');
      });
      it("must have a postal code", function () {
        expect(this.model.billingAddresses.chosenBillingAddress.postalCode).to.be.equal('NY 10006');
      });
    });

    describe("parse tax correctly", function () {
      it("must have a currency", function () {
        expect(this.model.cartTax.currency).to.be.equal('CAD');
      });
      it("must have an amount", function () {
        expect(this.model.cartTax.amount).to.be.equal(0);
      });
      it("must have a display value", function () {
        expect(this.model.cartTax.display).to.be.equal('$0.00');
      });
    });

    describe("parse order total correctly", function () {
      it("must have a currency", function () {
        expect(this.model.cartOrderTotal.currency).to.be.equal('CAD');
      });
      it("must have an amount", function () {
        expect(this.model.cartOrderTotal.amount).to.be.equal(0);
      });
      it("must have a display value", function () {
        expect(this.model.cartOrderTotal.display).to.be.equal('$0.00');
      });
    });


  });

});
