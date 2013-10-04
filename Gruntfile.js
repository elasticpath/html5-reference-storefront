/**
 * Copyright © 2013 Elastic Path Software Inc. All rights reserved.

 * User: sbrookes
 * Date: 18/09/13
 * Time: 3:49 PM
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
    }

  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.loadNpmTasks('grunt-contrib-requirejs');

  grunt.registerTask('default', ['watch']);
};
