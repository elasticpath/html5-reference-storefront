/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 */
define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('backbone');
    var Marionette = require('marionette');
    var Modernizr = require('modernizr');

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
      return Modernizr.touch;
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
        // FIXME [CU-88] use standard error function
        customErrorFn: function(response) {}
      }
    });


    // AJAX lives here!
    ep.io.ajax = function (ioObj) {
      var oAuthToken = getAuthToken();

      if (ioObj) {
        // if passed ajax request doesn't have an error handle function, use default below
        if (!ioObj.error) { // FIXME [CU-88] remove this if block after all ajax call use ajax model
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
          ep.logger.warn('AJAX request attempt without tokens: ' + JSON.stringify(ioObj));
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
        /**
         * In some scenarios (e.g. PhoneGap apps), the path to the Cortex API (as defined in ep.config.json) will not be
         * a relative string like "integrator" but an absolute path like "http://54.200.118.70:13080/integrator"
         *
         * Only prepend the Cortex API path with a forward-slash if it is a relative path (does not start with 'http')
         */
        if (/^http/.test(config.cortexApi.path)) {
          retVal = config.cortexApi.path;
        } else {
          retVal = '/' + config.cortexApi.path;
        }
      }
      else {
        ep.logger.error('cortexApi context path is not defined.');
      }

      return retVal;
    };

    ep.io.localStore = window.localStorage;

    ep.io.sessionStore = window.sessionStorage;

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
          ep.logger.error('response error: ' + response.responseText + ' : ' + response.status);
          if (!isTokenDirty) {
            Mediator.fire('mediator.getPublicAuthTokenRequest');
          }
        }

        if (response.status === 403) {
          // If 403 errors are used in future when logged in users do not have the correct permissions to
          // access a particular resource, a more granular handler for this error will be required.
          ep.logger.error('Please login to access the following content. Error ' + response.status + ': ' + response.responseText);

          Mediator.fire('mediator.getAuthentication');
        }

        ep.logger.error('response error: ' + response.responseText + ' : ' + response.status);
      };

      if (options.url) {

        // scrub out any absolute path (prior to /cortex) in the URL to avoid confusing the proxy
        // ie all requests are relative path
        var replaceUrl = options.url;
        var testPath = ep.io.getApiContext();
        var pathIndex = replaceUrl.indexOf(testPath);
        if (pathIndex > 0) {
          replaceUrl = replaceUrl.substring(pathIndex, replaceUrl.length);
        }
        options.url = replaceUrl;
      }


      options.headers = options.headers || {};

      var authToken = getAuthToken();
      if (authToken) {
        _.extend(options.headers, { 'Authorization': getAuthToken() });
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

    // Load the spin.js library that provides the default activity indicators.
    require('spin');
    // Load an extended version of jQuery.spin.js that includes a loading overlay.
    require('jquerySpin');
    /**
     * Adds an activity indicator to a DOM element associated with a given Marionette view.
     *
     * Can apply the indicator to the view's DOM element (Marionette.View.$el) or to a given
     * jQuery object specified using the ui hash of the view (ui.activityIndicatorEl).
     *
     * By default, uses the spin.js (http://fgnass.github.io/spin.js/) library.
     * @param view A Marionette.View object
     */
    ep.ui.startActivityIndicator = function(view, option) {
      if (!view) {
        ep.logger.error('missing view to startActivityIndicator');
        return;
      }

      if (view.ui && view.ui.activityIndicatorEl) {
        view.ui.activityIndicatorEl.spin(option);
      } else {
        view.$el.spin(option);
      }
    };

    /**
     * Removes an activity indicator from a DOM element associated with a given Marionette view.
     *
     * Removes the indicator from the jQuery object specified in the ui hash of the view (ui.activityIndicatorEl)
     * or from the view's DOM element (Marionette.View.$el).
     * @param view A Marionette.View object
     */
    ep.ui.stopActivityIndicator = function(view) {
      if (!view) {
        ep.logger.error('missing view to startActivityIndicator');
        return;
      }

      if (view.ui && view.ui.activityIndicatorEl) {
        view.ui.activityIndicatorEl.spin(false);
      } else {
        view.$el.spin(false);
      }
    };

    /**
     * Get a jQuery object from a given Marionette.View and ui hash element name.
     * @param {Marionette.View} a Marionette View with a ui hash
     * @param elementName the name assigned to the element in the view's ui hash
     * @returns the jQuery object or null
     */
    ep.ui.getUIElementFromView = function (view, elementName) {
      if ((view && elementName) && (view.ui && _.has(view.ui, elementName))) {
        return view.ui[elementName];
      }
      return null;
    };

    /**
     * Disables a button element in the given view by setting its disabled property
     * and adding a spinner activity indicator to it.
     * @param view {Marionette.View} A Marionette View with a ui hash in which the button element is defined.
     * @param buttonElementName {String} The name of the button element as it appears in the ui hash of the view.
     */
    ep.ui.disableButton = function (view, buttonElementName) {
      var $button = ep.ui.getUIElementFromView(view, buttonElementName);
      if ($button) {
        // Set the button's disabled property
        $button.prop('disabled', true);

        // Use the jQuery spin plugin to apply an activity indicator to the button
        $button.spin({
          // These settings generate a small loading indicator without an overlay
          lines: 8, length: 4, width: 3, radius: 5, zIndex: 1000, overlay: false
        });
      } else {
        ep.logger.error('disableButton function called without a valid view and button');
      }
    };

    /**
     * Enables a button element in the given view by removing its disabled property
     * and removing a spinner activity indicator from it.
     * @param view {Marionette.View} A Marionette View with a ui hash in which the button element is defined.
     * @param buttonElementName {String} The name of the button element as it appears in the ui hash of the view.
     */
    ep.ui.enableButton = function (view, buttonElementName) {
      var $button = ep.ui.getUIElementFromView(view, buttonElementName);
      if ($button) {
        // Set the button's disabled property
        $button.prop('disabled', false);

        // Use the jQuery spin plugin to apply an activity indicator to the button
        $button.spin(false);
      } else {
        ep.logger.error('enableButton function called without a valid view and button');
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
        ep.logger.warn('attempt to set user pref but localStorage not supported');
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
