/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 */
define(['ep', 'eventbus', 'backbone'],
  function(ep, EventBus, Backbone){


    var authRequestModel = Backbone.Model.extend({});

    var loginViewModel = Backbone.Model.extend({
      url:ep.app.config.cortexApi.path +'profile' + ep.app.config.store + '/default',
      parse:function(profile) {
        var profileObj = {
          firstName: jsonPath(profile, "$.")[0]
        };

        return profileObj;
      }
    });

    return {
      AuthRequestModel:authRequestModel,
      LoginViewModel:loginViewModel
    };
  }
);
