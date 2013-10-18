/**
 * Copyright Elastic Path Software 2013.
 *
 * User: sbrookes
 * Date: 18/03/13
 * Time: 1:26 PM
 *
 */


var dependencies = config.baseDependencyConfig;
var basePaths = config.baseDependencyConfig.paths;
var extensionPaths = {
  'ext.item'              : 'modules/ext/item/ext.item.controller',
  'ext.item.views'        : 'modules/ext/item/ext.item.views',
  'ext.item.models'       : 'modules/ext/item/ext.item.models',
  'ext.category'          : 'modules/ext/category/ext.category.controller',
  'ext.category.views'    : 'modules/ext/category/ext.category.views',
  'ext.category.models'   : 'modules/ext/category/ext.category.models',
  'ext.appheader'         : 'modules/ext/appheader/ext.appheader.controller',
  'ext.appheader.views'   : 'modules/ext/appheader/ext.appheader.views',
  'ext.ia'                : 'modules/ext/ia/ext.ia.controller',
  'ext.ia.views'          : 'modules/ext/ia/ext.ia.views',
  'ext.profile'           : 'modules/ext/profile/ext.profile.controller',
  'ext.profile.views'     : 'modules/ext/profile/ext.profile.views',
  'ext.receipt'           : 'modules/ext/receipt/ext.receipt.controller',
  'ext.receipt.views'     : 'modules/ext/receipt/ext.receipt.views',
  'ext.cart'              : 'modules/ext/cart/ext.cart.controller',
  'ext.cart.views'        : 'modules/ext/cart/ext.cart.views',
  'ext.app'               : 'modules/ext/app/ext.app.controller',
  'ext.app.views'        : 'modules/ext/app/ext.app.views'

};

var dependencyPaths = _.extend(basePaths, extensionPaths);
dependencies.paths = dependencyPaths;
require.config(dependencies);

require(['app', 'eventbus', 'i18n', 'bootstrap'],
  function (App, EventBus, i18n) {

    // Application DOM container is ready (viewport)
    $(document).ready(function () {

        // initialize the localization engine
        i18n.init({
            lng: 'en' // default to english
          },
          function () {

            // trigger event to let the application know it is safe to kick off
            EventBus.trigger('app.bootstrapInitSuccess');

          }
        );
      }
    );
  });
