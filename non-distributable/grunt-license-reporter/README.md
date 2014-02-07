# grunt-license-reporter

> Generates a list of external libraries and the banner (header) comments from each file.

## Getting Started
This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-license-reporter --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-license-reporter');
```

## The "license_reporter" task

### Overview
In your project's Gruntfile, add a section named `license_reporter` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  license_reporter: {
    options: {
      // Task-specific options go here.
    }
  },
});
```

### Options

#### options.copyrightExcludeRegEx
Type: `String`
Default value: `'/Copyright © 2014 Elastic Path Software Inc./'`

A string or regular expression to match the copyright notice that is used to determine if a file is an external library.

#### options.packageJsonFile
Type: `Array`
Default value: `['../../package.json']`

An array of file 'globbing patterns' to specify a package.json file from which dependencies will be extracted.

### Usage Examples

```js
grunt.initConfig({
  license_reporter: {
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
  },
});
