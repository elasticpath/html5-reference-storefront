/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 26/04/13
 * Time: 3:07 PM
 *
 */
define(['ep','eventbus','user.views','user.models','text!modules/base/user/user.templates.html'],
  function(ep,EventBus,View,Model,template){

    $('#TemplateContainer').append(template);

    _.templateSettings.variable = 'E';


    return {
      ProfileView:profileView
    };
  }
);
