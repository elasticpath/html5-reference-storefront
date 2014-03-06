/*
 * grunt-license-reporter
 * Generates a list of external libraries and the banner (header) comments from each file.
 *
 * An external library is identified as any file in the given set that does not contain
 * a copyright string that matches the one specified in the plugin options.
 *
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