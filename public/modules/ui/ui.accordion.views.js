/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.

 * User: sbrookes
 * Date: 28/05/13
 * Time: 8:13 AM
 *
 */
define(['app','eventbus','marionette'],
  function(App, EventBus, Marionette){

    _.templateSettings.variable = 'E';

    var uiAccordionItem = Backbone.Marionette.Layout.extend({
      template:'#UIAccordionItemTemplate',
      regions:{
        itemContentRegion:'div[data-region="accordionItemContentRegion"]'
      },
      attributes: function() {
        return{
          'class':'ui-accordion-item-container'
        };
      }
    });

    var uiAccordion = Backbone.Marionette.CompositeView.extend({
      template:'#UIAccordionTemplate',
      itemView: uiAccordionItem,
      itemViewContainer: 'section',
      attributes: function() {
        return{
          'class':'ac-container'
        };
      }
    });

    return{
      UIAccordion:uiAccordion
    };


  }
);
