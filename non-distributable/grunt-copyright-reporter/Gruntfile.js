/*
 * grunt-copyright-reporter
 * Generates a list of files that do not contain a copyright notice matching the given regular expression.
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
    copyright_reporter: {
      allFiles: {
        options: {
          // Regular expression to match the copyright notice
          // \d{4} matches any 4 digits
          copyrightRegEx: /Copyright © \d{4} Elastic Path Software Inc./
        },
        files: [{
          // The array of files to inspect
          // Supports Node 'globbing patterns'
          src: [
            '../../**/*.{js,html,less,css}',
            // Exclusions
            '!../../public/scripts/**',
            '!../../node_modules/**',
            '!../../non-distributable/**',
            '!../../tests/libs/**',
            '!../../tests/css/**',
            '!../../stylesrc/bootstrap/**',
            '!../../stylesrc/theme-core/load-bootstrap.less',
            '!../../stylesrc/theme-core/jquery.toastmessage.less',
            '!../../public/text.js'
          ]
        }]
      }
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // By default, run the license_reporter plugin
  grunt.registerTask('default', ['copyright_reporter']);

};