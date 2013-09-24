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
        var x  = response;
        var profileObj = {};
        profileObj.familyName = response["family-name"];
        profileObj.givenName = response["given-name"];
        return profileObj;
      }
    });



    return {
      ProfileModel:profileModel


    };
  }
);
