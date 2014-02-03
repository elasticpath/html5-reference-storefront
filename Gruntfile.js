/**
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
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
    }
  });

  // Load the plugins for our Grunt tasks.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha');

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
    grunt.task.run(['less', 'jshint', 'mocha']);
  });
};