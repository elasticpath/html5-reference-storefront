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

    shell: {
      copyright: {
        options: {
          stdout: true
        },
        command: 'sh findNoCopyrightFiles.sh'
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
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['watch']);
  grunt.registerTask('checkin', ['less', 'shell:copyright']);
};
