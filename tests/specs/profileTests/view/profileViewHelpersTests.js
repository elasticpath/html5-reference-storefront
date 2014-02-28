/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 * Functional Storefront Unit Test - Profile Views
 */
define(function (require) {
  var ep = require('ep');
  var utils = require('utils');

  var views = require('profile.views');
  var viewHelpers = views.__test_only__.viewHelpers;
  var template = require('text!modules/base/profile/base.profile.templates.html');

  describe("Profile Module: helper functions", function() {
    var StandardProfileInfoModel = Backbone.Model.extend({
      defaults: {
        givenName: 'ben',
        familyName: 'boxer',
        actionLink: 'fakeActionLink'
      }
    });

    describe('viewHelpers functions', function() {

      describe('getDate', function() {
        describe('given an date object', function() {
          var dateObj = {
            displayValue: 'fakeDateDisplayValue'
          };
          before(function() {
            this.result = viewHelpers.getDate(dateObj);
          });

          after(function() {
            delete(this.result);
          });

          it('returns the date display value', function() {
            expect(this.result).to.be.equal(dateObj.displayValue);
          });
        });
        describe('given no input', function() {
          before(function() {
            this.result = viewHelpers.getDate(undefined);
          });

          after(function() {
            delete(this.result);
          });

          it('returns an empty string', function() {
            expect(this.result).to.be.a('String');
          });
        });
      });

      describe('getTotal', function() {
        describe('given an date object', function() {
          var dateObj = {
            display: 'fakeValue'
          };
          before(function() {
            this.result = viewHelpers.getTotal(dateObj);
          });

          after(function() {
            delete(this.result);
          });

          it('returns the display value', function() {
            expect(this.result).to.be.equal(dateObj.display);
          });
        });
        describe('given no input', function() {
          before(function() {
            this.result = viewHelpers.getDate(undefined);
          });

          after(function() {
            delete(this.result);
          });

          it('returns an empty string', function() {
            expect(this.result).to.be.a('String');
          });
        });
      });

    });

    describe("translateSummaryFormErrorMessage function", function() {
      before(function() {
        sinon.stub(utils, 'translateErrorMessage');

        views.translateSummaryFormErrorMessage("some error message");
      });

      after(function() {
        utils.translateErrorMessage.restore();
      });

      it("calls the utils translateErrorMessage function", function() {
        expect(utils.translateErrorMessage).to.be.calledOnce;
      });
    });

    describe("getSummaryFormValue function", function() {
      before(function() {
        $("#Fixtures").append(template);
        $("#Fixtures").append('<div id="renderedView"></div>');

        this.model = new StandardProfileInfoModel();
        var summaryFormView = new views.ProfileSummaryFormView({
          model: this.model
        });
        $("#renderedView").append(summaryFormView.render().$el);

        this.result = views.getSummaryFormValue();
      });

      after(function() {
        $("#Fixtures").empty();
      });

      it("returns family-name with value corresponding to form input", function() {
        expect(this.result["family-name"]).to.be.equal(this.model.get("familyName"));
      });

      it("returns given-name with value corresponding to form input", function() {
        expect(this.result["given-name"]).to.be.equal(this.model.get("givenName"));
      });
    });
  });

});