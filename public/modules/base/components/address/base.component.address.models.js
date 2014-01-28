/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
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

  // Array of zoom parameters to pass to Cortex
  var zoomArray = [
  ];

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


  var countryCollection = Backbone.Collection.extend({
    comparator: 'displayValue',
    parse: function (response) {
      // checkin parse country information
    }
  });

  var regionCollection = Backbone.Collection.extend({
    comparator: 'displayValue',
    parse: function (response) {
      // checkin parse region information
    }
  });

  /**
   * Collection of helper functions to parse the model.
   * @type Object collection of modelHelper functions
   */
  var modelHelpers = ModelHelper.extend({
    // parse region

    // parse country
  });

  return {
    AddressModel: addressModel,
    CountryCollection: countryCollection,
    RegionCollection: regionCollection,
    testVariable: {
      modelHelpers: modelHelpers
    }
  };
});