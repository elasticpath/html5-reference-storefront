/*
 * grunt-copyright-reporter
 * Generates a list of files that do not contain a copyright notice matching the given regular expression.
 *
 * Copyright © 2014 Elastic Path Software Inc. All rights reserved.
 */

module.exports = function(grunt) {
  'use strict';

  grunt.registerMultiTask('copyright_reporter', 'Generates a list of files that do not contain a copyright notice.', function() {
    var options = this.data.options;

    // If there is no copyright string in the plugin options, return an error
    if (!options.copyrightRegEx) {
      grunt.log.error("ERROR: No copyright regular expression specified.");
    } else {

      /**
       * =======================================
       * REGULAR EXPRESSIONS USED BY THIS PLUGIN
       * =======================================
       */
      // Matches the copyright notice
      var copyrightRegExp = new RegExp(options.copyrightRegEx);

      // Matches occurrences of '../' at the start of a string
      var parentDirectoryRegEx = new RegExp(/^(?:\.\.\/)*/);

      /**
       * ===============
       * FILE PROCESSING
       * ===============
       */
      // Contains the output for the command line
      var commandLineOutput = '';

      // An array of files without copyright notices
      var filesMissingCopyrightArray = [];

      // Iterate over all specified file groups
      this.filesSrc.forEach(function(f) {

        var fileContent = grunt.file.read(f);
          // Only process files that do not contain a recognised copyright notice
          if (!copyrightRegExp.test(fileContent)) {
            // Remove any leading '../' characters from the file path for neater reporting
            f = f.replace(parentDirectoryRegEx, '/');

            filesMissingCopyrightArray.push(f);
          }
      });
      var missingCopyrightArrayLen = filesMissingCopyrightArray.length;

      if (missingCopyrightArrayLen) {
        var fileStr = 'files do';
        // Single file warning variation
        if (missingCopyrightArrayLen === 1) {
          fileStr = 'file does';
        }
        var warningStr = '\r\rWARNING: the following ' + fileStr + ' not have copyright notices:\r\r';
        var filesMissingCopyrightArrayStr = filesMissingCopyrightArray.join('\r') + '\r\r';

        grunt.log.writeln(warningStr.yellow);
        grunt.log.writeln(filesMissingCopyrightArrayStr.yellow);
      } else {
        grunt.log.writeln('\r\rAll target files have copyright notices.\r\r'.green);
      }

    }
  });
};