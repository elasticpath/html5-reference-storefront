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
         window.localStorage.setItem('oAuthRole', json.role);
         window.localStorage.setItem('oAuthScope', json.scope);
         window.localStorage.setItem('oAuthToken', 'Bearer ' + json.access_token);
         window.localStorage.setItem('oAuthUserName', this.userName);

         Mediator.fire('mediator.authenticationSuccess', json.role);
       },
       error: function(response) {
         if (response.status === 401) {
           EventBus.trigger('auth.loginRequestFailed', 'loginFailBadCredentialErrMsg');
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
            window.localStorage.removeItem('oAuthRole');
            window.localStorage.removeItem('oAuthScope');
            window.localStorage.removeItem('oAuthToken');
            window.localStorage.removeItem('oAuthUserName');
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
