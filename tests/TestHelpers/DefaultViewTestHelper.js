/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 * Controller DefaultView Test Helpers
 */

define(function (require) {
  var Marionette = require('marionette');

  var testDouble = function() {
    var renderTestFlag = false;
    var modelTestFlag = false;
    var collectionTestFlag = false;

    function wasRendered() {
      return renderTestFlag;
    }

    function hasAModel() {
      return modelTestFlag;
    }

    function hasACollection() {
      return collectionTestFlag;
    }

    function renderMock() {
      renderTestFlag = true;

      if (this.model) {
        modelTestFlag = true;
      }

      if (this.collection) {
        collectionTestFlag = true;
      }
    }

    var itemView = Marionette.ItemView.extend({
      render: renderMock
    });

    return {
      View: itemView,

      wasRendered: wasRendered,
      hasAModel: hasAModel,
      hasACollection: hasACollection
    };
  };

  return {
    TestDouble: testDouble
  };
});