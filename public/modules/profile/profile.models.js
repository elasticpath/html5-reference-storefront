/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 */
define(['ep','eventbus', 'backbone'],
  function(ep,EventBus, Backbone){


    var profileModel = Backbone.Model.extend({
      url:ep.app.config.cortexApi.path + '/profiles/' + ep.app.config.cortexApi.scope + '/default?zoom=purchases:element,paymentmethods:element,subscriptions:element,emails,addresses:billingaddresses,addresses:shippingaddresses',
      parse:function(response){
        var profileObj = {};

        // Profile Summary Info
        profileObj.familyName = response["family-name"];
        profileObj.givenName = response["given-name"];

        // Profile Payment Info
        profileObj.paymentMethods = [];
        var localPaymentMethods = jsonPath(response, '$._paymentmethods.._element')[0];
        var paymentMethodsLength = localPaymentMethods.length;
        for(var i = 0;i < paymentMethodsLength;i++){
          var paymentMethodObj = {};

          try{
            paymentMethodObj.cardNumber = localPaymentMethods[i]["card-number"];
            paymentMethodObj.cardType = localPaymentMethods[i]["card-type"];
            paymentMethodObj.cardHolderName = localPaymentMethods[i]["cardholder-name"];
            paymentMethodObj.expiryMonth = localPaymentMethods[i]["expiry-month"];
            paymentMethodObj.expiryYear = localPaymentMethods[i]["expiry-year"];

            profileObj.paymentMethods.push(paymentMethodObj);
          }
          catch(error){
            ep.logger.error('Error building payment method object: ' + error.message);
          }

        }



        // Profile Subscription Info
        var subscriptionsArray = jsonPath(response, '$._subscriptions.._element');
        if (subscriptionsArray){
          var subsLength = subscriptionsArray.length;
          profileObj.subscriptions = [];
          for (var i = 0;i < subsLength;i++){
            var subObj = {};
            var targetObj = subscriptionsArray[i][0];
            if (targetObj['display-name']){
              subObj.displayName = targetObj['display-name'];
            }
            if (targetObj.quantity){
              subObj.quantity = targetObj.quantity;
            }
            if (targetObj['next-billing-date']){
              subObj.nextBillingDate = targetObj['next-billing-date']['display-value'];
            }
            profileObj.subscriptions.push(subObj);
          }
        }

        // Profile Addresses
        // Profile Billing Address

        // Profile Shipping Address



        return profileObj;
      }
    });



    return {
      ProfileModel:profileModel


    };
  }
);
