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
  'ext.item'              : 'modules/item/ext.item.controller',
  'ext.item.views'        : 'modules/item/ext.item.views',
  'ext.category'          : 'modules/category/ext.category.controller',
  'ext.category.views'    : 'modules/category/ext.category.views',
  'ext.appheader'         : 'modules/appheader/ext.appheader.controller',
  'ext.appheader.views'   : 'modules/appheader/ext.appheader.views',
  'ext.ia'                : 'modules/ia/ext.ia.controller',
  'ext.ia.views'          : 'modules/ia/ext.ia.views',
  'ext.profile'           : 'modules/profile/ext.profile.controller',
  'ext.profile.views'     : 'modules/profile/ext.profile.views',
  'ext.receipt'           : 'modules/receipt/ext.receipt.controller',
  'ext.receipt.views'     : 'modules/receipt/ext.receipt.views',
  'ext.cart'              : 'modules/cart/ext.cart.controller',
  'ext.cart.views'        : 'modules/cart/ext.cart.views',
  'ext.app'               : 'modules/app/ext.app.controller',
  'ext.app.views'        : 'modules/app/ext.app.views'

};

var dependencyPaths = _.extend(basePaths, extensionPaths);
dependencies.paths = dependencyPaths;
require.config(dependencies);

require(['ext.app', 'eventbus', 'i18n', 'bootstrap'],
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
