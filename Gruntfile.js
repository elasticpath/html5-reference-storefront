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
//          appDir:"",
          baseUrl: "",
         // dir:"build",
          mainConfigFile: "public/main.js",
          name:"main",
          out: "public/build/app-optimized.js",
//          modules:[
//            {
//              name:"main",
//              include: ["app"]
//            }
//
//          ],
          findNestedDependencies: true
        }
      }
    },
    less: {
      development: {
//        options: {
//          paths: ["stylesrc"]
//        },
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
        // improve the default output (add total number of errors, etc.) with this reporter library
        reporter: 'non-distributable/humanJsHintReporter.js'
      }
    }

  });

  // Load the plugins for our Grunt tasks.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['watch']);
  grunt.registerTask('checkin', ['less', 'jshint']);
};