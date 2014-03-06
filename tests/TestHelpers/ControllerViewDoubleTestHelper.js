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
 * Controller DefaultView Test Helpers
 */

define(function (require) {
  var Marionette = require('marionette');

  var testDouble = function() {
    var renderTestFlag = false;
    var modelTestFlag = false;
    var collectionTestFlag = false;

    function wasRendered() {
      return renderTestFlag;
    }

    function hasAModel() {
      return modelTestFlag;
    }

    function hasACollection() {
      return collectionTestFlag;
    }

    function renderMock() {
      renderTestFlag = true;

      if (this.model) {
        modelTestFlag = true;
      }

      if (this.collection) {
        collectionTestFlag = true;
      }
    }

    var itemView = Marionette.ItemView.extend({
      render: renderMock
    });

    return {
      View: itemView,

      wasRendered: wasRendered,
      hasAModel: hasAModel,
      hasACollection: hasACollection
    };
  };

  return {
    TestDouble: testDouble
  };
});