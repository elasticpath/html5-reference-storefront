/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 */
define(['ep', 'mediator', 'eventbus', 'backbone'],
  function(ep, Mediator, EventBus, Backbone){


    /*
     * Login Form Model: store data from login form fields
     */
    var loginFormModel = Backbone.Model.extend({
      isComplete:function() {
        return this.get('userName') && this.get('password') && this.get('role') && this.get('scope');
      }
    });


    /*
     * Login Model: store default login / public auth request ajax call properties
     */
    var loginModel = Backbone.Model.extend({
     defaults: {
       userName:'Anonymous',
       authRequest: true,
       url:'/' + ep.app.config.cortexApi.path + '/oauth2/tokens',
       type: 'POST',
       contentType: 'application/x-www-form-urlencoded',
       success: function (json, responseStatus, xhr) {
         ep.io.localStore.setItem('oAuthRole', json.role);
         ep.io.localStore.setItem('oAuthScope', json.scope);
         ep.io.localStore.setItem('oAuthToken', 'Bearer ' + json.access_token);
         ep.io.localStore.setItem('oAuthUserName', this.userName);

         Mediator.fire('mediator.authenticationSuccess', json.role);
       },
       error: function(response) {
         if (response.status === 401) {
           EventBus.trigger('auth.loginRequestFailed', 'badCredentialErrMsg');
         } else {
           ep.logger.error('response code ' + response.status + ': ' + response.responseText);
         }
       }
     }
    });


    /*
     * Logout Model: store default logout auth request ajax call properties
     */
    var logoutModel = Backbone.Model.extend({
      defaults: {
        authRequest: true,
        type:'DELETE',
        url:'/' + ep.app.config.cortexApi.path + '/oauth2/tokens',
        success:function(json, responseSTatus, xhr) {
          try{
            // FIXME abstract persistence layer
            ep.io.localStore.removeItem('oAuthRole');
            ep.io.localStore.removeItem('oAuthScope');
            ep.io.localStore.removeItem('oAuthToken');
            ep.io.localStore.removeItem('oAuthUserName');
          }
          catch(err){
            ep.logger.error('Error - removing authentication tokens from local storage');
          }

          EventBus.trigger('auth.generatePublicAuthTokenRequest');
          ep.logger.info('LOGOUT REQUEST CAME BACK.');
        }
      }
    });

    return {
      LoginFormModel:loginFormModel,
      LogoutModel:logoutModel,
      LoginModel:loginModel
    };
  }
);
