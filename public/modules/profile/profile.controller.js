/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 * 
 */
define(['ep','app', 'eventbus', 'cortex', 'profile.models', 'profile.views', 'text!modules/profile/profile.templates.html'],
  function(ep, App, EventBus, Cortex, Model, View, template){

    $('#TemplateContainer').append(template);

    _.templateSettings.variable = 'E';

    var defaultView = function(){
      var defaultLayout = new View.DefaultLayout();

      var profileModel = new Model.ProfileModel();

      var profileSummaryRegion = new Marionette.Region({
        el:'[data-region="profileSummaryRegion"]'
      });
      var profilePaymentMethodsRegion = new Marionette.Region({
        el:'[data-region="profilePaymentMethodsRegion"]'
      });
      var profileSubscriptionSummaryRegion = new Marionette.Region({
        el:'[data-region="profileSubscriptionSummaryRegion"]'
      });
      var profileSummaryView = new View.ProfileSummaryView({
        model:profileModel
      });
      var profileTitleView =new View.ProfileTitleView({});


      profileModel.fetch({
        success:function(response){
          // Profile Title

          defaultLayout.profileTitleRegion.show(profileTitleView);

          // Profile Summary
          profileSummaryRegion.show(profileSummaryView);

          // Profile Subscriptions
          var profileSubs = profileModel.get('subscriptions');
          if (profileSubs){
            profileSubscriptionSummaryRegion.show( new View.ProfileSubscriptionSummaryView({
              collection:new Backbone.Collection(profileModel.get('subscriptions'))
            }));
          }

          // Profile Payment Methods
          profilePaymentMethodsRegion.show( new View.PaymentMethodsView({
            collection:new Backbone.Collection(profileModel.get('paymentMethods'))
          }));

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
