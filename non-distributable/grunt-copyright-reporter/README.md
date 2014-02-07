# grunt-copyright-reporter

> Generates a list of files that do not contain a copyright notice.

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-copyright-reporter --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-copyright-reporter');
```

## The "copyright_reporter" task

### Overview
In your project's Gruntfile, add a section named `copyright_reporter` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  copyright_reporter: {
    options: {
      // Task-specific options go here.
    },
    files: [{
      // The array of files to inspect
      src: [
        ''
      ]
    }]
  },
});
```

### Options

#### options.copyrightRegEx
Type: `String`
Default value: `'/Copyright © \d{4} Elastic Path Software Inc./'`

A string or regular expression to match the copyright notice.

#### files
Type: `Array`
Default value:
    [{
        src: [
        '../../**/*.{js,html,less,css}',
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

An array of file 'globbing patterns' for the files to inspect for copyright notices.

### Usage Examples

```js
  grunt.initConfig({
    copyright_reporter: {
      default_options: {
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