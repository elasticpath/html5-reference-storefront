/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 */
define(function (require) {
  var i18n = require('i18n');
  var ep = require('ep');

  describe("View  Helpers", function () {
    var helpers = require('viewHelpers');

    describe('getI18nLabel', function () {
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

    describe('getStatusDisplayText', function () {
      var key = 'testKey';
      before(function () {
        sinon.spy(i18n, 't');
        helpers.getStatusDisplayText(key);
      });

      after(function () {
        i18n.t.restore();
      });

      it('calls i18n to translate message key', function () {
        expect(i18n.t).to.be.calledWithExactly('purchaseStatus.' + key);
      });

    });

    describe('generateUrl', function () {
      describe("given valid arguments", function() {
        var key = 'cart';
        var href = 'testCortexResourceHref';

        before(function () {
          sinon.stub(ep.ui, 'encodeUri', function(href) { return 'encoded' + href; });

          this.url = helpers.generateUrl(key, href);
        });

        after(function () {
          ep.ui.encodeUri.restore();
        });

        it('generate href', function () {
          var expected = ep.app.config.routes[key] + '/' + 'encoded' + href;
          expect(this.url).to.be.equal(expected);
        });
      });

      describe('given invalid arguments', function() {

        before(function () {
          sinon.stub(ep.logger, 'warn');

          this.url = helpers.generateUrl(undefined, undefined);
        });

        after(function () {
          ep.logger.warn.restore();
        });

        it('logs warning', function() {
          expect(ep.logger.warn).to.be.calledOnce;
        });

        it('return empty String', function() {
          expect(this.url).to.be.a('string');
        });

      });
    });

    describe('getLink', function() {
      describe("given valid argument", function() {
        var anyValidKey = 'cart';

        before(function () {
          this.url = helpers.getLink(anyValidKey);
        });

        it('returns a link', function () {
          var expected = ep.app.config.routes[anyValidKey];
          expect(this.url).to.be.equal(expected);
        });
      });

      describe('given no argument', function() {

        before(function () {
          sinon.stub(ep.logger, 'warn');

          this.url = helpers.getLink(undefined);
        });

        after(function () {
          ep.logger.warn.restore();
        });

        it('logs warning', function() {
          expect(ep.logger.warn).to.be.calledOnce;
        });
      });
    });
  });

});