/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 * Controller DefaultView Test Helpers
 */

define(function (require) {
  var Marionette = require('marionette');

  var renderTestFlag = false;
  var modelTestFlag = false;

  var testDouble = Marionette.ItemView.extend({
    render: function () {
      renderTestFlag = true;

      if (this.model) {
        modelTestFlag = true;
      }
    }
  });

  function wasRendered() {
    return renderTestFlag;
  }

  function hasAModel() {
    return modelTestFlag;
  }

  return {
    testDouble: testDouble,
    wasRendered: wasRendered,
    hasAModel: hasAModel
  };
});