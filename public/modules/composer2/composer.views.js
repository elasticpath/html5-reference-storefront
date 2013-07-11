/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 06/05/13
 * Time: 7:32 AM
 *
 */
define(['app','eventbus','marionette','contextmenu'],
  function(App, EventBus, Marionette){


    var indexView = Backbone.Marionette.CompositeView.extend({
        template:'#ComposerIndexTemplate'

      }
    );

    //
    //  ACE EDITOR
    //
    var codeEditor = Backbone.Marionette.ItemView.extend({
      template:'#CodeEditorTemplate',
      onShow:function(event){
        var editor = ace.edit("editor");
        editor.setTheme("ace/theme/monokai");
        editor.getSession().setMode("ace/mode/javascript");
      }
    });

    // Layout Chooser Accordion
    var layoutChooser = Backbone.Marionette.ItemView.extend({
        template:'#LayoutChooserTemplate'
      }
    );
    // Form Chooser Accordion
    var formChooser = Backbone.Marionette.ItemView.extend({
        template:'#FormChooserTemplate'
      }
    );
    // View Chooser Accordion
    var viewChooser = Backbone.Marionette.ItemView.extend({
        template:'#ViewChooserTemplate'
      }
    );


    //
    //  Composer View MasterLayout
    //
    var indexDefaultLayout = Backbone.Marionette.Layout.extend({
      template:'#ComposerIndexLayoutTemplate',
      regions:{
        container:'.view-index',
        viewMenuRegion:'[data-region="ViewMenuRegion"]',
        formMenuRegion:'[data-region="FormMenuRegion"]',
        layoutMenuRegion:'[data-region="LayoutMenuRegion"]',
        codeEditorRegion:'composer-editor-container'
      },
      onShow:function(event){
//                var drop = document.getElementById('DropZone');
//                drop.ondrop = function (event){
//                    this.innerHTML += '<p>' + event.dataTransfer.getData('Text') + '</p>';
//                };
//                drop.ondragover = function () { return false;};

        $('.nav-tabs').tabs();
        //
        //  CONTEXT MENUS
        //
        //
        $('section[data-menu="form"] :checkbox').click(function(event){
          EventBus.trigger('log.info','form checkbox');

        });
        $('section[data-menu="views"] :checkbox').click(function(event){
          EventBus.trigger('log.info','views checkbox');
          $('.ac-container .row').contextmenu({'view option 1':func1,
              'view option 2':func2},
            'right');
        });
        $('section[data-menu="layouts"] :checkbox').click(function(event){
          EventBus.trigger('log.info','layouts checkbox');
          $('.ac-container .row').contextmenu({'layouts option 1':func1,
              'layouts option 2':func2},
            'right');
        });


        // dragstart
        $('[draggable="true"]').on('dragstart',function(event){
          EventBus.trigger('log.info','dragstart target: ' + event.target);
          var t = $(event.target).data('element');
          EventBus.trigger('log.info',t);
          event.originalEvent.dataTransfer.setData('text/plain', JSON.stringify({element:t}));
        });

        // drop
        var drop = $('#DropZone')[0];
        drop.ondrop = function (event){
          var data = JSON.parse(event.dataTransfer.getData('text/plain'));
          this.innerHTML += '<div class="test-layout" draggable="true" data-element="target-element" data-region-type="' + data.element + '">' + data.element + '</div>';
          $('.test-layout')[0].ondrop= function(event){
            EventBus.trigger('log.info','great news its working');
          };

        };

        // dragover
        drop.ondragover = function () { return false;};
      }

    });

    function func1(){
      EventBus.trigger('log.info','func1');
    }
    function func2(){
      EventBus.trigger('log.info','func2');
    }





    <!-- obsolete -->
    var cssAccordionDemoView = Backbone.Marionette.ItemView.extend({
        template:'#AccordionDemoTemplate'
      }
    );

    return {
      IndexView:indexView,
      IndexLayout:indexDefaultLayout,
      CssAccordionDemoView:cssAccordionDemoView,
      LayoutChooser:layoutChooser,
      FormChooser:formChooser,
      ViewChooser:viewChooser,
      CodeEditor:codeEditor

    };



  }
);
