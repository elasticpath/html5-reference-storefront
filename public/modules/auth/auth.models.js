/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 */
define(['eventbus', 'backbone'],
  function(EventBus, Backbone){


    var authRequestModel = Backbone.Model.extend({});

    return {
      AuthRequestModel:authRequestModel
    };
  }
);
