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
          appDir:"public",
          baseUrl: "modules",
          dir:"build",
          mainConfigFile: "public/main.js",
  //        name:"main",
    //      out: "public/build/app-optimized.js",
          modules:[
            {
              name:"app"
            },
            {
              name:"appheader"
            },
            {
              name:"auth/auth.controller"
            },
            {
              name:"cart/cart.controller"
            },
            {
              name:"category/category.controller"
            },
            {
              name:"cortex/cortex.controller"
            },
            {
              name:"home/home.controller"
            },
            {
              name:"ia/ia.controller"
            },
            {
              name:"item/item.controller"
            },
            {
              name:"profile/profile.controller"
            },
            {
              name:"search/search.controller"
            },
            {
              name:"ui/ui.modal.controller"
            }

          ]
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
        files: ['stylesrc/*.less'],
        tasks: ['less']
      }
    }

  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.loadNpmTasks('grunt-contrib-requirejs');

  grunt.registerTask('default', ['requirejs']);
};
