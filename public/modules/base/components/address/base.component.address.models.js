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
 * Default Address Component Models
 * Collection of backbone models storing address related data. This file also contains information about zoom queries
 * needed to request data from cortex server, and additional customized modelHelpers needed to parse models.
 */
define(function (require) {
  var ep = require('ep');
  var Backbone = require('backbone');
  var ModelHelper = require('modelHelpers');

  /**
   * Model containing displaying address information (in a form).
   * @type Backbone.Model
   */
  var addressModel = Backbone.Model.extend({
    parse: function (response) {
      var addressObj = {};

      if (response) {
        addressObj = modelHelpers.parseAddress(response);
      }
      else {
        ep.logger.error("Address model wasn't able to fetch valid data for parsing. ");
      }

      return addressObj;
    }
  });

  /**
   * Model containing empty address information, and a link to post new address form to cortex server.
   * @type Backbone.Model
   */
  var createAddressModel = Backbone.Model.extend({
    url: ep.io.getApiContext() + '/profiles/' + ep.app.config.cortexApi.scope + '/default?zoom=addresses:addressform',
    parse: function (response) {
      var addressObj = {};

      if (response) {
        addressObj.href = jsonPath(response, "$..links[?(@.rel=='createaddressaction')].href")[0];
      }
      else {
        ep.logger.error("Address model wasn't able to fetch valid data for parsing. ");
      }

      return addressObj;
    }
  });

  /**
   * Collection of countries.
   * @type Backbone.Collection
   */
  var countryCollection = Backbone.Collection.extend({
    comparator: 'displayName',
    url: ep.io.getApiContext() + '/geographies/' + ep.app.config.cortexApi.scope +  '/countries?zoom=element',
    parse: function (response) {
      var countryArray = [];
      if (response) {
        var countries = jsonPath(response, '$.._element')[0];
        if (countries) {
          countryArray = modelHelpers.parseArray(countries, modelHelpers.parseCountry);
        }

        // default select option; allow user to select non of the countries provided.
        countryArray.unshift({
          displayName: '----',
          name: ''
        });
      }
      else {
        ep.logger.error("Countries collection wasn't able to fetch valid data for parsing. ");
      }

      return countryArray;
    }
  });

  /**
   * Collection of regions of a given country.
   * @type Backbone.Collection
   */
  var regionCollection = Backbone.Collection.extend({
    comparator: 'displayName',
    getUrl: function (href) {
      return href + '?zoom=element';
    },
    parse: function (response) {
      var regionArray = [];
      if (response) {
        var regions = jsonPath(response, '$.._element')[0];
        if (regions) {
          regionArray = modelHelpers.parseArray(regions, modelHelpers.parseRegion);
        }

        // default select option; allow user to select non of the regions provided.
        regionArray.unshift({
          displayName: '----',
          name: ''
        });
      }
      else {
        ep.logger.error("Regions collection wasn't able to fetch valid data for parsing. ");
      }

      return regionArray;
    }
  });

  /**
   * Collection of helper functions to parse the model.
   * @type Object collection of modelHelper functions
   */
  var modelHelpers = ModelHelper.extend({

    parseCountry: function(rawObject) {
      var country = {};

      if (rawObject) {
        country = {
          displayName: jsonPath(rawObject, 'display-name')[0],
          name: jsonPath(rawObject, 'name')[0],
          regionLink: jsonPath(rawObject, "$.links[?(@.rel=='regions')].href")[0]
        };
      }
      else {
        ep.logger.warn('Error building country object: the rawObject argument was undefined');
      }

      return country;
    },

    parseRegion: function(rawObject) {
      var region = {};

      if (rawObject) {
        region = {
          displayName: jsonPath(rawObject, 'display-name')[0],
          name: jsonPath(rawObject, 'name')[0]
        };
      }
      else {
        ep.logger.warn('Error building region object: the rawObject argument was undefined');
      }

      return region;
    }
  });

  return {
    AddressModel: addressModel,
    CreateAddressModel: createAddressModel,
    CountryCollection: countryCollection,
    RegionCollection: regionCollection,
    testVariable: {
      modelHelpers: modelHelpers
    }
  };
});