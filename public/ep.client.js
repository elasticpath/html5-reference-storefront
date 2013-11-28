/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 02/04/13
 * Time: 8:25 AM
 *
 */
define(function (reqiure) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var Marionette = require('marionette');
    var Mediator = require('mediator');
    var EventBus = require('eventbus');
    var Router = require('router');
    var config = require('text!ep.config.json');

    // require the follow is necessary to use their functions, but no need to variablize it.
    require('toast');
    require('jsonpath');

    // root application namespace
    var ep = {};
    ep.ui = {};
    ep.io = {};
    ep.app = new Marionette.Application();


    // presentation dom container region
    ep.app.addRegions({
      viewPortRegion: '[data-region="viewPortRegion"]'
    });

    ep.app.config = JSON.parse(config);

    ep.app.deployMode = function () {
      return ep.app.config.deployMode || 'development';
    };


    // determine if touch enabled
    ep.ui.touchEnabled = function () {
      // logic to return if this is a touch interface
      if (Modernizr.touch) {
        return true;
      }
      return false;
    };


    ep.ui.encodeUri = function (uri) {
      if (uri) {
        return encodeURIComponent(uri);
      }
    };

    ep.ui.decodeUri = function (uri) {
      if (uri) {
        return decodeURIComponent(uri);
      }
    };


    /*
     *
     *
     *   IO
     *
     *
     * */
    // io namespace
    // reserved for any io but simple jQuery ajax wrapper out of the gate
    ep.io.defaultAjaxModel = Backbone.Model.extend({
      defaults: {
        contentType: 'application/json',
        error: function(response) {
          try {
            this.customErrorFn(response);
          }
          finally {
            ep.logger.error('response code ' + response.status + ': ' + response.responseText);
          }
        },
        // FIXME use standard error function
        customErrorFn: function(response) {}
      }
    });


    // AJAX lives here!
    ep.io.ajax = function (ioObj) {
      var oAuthToken = getAuthToken();

      if (ioObj) {
        // if passed ajax request doesn't have an error handle function, use default below
        if (!ioObj.error) { // FIXME remove this if block after all ajax call use ajax model
          ioObj.error = function (response) {
            ep.logger.error('response code ' + response.status + ': ' + response.responseText);
          };
        }

        // if oAuthToken available, set it in request header, so current oAuthToken is passed to Cortex
        if (oAuthToken) {
          ioObj.beforeSend = function (request) {
            request.setRequestHeader("Authorization", oAuthToken);
          };
        }

        // if this is an authentication request do not care if valid oAuthToken is present
        // if this is an non-auth type request, make sure have valid oAuthToken, else get one
        if (oAuthToken || ioObj.authRequest) {
          $.ajax(ioObj);
        }
        else {
          Mediator.fire('mediator.getPublicAuthTokenRequest');
          ep.logger.warn('AJAX request attempt without tokens: ' + ioObj);
        }

      }
      else {
        ep.logger.error('AJAX request attempt without request body');
      }
    };


    EventBus.on('io.ajaxRequest', function (options) {
      if (options) {
        ep.io.ajax(options);
      }
    });

    /**
     * Get the context to prefix to cortex request url.
     * @returns {string}  cortex api context
     */
    ep.io.getApiContext = function () {
      var config = ep.app.config;
      var retVal = '';

      if (config && config.cortexApi && config.cortexApi.path) {
        retVal = '/' + config.cortexApi.path;
      }
      else {
        ep.logger.error('cortexApi context path is not defined.');
      }

      return retVal;
    };

    ep.io.localStore = window.localStorage;


    EventBus.on('app.authInit', function () {
      document.location.reload();
    });

    function getAuthToken() {
      var oAuthToken;

      // check and see if there is a local auth token
      // if yes, is it still valid
      if (ep.io.localStore) {
        // check for auth token
        oAuthToken = ep.io.localStore.getItem('oAuthToken');

        //if (!oAuthRole)
      }
      else {
        ep.logger.warn('check before cortex api call for auth token but local storage is not supported');
      }


      return oAuthToken;


    }


    var baseSync = Backbone.sync;
    Backbone.sync = function (method, model, options) {
      var isTokenDirty = false;
      options = options || {};
      options.error = function (data, response, options) {
        if (response.status === 401) {
          ep.logger.error('reponse error: ' + response.responseText + ' : ' + response.status);
          if (!isTokenDirty) {
            Mediator.fire('mediator.getPublicAuthTokenRequest');
          }
        }

        if (response.status === 403) {
          ep.logger.error('Please login to access the following content. ');
          ep.logger.error('Error ' + response.status + ': ' + response.responseText);

          Mediator.fire('mediator.getAuthentication');
        }
      };

      if (options.url) {

        // scrub out any absolute path (prior to /cortex) in the URL to avoid confusing the proxy
        // ie all requests are relative path
        var replaceUrl = options.url;
        var testPath = ep.io.getApiContext();
        var pathIndex = replaceUrl.indexOf(testPath);
        if (pathIndex > 0) {

          replaceUrl = replaceUrl.substring(pathIndex, replaceUrl.length);
          // ep.logger.info('YAUYAUYAP0SDFASDF   path: ' + replaceUrl);


        }
        options.url = replaceUrl;
      }


      options.headers = options.headers || {};

      var authToken = getAuthToken();
      if (authToken) {
        _.extend(options.headers, { 'Authorization': getAuthToken() });
//
//        ep.logger.info('SYNC REQUEST: ' + model + '   : ' + options);
        baseSync(method, model, options);
      }
      else {
        ep.logger.warn('Backbone sync called with no auth token');
        isTokenDirty = true;
        Mediator.fire('mediator.getPublicAuthTokenRequest');
      }


    };


    // logging utility
    ep.log = function () {
      ep.log.history = ep.log.history || [];   // store logs to an array for reference
      ep.log.history.push(arguments);
      if (window.console) {
        console.log(Array.prototype.slice.call(arguments));
      }
    };
    ep.logger = {};
    ep.logger.info = function () {
      if (ep.app.config.logging.logInfo) {
        var args = Array.prototype.slice.call(arguments);
        args.unshift('INFO: ');
        ep.log(args.join(' '));
      }
    };
    ep.logger.warn = function () {
      if (ep.app.config.logging.logWarnings) {
        var args = Array.prototype.slice.call(arguments);
        args.unshift('WARN: ');
        ep.log(args.join(' '));
      }
    };
    ep.logger.error = function () {
      if (ep.app.config.logging.logErrors) {
        var args = Array.prototype.slice.call(arguments);
        args.unshift('ERROR: ');
        ep.log(args.join(' '));
      }
    };

    /*
     * Is IUser
     * */
    ep.app.isUserLoggedIn = function () {
      var retVar = false;
      // check if there is an auth token
      if (ep.io.localStore.getItem('oAuthRole') && ep.io.localStore.getItem('oAuthRole') === 'REGISTERED') {
        retVar = true;
      }

      return retVar;
    };

    /*
     *
     * User Preferences
     *
     * */
    ep.app.getUserPref = function (prop) {
      // test if user pref exists
      var retVal = null;
      if (ep.io.localStore) {
        if (ep.io.localStore.getItem('epUserPrefs')) {
          ep.app.epUserPrefs = JSON.parse(ep.io.localStore.getItem('epUserPrefs'));
          if (ep.app.epUserPrefs[prop]) {
            return ep.app.epUserPrefs[prop];
          }
          else {
            return null;
          }
        }
      }
      return retVal;
    };
    ep.app.setUserPref = function (prop, val) {
      // test if user pref exists
      if (ep.io.localStore) {
        if (!ep.io.localStore.getItem('epUserPrefs')) {
          ep.io.localStore.setItem('epUserPrefs', '{}');
        }
        ep.app.epUserPrefs = JSON.parse(ep.io.localStore.getItem('epUserPrefs'));
        ep.app.epUserPrefs[prop] = val;
        ep.io.localStore.setItem('epUserPrefs', JSON.stringify(ep.app.epUserPrefs));
      }
      else {
        ep.logger.warn('attmempt to set user pref but localStorage not supported')
      }
      return val;
    };
    /*
     * end user prefs
     * */


    // bootstrap initialization complete (main.js)
    // time to start up the application
    EventBus.on('app.bootstrapInitSuccess', function () {
      // when ready start the router
      ep.app.addInitializer(function (options) {
        // do useful stuff here
        ep.router = new Router.AppRouter();

      });
      // wait until the application and DOM are spun up
      // then start the history manager
      ep.app.on("initialize:after", function () {
        if (Backbone.history) {
          //Backbone.history.start({ pushState: true });
          Backbone.history.start();
        }
      });

      EventBus.trigger('ep.startAppRequest');

    });

    EventBus.on('ep.startAppRequest', function () {
      // turn the key and give 'er some gass
      try {
        ep.app.start();
      }
      catch (e) {

      }
    });


    // recieves an object literal with refrence to
    // - region
    // - module
    // - view
    // - data (optional)
    var RegionContentLoaderRequest = function (req) {
      var that = this;
      that.region = req.region;
      that.module = req.module;
      that.view = req.view;
      that.data = req.data;
      that.callback = req.callback;

      require([that.module], function (mod) {
        var targetRegion = ep.app[that.region];
        try {
          targetRegion.show(mod[that.view](that.data));
          // fire the callback if there is one
          if (that.callback) {
            that.callback();
          }
          EventBus.trigger('layout.loadRegionContentSuccess');
        }
        catch (e) {
          ep.logger.error('Exception[' + that.module + '][' + that.view + ']: ' + e.message + ' : ' + e);
        }
      });
    };

    // listener for content loading requests
    EventBus.on('layout.loadRegionContentRequest', function (obj) {

      var localVar = obj;
      var loadRequest = new RegionContentLoaderRequest(localVar);

    });

    return ep;
  }
);
