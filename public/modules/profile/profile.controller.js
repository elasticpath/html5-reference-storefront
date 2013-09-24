/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 * 
 */
define(['ep','app', 'eventbus', 'cortex', 'modules/profile/profile.models', 'modules/profile/profile.views', 'text!modules/profile/profile.templates.html'],
  function(ep, App, EventBus, Cortex, Model, View, template){

    $('#TemplateContainer').append(template);

    _.templateSettings.variable = 'E';

    var defaultView = function(){
      var defaultLayout = new View.DefaultLayout();

      var profileModel = new Model.ProfileModel();

      var profileSummaryRegion = new Marionette.Region({
        el:'[data-region="profileSummaryRegion"]'
      });
      var profileSummaryView = new View.ProfileSummaryView({
        model:profileModel
      });

      profileModel.fetch({
        success:function(response){
          profileSummaryRegion.show(profileSummaryView);

        },
        error:function(response){
          ep.logger.error('Error getting profile subscription model');
        }
      });

      return defaultLayout;

    };



    return {
      DefaultView:defaultView

    };
  }
);
