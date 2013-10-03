/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 */
define(['eventbus', 'backbone'],
  function(EventBus, Backbone){

    var purchaseConfirmationModel = Backbone.Model.extend({
      parse:function(response){
        var confirmationObj = {};
        // Order Status
        confirmationObj.status = response.status;
        // Oder Number
        confirmationObj.purchaseNumber = response['purchase-number'];
        // Order Total
        confirmationObj.orderTotal = jsonPath(response, '$.monetary-total[0].display')[0];
        // Purchase Date
        confirmationObj.purchaseDate = jsonPath(response, '$.purchase-date.display-value')[0];
        // Tax Total
        confirmationObj.taxTotal = jsonPath(response, '$.tax-total.display');

        // Line Items
        confirmationObj.lineItems = [];
        var lineItems = jsonPath(response, '$._lineitems.._element')[0];
        if (lineItems){
          for (var i = 0;i < lineItems.length;i++){
            var lineItemObj = {};
            var lineItemRef = lineItems[i];
            // name
            if(lineItemRef.name){
              lineItemObj.name = lineItemRef.name;
            }
            // quantity
            if(lineItemRef.quantity){
              lineItemObj.quantity = lineItemRef.quantity;
            }


            // Line Item Rate / Price
            lineItemObj.amount = {};
            lineItemObj.tax = {};
            lineItemObj.total = {};
            // check if subscription or one-time item
            if(lineItemRef._rate && lineItemRef._rate[0]){
              // rate may have multiple items in array
              if (lineItemRef._rate[0].rate && lineItemRef._rate[0].rate[0]){
                lineItemObj.total.display = lineItemRef._rate[0].rate[0].display;
              }
            }
            // non subscription item
            else{
              // item total
              if (lineItemRef['line-extension-total']){
                var lineTotalObj = {};
                lineItemObj.total.display = lineItemRef['line-extension-total'][0].display || null;
                lineItemObj.total.cost = lineItemRef['line-extension-total'][0];
                //  lineItemObj.total.total.push(lineTotalObj);
              }
              // tax
              if (lineItemRef['line-extension-tax']){
                lineItemObj.tax.display = lineItemRef['line-extension-tax'][0].display || null;
                lineItemObj.tax.currency = lineItemRef['line-extension-tax'][0].currency || null;
                lineItemObj.tax.amount = lineItemRef['line-extension-tax'][0].amount || null;
              }
              // item net amount
              if (lineItemRef['line-extension-amount']){
                lineItemObj.amount.display = lineItemRef['line-extension-amount'][0].display || null;
                lineItemObj.amount.currency = lineItemRef['line-extension-amount'][0].currency || null;
                lineItemObj.amount.amount = lineItemRef['line-extension-amount'][0].amount || null;
              }
            }
            confirmationObj.lineItems.push(lineItemObj);
          }
        }

        // Billing Address
        confirmationObj.billingAddress = {};
        if (jsonPath(response, '$._billingaddress')){
          var rawBillingAddress = jsonPath(response, '$._billingaddress[0]')[0];

          var firstName = rawBillingAddress.name['given-name'] || null;
          var lastName = rawBillingAddress.name['family-name'] || null;
          confirmationObj.billingAddress.name = firstName + ' ' + lastName;
          confirmationObj.billingAddress.country = rawBillingAddress.address['country-name'] || null;
          confirmationObj.billingAddress.streetAddress = rawBillingAddress.address['street-address'] || null;
          confirmationObj.billingAddress.extendedAddress = rawBillingAddress.address['extended-address'] || null;
          confirmationObj.billingAddress.locality = rawBillingAddress.address.locality || null;
          confirmationObj.billingAddress.postalCode = rawBillingAddress.address['postal-code'] || null;
          confirmationObj.billingAddress.region = rawBillingAddress.address.region || null;
        }


        // Payment Method
        // TBD

        return confirmationObj;
      }
    });



    return {
      PurchaseConfirmationModel:purchaseConfirmationModel

    };
  }
);
