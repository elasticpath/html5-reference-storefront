/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 04/04/13
 * Time: 9:16 AM
 *
 */
define(['eventbus','marionette','ace'],
  function(EventBus,Marionette){

    var codeEditor = Backbone.Marionette.ItemView.extend({
      template:'#TestTest',
      initialize:function(){
        this.el.id = this.attributes.id;
      },
      onShow:function(){
        try{
          var editor = ace.edit(this.attributes.id);
          editor.setTheme("ace/theme/monokai");
          var mode = "ace/mode/javascript";
          editor.getSession().setMode(mode);

        }
        catch(e){
          EventBus.trigger('log.info',e.message);
        }
      }
    });


    return {
      CodeEditor:codeEditor
    };
  }
);
