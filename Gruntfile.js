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
module.exports = function(grunt){

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
    requirejs: {
      compile: {
        options: {
          baseUrl: "",
          mainConfigFile: "public/main.js",
          name:"main",
          out: "public/build/app-optimized.js",
          findNestedDependencies: true
        }
      }
    },
    less: {
      compile: {
        files: {
          "public/style/style.css": "stylesrc/style.less"
        }
      }
    },
    watch: {
      scripts:{
        files: ['stylesrc/theme-core/*.less'],
        tasks: ['less']
      }
    },
    jshint: {
      allFiles: [
        '**/*.js',
        // exclusions
        '!tests/**',    // excluding unit test code as JSHint dislikes Chai assertion syntax
        '!public/scripts/**',
        '!node_modules/**',
        '!non-distributable/**',
        '!tests/libs/**',
        '!public/text.js'
      ],
      options:{
        jshintrc:  '.jshintrc',
        // improve the default output (add total number of errors, colours etc.) with this reporter library
        reporter: 'non-distributable/humanJsHintReporter.js'
      }
    },
    mocha: {
      runAllUnitTests: {
        src: ['tests/testrunner.html'],
        // Prevent the plugin calling mocha.run() - we will call this once our RequireJS dependencies have been loaded
        options: {
          run: false,
          log: true
        }
      }
    },
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
            '**/*.{js,html,less,css}',
            // Exclusions
            '!public/scripts/**',
            '!node_modules/**',
            '!non-distributable/**',
            '!tests/libs/**',
            '!tests/css/**',
            '!stylesrc/bootstrap/**',
            '!stylesrc/theme-core/load-bootstrap.less',
            '!stylesrc/theme-core/jquery.toastmessage.less',
            '!public/text.js'
          ]
        }]
      }
    }
  });

  // Load the plugins for our Grunt tasks.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-copyright-reporter');

  // Make watch the default task
  grunt.registerTask('default', ['watch']);

  /**
   * A function containing a number of tasks to be run at check-in time.
   * The --force option is set to true by default.
   * This ensures later tasks in the sequence continue to run even when earlier tasks generate warnings.
   */
  grunt.registerTask('checkin', 'A task to run all check-in tasks', function() {
    // set the force option for all tasks
    grunt.option('force', true);
    grunt.task.run(['less', 'jshint', 'mocha', 'copyright_reporter']);
  });
};