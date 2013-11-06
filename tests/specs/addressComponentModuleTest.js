/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.
 */

define(function (require) {
  var Backbone = require('backbone');

  describe("UI Storefront Address Component Module", function () {

    describe('Address Component Controller', function () {
      var EventBus = require('eventbus');
      var ep = require('ep');

      describe('components.loadAddressesViewRequest', function () {
        var controller = require('address');

        before(function () {
          sinon.spy(EventBus, 'trigger');
          this.event = EventBus._events['components.loadAddressesViewRequest'];
        });

        after(function () {
          EventBus.trigger.restore();
        });

        it("is registered with EventBus", function () {
          expect(this.event).to.exist;
        });
        it("has 1 callBack function", function () {
          expect(this.event).to.have.length(1);
          expect(this.event[0].callback).to.exist;
        });

        describe('triggered without proper data', function() {
          var boundEvent = EventBus._events['components.loadAddressesViewRequest'][0];

          before(function() {
            this.errorlogger = sinon.stub(ep.logger, 'error');
            sinon.spy(boundEvent, 'callback');

            EventBus.trigger('components.loadAddressesViewRequest', undefined);
          });

          after(function () {
            ep.logger.error.restore();
            boundEvent.callback.restore();
          });

          it("error is logged", function () {
            expect(this.errorlogger).to.be.calledWithMatch('failed to load Address View');
          });
        });
      });
    });


    describe('Address Component Views', function () {
      var addressView = require('address.views');
      var addressTemplate = require('text!modules/base/components/address/base.component.address.template.html');

      it('should have DefaultAddressItemView', function () {
        expect(addressView.DefaultAddressItemView).to.be.ok;
      });

      describe('DefaultAddressItemView', function () {
        var standardAddressModel = new Backbone.Model({
          givenName: 'ben',
          familyName: 'boxer',
          streetAddress: '1234 HappyVille Road',
          extendedAddress: 'Siffon Ville',
          city: "Vancouver",
          region: "BC",
          country: "CA",
          postalCode: "v8v8v8"
        });

        before(function () {
          // append templates
          $("#Fixtures").append(addressTemplate);
        });

        after(function () {
          $("#Fixtures").empty();
        });

        describe('can render', function () {
          beforeEach(function () {
            this.view = new addressView.DefaultAddressItemView({model: this.model});
          });

          it('should be an instance of ItemView object', function () {
            expect(this.view).to.be.an.instanceOf(Marionette.ItemView);
          });
          it('render() should return the view object', function () {
            expect(this.view.render()).to.be.equal(this.view);
          });
        });

        describe('renders correctly with all fields of address model', function () {
          before(function () {
            this.model = standardAddressModel;

            // setup view & render
            this.view = new addressView.DefaultAddressItemView({model: this.model});
            this.view.render();
          });

          after(function () {
            this.model.destroy();
          });

          it('should render as UL (unordered list)', function () {
            expect(this.view.el.nodeName).to.equal('UL');
          });
          it('should render 4 child DOM elements (view content rendered)', function () {
            expect(this.view.el.childElementCount).to.equal(4);
          });

          it('should render givenName and familyName', function () {
            expect($('[data-el-value="address.name"]', this.view.$el).text()).to.have.string('ben')
              .and.to.have.string('boxer');
          });
          it('should render street address', function () {
            expect($('[data-el-value="address.streetAddress"]', this.view.$el).text()).to.have.string('1234 HappyVille Road');
          });
          it('should render extended address', function () {
            expect($('[data-el-value="address.extendedAddress"]', this.view.$el).text()).to.have.string('Siffon Ville');
          });
          it('should render city', function () {
            expect($('[data-el-value="address.city"]', this.view.$el).text()).to.have.string('Vancouver');
          });
          it('should render region', function () {
            expect($('[data-el-value="address.region"]', this.view.$el).text()).to.have.string('BC');
          });
          it('should render country', function () {
            expect($('[data-el-value="address.country"]', this.view.$el).text()).to.have.string('CA');
          });
          it('should render country', function () {
            expect($('[data-el-value="address.postalCode"]', this.view.$el).text()).to.have.string('v8v8v8');
          });
        });

        describe('renders correctly with empty extendedAddress field', function () {
          before(function () {
            // setup model to have empty fields for testing
            this.model = standardAddressModel;
            this.model.set('extendedAddress', undefined);

            // setup view & render
            this.view = new addressView.DefaultAddressItemView({model: this.model});
            this.view.render();
          });

          it('should render as UL (unordered list)', function () {
            expect(this.view.el.nodeName).to.equal('UL');
          });
          it('should still render 4 child DOM elements', function () {
            expect(this.view.el.childElementCount).to.equal(4);
          });
          it('extended address is not rendered with any text', function () {
            expect($('[data-el-value="address.extendedAddress"]', this.view.$el).text()).to.have.length(0);
          });
          // should I and how to other content are rendered with value?
        });
      });
    });

  });
});
