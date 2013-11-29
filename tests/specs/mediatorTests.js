/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.
 *
 */
define(function (require) {
  var ep = require('ep');
  var EventBus = require('eventbus');
  var Mediator = require('mediator');

  describe('EP Mediator', function() {

    describe('Strategies', function() {
      var strategies = Mediator.testVariable.MediatorStrategies;

      describe('mediator.navigateToCheckoutRequest', function() {
        var link = 'checkoutUrl';

        before(function () {
          ep.router = new Marionette.AppRouter();
          sinon.stub(ep.router, 'navigate');

          strategies['mediator.navigateToCheckoutRequest'](link);
        });

        after(function () {
          ep.router.navigate.restore();
        });

/*
        // Trouble testing because function with require will not run
        it('routes the user to the checkout view', function () {
          expect(ep.router.navigate).to.be.called;
        });
*/
      });

    });
  });

});