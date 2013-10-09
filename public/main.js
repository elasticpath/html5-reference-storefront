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
  'extItem': 'modules/item/ext.item.controller',
  'extItem.views': 'modules/item/ext.item.views',
  'extCategory': 'modules/category/category.controller',
  'extCategory.views': 'modules/category/category.views',
  'extCategory.models': 'modules/category/category.models',
  'extAppheader'       : 'modules/appheader/appheader.controller',
  'extAppheader.models': 'modules/appheader/appheader.models',
  'extAppheader.views' : 'modules/appheader/appheader.views'

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
