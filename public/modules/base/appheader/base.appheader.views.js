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
 *
 *
 */

define(['ep', 'mediator', 'eventbus', 'backbone', 'marionette', 'i18n', 'appheader.models'],
  function (ep, Mediator, EventBus, Backbone, Marionette, i18n, Model) {
    var viewHelpers = {
      getI18nLabel: function (key) {
        var retVal = key;
        try {
          retVal = i18n.t(key);
        }
        catch (e) {
          // slient failure on label rendering
        }

        return retVal;

      }
    };

    var PageHeaderView = Backbone.Marionette.Layout.extend({
      template: '#AppHeaderDefaultTemplateContainer',
      templateHelpers: viewHelpers,
      className: 'container appheader-container',
      onShow: function () {
        var elementWidth = $('.logo-container').outerWidth();
        EventBus.trigger('view.headerLogoViewRendered', elementWidth);
        Mediator.fire('mediator.appHeaderRendered');
      }
    });
    var HeaderLogoView = Backbone.Marionette.Layout.extend({
      template: '#LogoTemplateContainer'

    });

    var BackButtonView = Backbone.Marionette.Layout.extend({
      template: '#BackButtonTemplateContainer'
    });



    return {
      PageHeaderView: PageHeaderView,
      HeaderLogoView: HeaderLogoView,
      BackButtonView: BackButtonView

    };
  }
);
