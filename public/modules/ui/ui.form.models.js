/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 06/05/13
 * Time: 7:59 AM
 *
 */
define(['app','eventbus','backbone'],
  function(App, EventBus, Backbone){

    var uiButton = Backbone.Model.extend({});

    var formItemTypeCollection = Backbone.Collection.extend([
      {
        name:'text',
        tagName:'input',
        attributes:[
          {
            name:'type',
            value:'text'
          }
        ]
      },
      {
        name:'number',
        tagName:'input',
        attributes:[
          {
            name:'type',
            value:'number'
          }
        ]
      },
      {
        name:'textarea',
        tagName:'textarea'
      },
      {
        name:'button',
        tagName:'button'
      }
    ]);


    return {
      UIButton:uiButton,
      FormItemTypeCollection:formItemTypeCollection
    };

  }
);
