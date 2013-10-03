/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.

 * User: sbrookes
 * Date: 28/05/13
 * Time: 8:13 AM
 *
 */
define(['app','eventbus','backbone'],
  function(App, EventBus, Backbone){

    var uiAccordionItem = Backbone.Model.extend({});

    return {
      UIAccordionItem:uiAccordionItem
    };

  }
);
