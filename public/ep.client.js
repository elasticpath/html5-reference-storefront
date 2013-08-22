/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 02/04/13
 * Time: 8:25 AM
 *
 */
define(['jquery','underscore','backbone','marionette','eventbus','router', 'text!ep.config.json', 'jsonpath','modernizr'],
  function( $, _, Backbone, Marionette, EventBus, Router, config) {

    // root application namespace
    var ep = {};
    ep.ui = {};
    ep.io = {};
    ep.app = new Backbone.Marionette.Application();



    // presentation dom container region
    ep.app.addRegions({
      viewPortRegion:'[data-region="viewPortRegion"]'
    });
    ep.app.config = JSON.parse(config);
    //ep.app.config.cortexApi = config.cortexApi;

    ep.app.deployMode = function(){
      return ep.app.config.deployMode || 'development';
    };
    ep.app.showInstrumentation = function(){
      return ep.app.config.debug.showInstrumentation || false;
    };
    // experimental hook

    // determine if touch enabled
    ep.ui.touchEnabled = function(){
      // logic to return if this is a touch interface
      if (Modernizr.touch){
        return true;
      }
      return false;
    };
    ep.ui.localStorage = function(){
      if (Modernizr.localstorage){
        return true;
      }
      return false;
    };
    ep.ui.encodeUri = function(uri){
      if (uri){
        return encodeURIComponent(uri);
      }
    };
    ep.ui.decodeUri = function(uri){
      if (uri){
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

    // AJAX lives here!
    ep.io.ajax = function(ioObj){
      ep.logger.info('|----------------------------');
      ep.logger.info('|');
      ep.logger.info('|');
      ep.logger.info('|');
      ep.logger.info('|     AJAX CALL - CHECK TOKENS');
      ep.logger.info('|');
      ep.logger.info('|');
      ep.logger.info('|');
      ep.logger.info('|------------------------------');
      var oAuthToken = window.localStorage.getItem('oAuthToken');

      if (ioObj && oAuthToken){
        // check if there is an ajax request type and other properties
        // make sure the required parameters (url and type are there )
        ioObj.beforeSend = function(request){
          request.setRequestHeader("Authorization", oAuthToken);
        };
        $.ajax(ioObj);
      }
      else{
        generatePublicAuth();
        ep.logger.warn('AJAX request attempt without tokens: ' + ioObj);
      }
    };
    EventBus.on('io.ajaxRequest',function(options){
      if (options){
        ep.io.ajax(options);
      }
    });
    ep.io.getApiUrl = function(){
      var config = ep.app.config.cortexApi;
      var retVal;
      if (config.host){
        retVal = config.host;
      }
      if (config.port){
        retVal += ':' + config.port;
      }
      retVal += '/' + ep.app.config.cortexApi.path;
      return retVal;
    };


    EventBus.on('app.authInit',function(){
      document.location.reload();

    });

    function generatePublicAuth(){
      var authString = 'grant_type=password&scope=mobee&role=PUBLIC';
//      authString += '&scope=' + authScope + '&role=' + authRole

      $.ajax({
        type:'POST',
        url:'/' + ep.app.config.cortexApi.path + '/oauth2/tokens',

        contentType: 'application/x-www-form-urlencoded',
        data:authString,
        success:function(json, responseStatus, xhr){
          // $('#authHeader').val("Bearer " + json.access_token);
          //cortex.ui.saveField('authHeader');
          window.localStorage.setItem('oAuthRole', 'PUBLIC');
          window.localStorage.setItem('oAuthScope', ep.app.config.cortexApi.store);
          window.localStorage.setItem('oAuthToken', 'Bearer ' + json.access_token);

          //if (authRole === 'PUBLIC') {
          window.localStorage.setItem('oAuthUserName', 'Anonymous');
          // } else {
          //  window.localStorage.setItem('oAuthUserName', userName);
          //}
          EventBus.trigger('app.authInit');
        },
        error:function(response){

          ep.logger.error('ERROR generating public auth token: ' + response);
        }
      });
    }


    function getAuthToken(){
      var oAuthRole;
      var oAuthUserName;
      var oAuthToken;

      // check and see if there is a local auth token
      // if yes, is it still valid
      // if not generate a public one
      if (ep.ui.localStorage){
        // check for auth token
        oAuthRole = window.localStorage.getItem('oAuthRole');
        oAuthUserName = window.localStorage.getItem('oAuthUserName');
        oAuthToken = window.localStorage.getItem('oAuthToken');

        //if (!oAuthRole)
      }
      else{
        ep.logger.warn('check before cortex api call for auth token but local storage is not supported');
      }


      return oAuthToken;


    }


    var baseSync = Backbone.sync;
    Backbone.sync = function(method, model, options) {
      var isTokenDirty = false;
      options = options || {};
      options.error = function(data, response, options){
        if (response.status === 401){
          ep.logger.error('reponse error: ' + response.responseText + ' : ' + response.status);
          if (!isTokenDirty){
            generatePublicAuth();
          }

        }
      };
      ep.logger.info('|----------------------------');
      ep.logger.info('|');
      ep.logger.info('|');
      ep.logger.info('|');
      ep.logger.info('|     BACKBONE SYNC  - CHECK TOKENS');
      ep.logger.info('|');
      ep.logger.info('|');
      ep.logger.info('|');
      ep.logger.info('|------------------------------');
      if (options.url){

        // scrub out any absolute path (prior to /cortex) in the URL to avoid confusing the proxy
        // ie all requests are relative path
        var replaceUrl = options.url;
        var testPath = '/' + ep.app.config.cortexApi.path;
        var pathIndex = replaceUrl.indexOf(testPath);
        if (pathIndex > 0){

          replaceUrl = replaceUrl.substring(pathIndex,replaceUrl.length);
          // ep.logger.info('YAUYAUYAP0SDFASDF   path: ' + replaceUrl);


        }
        options.url = replaceUrl;
      }


      options.headers = options.headers || {};

      var authToken = getAuthToken();
      if (authToken){
        _.extend(options.headers, { 'Authorization': getAuthToken() });

        ep.logger.info('SYNC REQUEST: ' + model + '   : ' + options);
        baseSync(method, model, options);
      }
      else{
        ep.logger.warn('Backbone sync called with no auth token');
        isTokenDirty = true;
        generatePublicAuth();
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
    ep.logger.info = function(){
      if (ep.app.config.logging.logInfo){
        var args = Array.prototype.slice.call(arguments);
        args.unshift('INFO: ');
        ep.log(args.join(' '));
      }
    };
    ep.logger.warn = function(){
      if (ep.app.config.logging.logWarnings){
        var args = Array.prototype.slice.call(arguments);
        args.unshift('WARN: ');
        ep.log(args.join(' '));
      }
    };
    ep.logger.error = function(){
      if (ep.app.config.logging.logErrors){
        var args = Array.prototype.slice.call(arguments);
        args.unshift('ERROR: ');
        ep.log(args.join(' '));
      }
    };

    /*
    *
    * User Preferences
    *
    * */
    ep.app.getUserPref = function(prop){
      // test if user pref exists
      var retVal = null;
      if (ep.ui.localStorage()){
        if (localStorage.getItem('epUserPrefs')){
          ep.app.epUserPrefs = JSON.parse(localStorage.getItem('epUserPrefs'));
          if (ep.app.epUserPrefs[prop]){
            return ep.app.epUserPrefs[prop];
          }
          else{
            return null;
          }
        }
      }
      return retVal;
    };
    ep.app.setUserPref = function(prop,val){
      // test if user pref exists
      if (ep.ui.localStorage()){
        if (!localStorage.getItem('epUserPrefs')){
          localStorage.setItem('epUserPrefs','{}');
        }
        ep.app.epUserPrefs = JSON.parse(localStorage.getItem('epUserPrefs'));
        ep.app.epUserPrefs[prop] = val;
        localStorage.setItem('epUserPrefs',JSON.stringify(ep.app.epUserPrefs));
      }
      else{
        ep.logger.warn('attmempt to set user pref but localStorage not supported')
      }
      return val;
    };
    /*
    * end user prefs
    * */


     // bootstrap initialization complete (main.js)
    // time to start up the application
    EventBus.on('app.bootstrapInitSuccess',
      function(){
        // when ready start the router
        ep.app.addInitializer(function(options){
          // do useful stuff here
          ep.router = new Router.AppRouter();
         // ep.app.config = {};
          ep.app.config.url = ep.app.config.api.url;
          ep.app.config.store = ep.app.config.api.store;

        });
        // wait until the application and DOM are spun up
        // then start the history manager
        ep.app.on("initialize:after", function(){
          if (Backbone.history){
            //Backbone.history.start({ pushState: true });
            Backbone.history.start();
          }
        });


        /*
        *
        * UI related calculations and methods
        *
        * */
        var rem = (function rem() {
          var html = document.getElementsByTagName('html')[0];

          return function () {
            return parseInt(window.getComputedStyle(html)['fontSize']);
          };
        }());
        // This function will convert pixel to rem
        function toRem(length) {
          return (parseInt(length) / rem());
        }

        ep.ui.getRenderProfile = function(){
          var curRemWidth = ep.ui.remWidth();
          switch (true){
            case (curRemWidth < 31):
              // phone
              return 'phone';
              break;

            case (curRemWidth > 30 && curRemWidth < 46):
              // mini tab
              return 'tab';
              break;

            case (curRemWidth > 45 && curRemWidth < 64):
              // tablet
              return 'ltab';
              break;

            case (curRemWidth > 63):
              // tablet landscape
              return 'full';
              break;

            default:
              break;
          }

        };
        ep.ui.remWidth = function(){
          var pxWidth = $(window).width();
          return toRem(pxWidth);
        };
        ep.ui.width = function(){
          var pxWidth = $(window).width();
          return pxWidth;
        };
        ep.ui.screenwidth = function(){
          var pxWidth = window.screen.width();
          return pxWidth;
        };
        ep.ui.ppi = function(){
          var dpr = 1;
          if(window.devicePixelRatio !== undefined) {
            dpr = window.devicePixelRatio;
          }
          return dpr;
        };
        $(window).resize(function() {
          EventBus.trigger('layout.windowResized',ep.ui.remWidth());
        });




        EventBus.trigger('ep.startAppRequest');



      }
    );

    EventBus.on('ep.startAppRequest', function(){
      // turn the key and give 'er some gass
      try{
        ep.app.start();
      }
      catch(e){

      }
    });















    // recieves an object literal with refrence to
    // - region
    // - module
    // - view
    // - data (optional)
    var RegionContentLoaderRequest = function(req){
      var that = this;
      that.region = req.region;
      that.module = req.module;
      that.view = req.view;
      that.data = req.data;
      that.callback = req.callback;

      require([that.module],function(mod){
        var targetRegion = ep.app[that.region];
        try{
          targetRegion.show(mod[that.view](that.data));
          // fire the callback if there is one
          if (that.callback){
            that.callback();
          }
          EventBus.trigger('layout.loadRegionContentSuccess');
        }
        catch(e){
          ep.logger.error('Exception['+that.module+']['+that.view+']: '+e.message + ' : ' + e);
        }
      });
    };

    // listener for content loading requests
    EventBus.on('layout.loadRegionContentRequest',function(obj){

      var localVar = obj;
      var loadRequest = new RegionContentLoaderRequest(localVar);

    });

    return ep;
  }
);
