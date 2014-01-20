/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 */
define(function (require) {

  describe("View  Helpers", function () {
    var helpers = require('viewHelpers');
    var i18n = require('i18n');

    describe('helper: getI18nLabel', function () {
      var key = 'testKey';
      before(function () {
        sinon.spy(i18n, 't');
        helpers.getI18nLabel(key);
      });

      after(function () {
        i18n.t.restore();
      });

      it('calls i18n to translate message key', function () {
        expect(i18n.t).to.be.calledWithExactly(key);
      });

    });
  });

});