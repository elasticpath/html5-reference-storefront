/**
 * Controller DefaultView Test Helpers
 */

define(function (require) {
  var Marionette = require('marionette');

  var renderTestFlag = false;

  var testDouble = Marionette.ItemView.extend({
    render: function () {
      renderTestFlag = true;
    }
  });

  function wasRendered() {
    return renderTestFlag;
  }

  return {
    testDouble: testDouble,
    wasRendered: wasRendered
  };
});