/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 */
define(['ep', 'mediator', 'eventbus', 'backbone'],
  function(ep, Mediator, EventBus, Backbone){

    /*
     * Login Model: store default login / public auth request ajax call properties
     */
    // FIXME is this really proper use of model? should this logic live in model? I feel it should be in success
    var loginModel = Backbone.Model.extend({
     defaults: {
       userName:'Anonymous',
       authRequest: true,
       redirect: '',  // location redirect to on success, placeholder for success function
       url: ep.io.getApiContext() + '/oauth2/tokens',
       type: 'POST',
       contentType: 'application/x-www-form-urlencoded',
       success: function (json, responseStatus, xhr) {
         ep.io.localStore.setItem(ep.app.config.cortexApi.scope + '_oAuthRole', json.role);
         ep.io.localStore.setItem(ep.app.config.cortexApi.scope + '_oAuthScope', json.scope);
         ep.io.localStore.setItem(ep.app.config.cortexApi.scope + '_oAuthToken', 'Bearer ' + json.access_token);
         ep.io.localStore.setItem(ep.app.config.cortexApi.scope + '_oAuthUserName', this.userName);

         Mediator.fire('mediator.authenticationSuccess', this.redirect);
       },
       error: function(response) {
         EventBus.trigger('auth.loginRequestFailed', {
           status: response.status,
           responseText: response.responseText
         });

         ep.logger.error('response code ' + response.status + ': ' + response.responseText);
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
        url: ep.io.getApiContext() + '/oauth2/tokens',
        success:function(json, responseSTatus, xhr) {
          try{
            ep.io.localStore.removeItem(ep.app.config.cortexApi.scope + '_oAuthRole');
            ep.io.localStore.removeItem(ep.app.config.cortexApi.scope + '_oAuthScope');
            ep.io.localStore.removeItem(ep.app.config.cortexApi.scope + '_oAuthToken');
            ep.io.localStore.removeItem(ep.app.config.cortexApi.scope + '_oAuthUserName');

            Mediator.fire('mediator.logoutSuccess');
          }
          catch(err){
            ep.logger.error('Error - removing authentication tokens from local storage: ' + err.message);
          }

        }
      }
    });

    /**
     * Stores link needed to submit anonymous checkout form.
     * @type Backbone.Model
     */
    var anonymousCheckoutModel = Backbone.Model.extend({
      getUrl: function (href) {
        return href + '?zoom=emailinfo:emailform';
      },
      parse: function(response) {
        var emailForm = {};

        if (response) {
          emailForm =  {
            emailActionLink: jsonPath(response, '$.._emailinfo..links[?(@.rel=="createemailaction")].href')[0]
          };
        }
        else {
          ep.logger.error("new payment form model wasn't able to fetch valid data for parsing. ");
        }

        return emailForm;
      }
    });

    return {
      LogoutModel:logoutModel,
      LoginModel:loginModel,
      AnonymousCheckoutModel: anonymousCheckoutModel
    };
  }
);
