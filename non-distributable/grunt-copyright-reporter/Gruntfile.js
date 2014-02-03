/*
 * grunt-copyright-reporter
 * Generates a list of files that do not contain a copyright notice matching the given regular expression.
 *
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
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