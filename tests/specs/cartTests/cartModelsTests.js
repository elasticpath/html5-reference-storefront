/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.

 * User: sbrookes
 * Date: 26/07/13
 * Time: 7:31 AM
 *
 */
define(function (require) {

  describe("Cart Module: Models", function () {
    var cartModels = require('cart.models');
    var myCartModel = new cartModels.CartModel();

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
              "cost": [
                {
                  "amount": 0,
                  "currency": "CAD",
                  "display": "$0.00",
                  "title": "PST"
                }
              ],
              "total": {
                "amount": 0.25,
                "currency": "CAD",
                "display": "$0.25"
              }
            }
          ],
          "_total": [
            {
              "cost": [
                {
                  "amount": 0,
                  "currency": "CAD",
                  "display": "$0.00",
                  "title": "PST"

                }
              ]
            }
          ]
        }
      ]
    };

    before(function() {
      this.model = myCartModel.parse(rawData);
    });

    after(function() {
      this.model = null;
    });

    describe("Cart model renders selected (chosen) billing address correctly", function() {
      it("must have a family name", function() {
        expect(this.model.billingAddresses.chosenBillingAddress.familyName).to.be.equal('boxer');
      });
      it("must have a given name", function() {
        expect(this.model.billingAddresses.chosenBillingAddress.givenName).to.be.equal('ben');
      });
      it("must have a street address", function() {
        expect(this.model.billingAddresses.chosenBillingAddress.streetAddress).to.be.equal('Hoyip Chinese Restaurant');
      });
      it("must have an extended address", function() {
        expect(this.model.billingAddresses.chosenBillingAddress.extendedAddress).to.be.equal('110 Liberty Street');
      });
      it("must have a city", function() {
        expect(this.model.billingAddresses.chosenBillingAddress.city).to.be.equal('New York');
      });
      it("must have a region", function() {
        expect(this.model.billingAddresses.chosenBillingAddress.region).to.be.equal('NY');
      });
      it("must have a country", function() {
        expect(this.model.billingAddresses.chosenBillingAddress.country).to.be.equal('US');
      });
      it("must have a postal code", function() {
        expect(this.model.billingAddresses.chosenBillingAddress.postalCode).to.be.equal('NY 10006');
      });
    });

    describe("Cart model renders tax correctly", function() {
      it("must have a currency", function() {
        expect(this.model.cartTaxes[0].currency).to.be.equal('CAD');
      });
      it("must have an amount", function() {
        expect(this.model.cartTaxes[0].amount).to.be.equal(0);
      });
      it("must have a display value", function() {
        expect(this.model.cartTaxes[0].display).to.be.equal('$0.00');
      });
      it("must have a title value", function() {
        expect(this.model.cartTaxes[0].title).to.be.equal('PST');
      });
    });

    describe("Cart model renders order total correctly", function() {
      it("must have a currency", function() {
        expect(this.model.cartOrderTotal.currency).to.be.equal('CAD');
      });
      it("must have an amount", function() {
        expect(this.model.cartOrderTotal.amount).to.be.equal(0);
      });
      it("must have a display value", function() {
        expect(this.model.cartOrderTotal.display).to.be.equal('$0.00');
      });
    });
  });

});
