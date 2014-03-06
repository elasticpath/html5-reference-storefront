/*
 * grunt-license-reporter
 * Generates a list of external libraries and the banner (header) comments from each file.
 *
 * An external library is identified as any file in the given set that does not contain
 * a copyright string that matches the one specified in the plugin options.
 *
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
 */

module.exports = function(grunt) {
  'use strict';

  grunt.registerMultiTask('license_reporter', 'A plugin to extract header comments from external libraries.', function() {
    var options = this.data.options;

    // If there is no copyright string in the plugin options, return an error
    if (!options.copyrightExcludeRegEx) {
      grunt.log.error("ERROR: Unable to identify external libraries - no copyright regular expression specified.");
    } else {

      /**
       * =======================================
       * REGULAR EXPRESSIONS USED BY THIS PLUGIN
       * =======================================
       */
      // Matches the copyright string
      var copyrightRegExp = new RegExp(options.copyrightExcludeRegEx);

      // Matches lines that only contain whitespace
      var whiteSpaceRegEx = new RegExp(/^\s*$/);

      // Matches occurrences of '../' at the start of a string
      var parentDirectoryRegEx = new RegExp(/^(?:\.\.\/)*/);

      // Matches any amount of whitespace followed by the single line comment syntax (//) at the start of a line
      var singleLineCommentRegEx = new RegExp(/^\s*(\/{2})/);

      // Matches any amount of whitespace followed by the multi-line comment start syntax (/*) at the start of a line
      var multiLineCommentStartRegEx = new RegExp(/^\s*\/\*/);

      /**
       *  Matches any amount of characters
       *  followed by the multi-line comment end syntax (asterisk and forward slash)
       *  followed by any amount of whitespace at the end of a line
       */
      var multiLineCommentEndRegEx = new RegExp(/.*\*\/\s*$/);

      /**
       * ===============
       * FILE PROCESSING
       * ===============
       */
      // Contains all content to be written to file
      var fileOutput = '';
      // Contains the summary content that can be written to file or command line
      var commandLineOutput = '';
      // Any warning text that we may want to output differently to the command line
      var warningOutput = '';
      var separatorStr = '\n========================================================================\n\n';

      // A count of the library files processed
      var libraryCount = 0;

      // An array of files without header comments
      var filesMissingCommentsArray = [];

      // Iterate over all specified file groups
      this.files.forEach(function(f) {

        // Iterate over individual files
        var numFiles = f.src.length;
        while (numFiles--) {

          // Read the current file into a string for processing
          var currentFile = f.src[numFiles];
          var fileContent = grunt.file.read(currentFile);

          // Only process files that do not contain a recognised copyright notice
          if (!copyrightRegExp.test(fileContent)) {

            // Remove any leading '../' characters from the file path and add it to the output
            currentFile = currentFile.replace(parentDirectoryRegEx, '/');
            fileOutput += 'Library #' + (libraryCount + 1) + ': ' + currentFile + '\n';

            // Split the file content into an array of lines to begin extraction of banner comments
            var lines = fileContent.split("\n");
            // A boolean to record whether or not any comments have been found in the current library
            var foundComments = false;
            var lookForClosingComment = false;

            // Iterate over each line of the file
            for (var i  in lines) {
              if (lines.hasOwnProperty(i)) {
                var currentLine = lines[i];

                // If this line only contains whitespace, ignore it and move to the next line of the file
                if (whiteSpaceRegEx.test(currentLine)) {
                  // Go to the next iteration of the for..in loop
                  continue;
                }

                /**
                 * ===================
                 * MULTI-LINE COMMENTS
                 * ===================
                 */
                // If the line contains the start of a multi-line comment
                if (multiLineCommentStartRegEx.test(currentLine)) {
                  foundComments = true;
                  // If the multi-line comment doesn't end on the same line, then set a flag to look for
                  // the closing comment syntax.
                  if (multiLineCommentEndRegEx.test(currentLine) !== true) {
                    lookForClosingComment = true;
                  } else {
                    // Otherwise, add this line to the output
                    fileOutput += currentLine + "\n";
                  }
                // If the line contains the multi-line comment end syntax
                } else if (multiLineCommentEndRegEx.test(currentLine)) {
                  fileOutput += currentLine + "\n";
                  lookForClosingComment = false;
                  // Go to the next iteration of the for..in loop
                  continue;
                }

                /**
                 * ====================
                 * SINGLE LINE COMMENTS
                 * ====================
                 */
                // Match any single line comments
                if (singleLineCommentRegEx.test(currentLine)) {
                    fileOutput += currentLine + "\n";
                    foundComments = true;
                } else {
                  if (!foundComments) {
                    // Append the current file to the list of files without comments
                    filesMissingCommentsArray.push(currentFile);
                    fileOutput += "WARNING: No comments found! \n";
                  }
                  // If we are still looking for a matching closing comment syntax, add the current line to the output
                  // and keep looking
                  if (lookForClosingComment) {
                    fileOutput += currentLine + "\n";
                  } else {
                    // Break out of the for..in loop and stop processing this file
                    break;
                  }
                }
              }
            }
            // Add separator line to the output and increment the count of found libraries
            fileOutput += separatorStr;
            libraryCount += 1;
          }
        }

        // Iterate over the array of files missing comments and add them to the warning output
        var len = filesMissingCommentsArray.length;
        if (len) {
          var fileList = '';
          while(len--) {
            fileList += filesMissingCommentsArray[len] + '\n';
          }
          warningOutput = fileList + '\n';

          warningOutput = "WARNING: these third party libraries do not contain header comments:\n\n" + warningOutput;
        }

        // Read and report on any package.json files specified
        if (options.packageJsonFile) {
          var filesArr = grunt.file.expand(options.packageJsonFile);
          var dependenciesStr = 'Node dependencies';
          var devDependenciesStr = 'Node development dependencies';

          filesArr.forEach(function(f) {
            var fileContentJSON = grunt.file.readJSON(f);

            var getPackageJSONKeyCount = function(JSONObj, JSONKey) {
              if (JSONObj.hasOwnProperty(JSONKey)) {
                return Object.keys(JSONObj[JSONKey]).length;
              } return 0;
            };

            // If there are any dependencies listed, add them to the file output
            if (fileContentJSON.dependencies) {
              var numDependencies = getPackageJSONKeyCount(fileContentJSON, 'dependencies');
              fileOutput += numDependencies + ' ' + dependenciesStr + '\n\n';
              fileOutput += JSON.stringify(fileContentJSON.dependencies, null, '\n');
              fileOutput += '\n' + separatorStr;
              commandLineOutput += '\n* ' + numDependencies + ' ' + dependenciesStr;
            }

            // If there are any dependencies listed, add them to the file output
            if (fileContentJSON.devDependencies) {
              var numDevDependencies = getPackageJSONKeyCount(fileContentJSON, 'devDependencies');
              fileOutput += numDevDependencies + ' ' + devDependenciesStr + '\n\n';
              fileOutput += JSON.stringify(fileContentJSON.devDependencies, null, '\n');
              fileOutput += '\n' + separatorStr;
              commandLineOutput += '\n* ' + numDevDependencies + ' ' + devDependenciesStr;
            }
          });
        }

        // Output third party library count info to the command line
        commandLineOutput = '* ' + libraryCount + ' third party libraries' + commandLineOutput;
        commandLineOutput = 'Identified:\n\n' + commandLineOutput  + '\n';

        // Normalize line endings depending on platform (windows \r\n, else \n)
        var outputs =  commandLineOutput + '\n' + warningOutput + separatorStr + fileOutput;
        var normalizedOutputs = grunt.util.normalizelf(outputs);

        // Write all output (command line, warnings and file output) to file
        grunt.file.write(f.dest, normalizedOutputs);

        // Write the summary, warnings and file write info to the command line
        grunt.log.writeln();
        grunt.log.writeln(commandLineOutput);
        grunt.log.writeln(warningOutput.yellow);
        grunt.log.writeln('The full list of identified third party libraries was written to: \n' + f.dest);
      });
    }
  });
};