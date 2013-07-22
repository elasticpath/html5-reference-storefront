/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.

 * User: sbrookes
 * Date: 19/06/13
 * Time: 3:27 PM
 *
 */
define(function(require) {
  var accordion = require('uiaccordion');
  var modal = require('uimodal');
  var form = require('uiform');

  describe(' UI Modules Init', function(){
    it('UI Form Index View should exist', function(){
      var formComp = form.IndexView();
      expect(formComp).to.be.ok;
    });
    it('UI Form should exist', function(){
      var formComp = form.UIForm();
      expect(formComp).to.be.ok;
    });
    it('UI Accordion should exist', function(){
      var accordionComp = new accordion.UIAccordion();
      expect(accordionComp).to.be.ok;
    });
    it('UI Form Button should exist', function(){
      var formComp = form.UIButton();
      expect(formComp).to.be.ok;
    });
    it('UI Form Text should exist', function(){
      var formComp = form.UIFormText();
      expect(formComp).to.be.ok;
    });
    it('UI Form Input should exist', function(){
      var formComp = form.UIInput();
      expect(formComp).to.be.ok;
    });
    it('UI Form Label should exist', function(){
      var formComp = form.UILabel();
      expect(formComp).to.be.ok;
    });
    it('UI Form Item should exist', function(){
      var formComp = form.UIFormItem();
      expect(formComp).to.be.ok;
    });
    it('UI Form ItemList should exist', function(){
      var formComp = form.UIFormItemList();
      expect(formComp).to.be.ok;
    });
  });
  // TODO finish the modal window integration
//  describe('UI Modal Init', function(){
//    it('should exist', function(){
//      var modalComp = modal.ModalRegion();
//      expect(modalComp).to.be.ok;
//    });
//  });

});
