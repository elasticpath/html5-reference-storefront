/*
 * grunt-license-reporter
 * Generates a list of external libraries and the banner (header) comments from each file.
 *
 * An external library is identified as any file in the given set that does not contain
 * a copyright string that matches the one specified in the plugin options.
 *
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 */

module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    license_reporter: {
      default_options: {
        options: {
          // Regular expression to match the copyright notices
          copyrightExcludeRegEx: /Copyright © 2014 Elastic Path Software Inc./,
          // Any package.json file for which we would like to list the dependencies
          // By default, this is set to the main package.json file for the ui-storefront
          packageJsonFile: ['../../package.json']
        },
        files: {
          // Uses the Node 'globbing patterns' to include and exclude files to be examined.
          // By default, JavaScript files in all directories (excluding node_modules and non-distributable).
          'libraries-list.txt': [
            '../../**/*.js',
            '!../../node_modules/**/*.js',
            '!../../non-distributable/**/*.js'
          ]
        }
      }
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // By default, run the license_reporter plugin
  grunt.registerTask('default', ['license_reporter']);

};