/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 26/04/13
 * Time: 3:08 PM
 *
 */
define(['backbone','eventbus'],
  function(Backbone,EventBus){

    var DefaultSettingsView = Backbone.Marionette.ItemView.extend({
      template:'#SettingsModuleDefaultTemplate',
      tagName:'p'
    });
    var SettingsCSSTheme = Backbone.Marionette.Layout.extend({
      template:'#SettingsCSSTheme'
    });
    var DefaultSettingsLayout = Backbone.Marionette.Layout.extend({
      template:'#SettingsModuleDefaultLayoutTemplate',
      tagName:'div',
      className:'container'
    });
    return{
      DefaultHomeView:DefaultSettingsView,
      DefaultHomeLayout:DefaultSettingsLayout,
      SettingsCSSTheme:SettingsCSSTheme
    }
  }
);
