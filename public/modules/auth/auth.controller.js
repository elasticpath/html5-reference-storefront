/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 * 
 */
define(['ep', 'app', 'mediator', 'eventbus', 'cortex', 'modules/auth/auth.models', 'modules/auth/auth.views', 'text!modules/auth/auth.templates.html'],
  function(ep, App, Mediator, EventBus, Cortex, Model, View, template){

    $('#TemplateContainer').append(template);

    _.templateSettings.variable = 'E';

    var defaultView = function() {
      var authLayout =  new View.DefaultLayout();

      return authLayout;
    };

    EventBus.on('auth.showAuthMenu', function(event) {
      if ($(event.target).data("state") === 'loggedIn') { // FIXME
        EventBus.trigger('layout.loadRegionContentRequest', {
          region:'mainAuthView',
          module:'auth',
          view:'ProfileMenuView'
        });
      }
      else {
        EventBus.trigger('layout.loadRegionContentRequest',{
          region:'mainAuthView',
          module:'auth',
          view:'LoginFormView'
        });
      }
    });

    EventBus.on('auth.logoutBtnClicked', function(event) {
      ep.logger.info("logout click caught");
    });

    EventBus.on('auth.loginFormSubmitButtonClicked', function(event) {
      EventBus.trigger('auth.loginFailed', 'Failed to login.'); // FIXME
      ep.logger.info("login click caught");
    });

    return {
      AuthModel:Model.AuthModel,
      DefaultView:defaultView,
      LoginFormView: function() {return new View.LoginFormView(); },
      ProfileMenuView: function() {return new View.ProfileMenuView(); }
    };
  }
);
