/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 * 
 */
define(['app', 'eventbus', 'cortex', 'modules/item/item.models', 'modules/item/item.views', 'text!modules/item/item.templates.html'],
  function(App, EventBus, Cortex, Model, View, template){

    $('#TemplateContainer').append(template);

    _.templateSettings.variable = 'E';

    var init = function(){



    };



    return {
      init:init,
      ItemMediaModel:Model.ItemMedia,
      ItemPriceModel:Model.ItemPrice,
      ItemDefinitionModel:Model.ItemDefinition,
      ItemModel:Model.Item,
      ItemsModel:Model.Items

    };
  }
);
