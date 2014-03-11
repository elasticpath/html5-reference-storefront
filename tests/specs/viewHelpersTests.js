/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
define(function (require) {
  var i18n = require('i18n');
  var ep = require('ep');

  describe("View Helpers", function () {
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

          this.url = helpers.generateUrl('profile', undefined);
        });

        after(function () {
          ep.logger.warn.restore();
        });

        it('logs warning', function() {
          expect(ep.logger.warn).to.be.calledOnce;
        });
      });
    });

    describe('getUrlHash', function() {
      describe("given valid argument", function() {
        var anyValidKey = 'cart';

        before(function () {
          this.url = helpers.getUrlHash(anyValidKey);
        });

        it('returns a link', function () {
          var expected = ep.app.config.routes[anyValidKey];
          expect(this.url).to.be.equal(expected);
        });
      });

      describe('given no argument', function() {

        before(function () {
          sinon.stub(ep.logger, 'warn');

          this.url = helpers.getUrlHash(undefined);
        });

        after(function () {
          ep.logger.warn.restore();
        });

        it('logs warning', function() {
          expect(ep.logger.warn).to.be.calledOnce;
        });
      });
    });

    describe('generateNumericOptions', function () {
      describe('given valid arguments', function() {
        var range = 12;
        before(function () {
          this.result = helpers.generateNumericOptions(1, range);
          $("#Fixtures").append(this.result);

        });

        after(function () {
          delete(this.result);
          $("#Fixtures").empty();
        });

        it('creates correct number of options', function () {
          expect($('#Fixtures option')).to.have.length(range);
        });
      });

      describe('given invalid arguments', function() {
        before(function () {
          sinon.stub(ep.logger, 'warn');

          this.result = helpers.generateNumericOptions(undefined, undefined);
        });

        after(function () {
          ep.logger.warn.restore();
          delete(this.result);
        });

        it('logs warning', function() {
          expect(ep.logger.warn).to.be.calledOnce;
        });

        it('return empty String', function() {
          expect(this.result).to.be.a('string');
        });

      });
    });

    describe('getButtonDisabledAttr', function() {
      afterEach(function() {
        delete(this.retVal);
      });
      describe('When called with a function that returns false', function() {
        before(function() {
          this.retVal = helpers.getButtonDisabledAttr(function() {
            return false;
          });
        });
        it('returns a constructed disabled attribute', function() {
          expect(this.retVal).to.be.equal('disabled="disabled"');
        });
      });
      describe('When called with a function that returns true', function() {
        before(function() {
          this.retVal = helpers.getButtonDisabledAttr(function() {
            return true;
          });
        });
        it('returns an empty string', function() {
          expect(this.retVal).to.be.equal('');
        });
      });
    });
  });

});