/**
 * The default JSHint output is somewhat wasteful, and very bland, making it hard for a human to
 * parse. The following does IMO a better job and colours the output for you. This requires the
 * `colors` package, available via npm. If you don't want the dependency, just remove the color
 * commands from strings.
 *
 * Usage: When invoking jshint from the command line, point it to this file with the --reporter
 * flag. e.g.
 *
 * jshint someFile.js --config /path/to/config.cfg --reporter /path/to/jshintReporter.js
 *
 * Mark Stanley Everitt, 2013
 * send pull requests to: https://gist.github.com/qubyte/5430269
 * licence: MIT
 */

//require('colors');

/**
 * Generate a string of spaces num wide.
 *
 * @param  {Number} num Number of spaces in string.
 * @return {String}     String of spaces.
 */

function pad(num) {
  return (new Array(num + 1)).join(' ');
}

/**
 * Gather errors by filename into lists.
 *
 * @param  {Array}  data Array of jshint error objects.
 * @return {Object}      A map of file name against lists of errors for each file.
 */

function splitByFile(data) {
  var allData = {};

  for (var i = 0; i < data.length; i++) {
    var datum = data[i];

    if (!allData.hasOwnProperty(datum.file)) {
      allData[datum.file] = [];
    }

    allData[datum.file].push(datum.error);
  }

  return allData;
}


/**
 * JSHint reporter function
 *
 * @param {Array} data Array of JSHint error objects.
 */

exports.reporter = function (data) {
  if (data.length === 0) {
    console.log('No errors found.'.green);
    return;
  }

  var splitUp = splitByFile(data);
  var fileNames = Object.keys(splitUp).sort();
  var numFiles = fileNames.length;

  fileNames.forEach(function (fileName) {
    console.log('Errors in file:'.blue.bold, fileName);

    // Reverse sort. If read top down, corrected errors won't affect the line number of
    // following errors in a file most of the time.
    var fileData = splitUp[fileName].sort(function (a, b) {
      return b.line - a.line;
    });

    var lineWidth = 0;
    var charWidth = 0;

    // Work out column alignment for this file.
    for (var i = 0; i < fileData.length; i++) {
      lineWidth = Math.max(('' + fileData[i].line).length, lineWidth);
      charWidth = Math.max(('' + fileData[i].character).length, charWidth);
    }

    // Print each error.
    for (var j = 0; j < fileData.length; j++) {
      var error = fileData[j];

      var lineString = error.line + pad(lineWidth - ('' + error.line).length);
      var charString = error.character + pad(charWidth - ('' + error.character).length);

      console.error('  line', lineString.green, 'char', charString.green + ':', error.reason.red);
    }
  });

  setTimeout(function () {
    console.log((data.length + ' errors found in ' + numFiles + ' file' + (numFiles === 1 ? ':' : 's:')).red.bold);

    fileNames.forEach(function (fileName) {
      console.log('  ' + fileName);
    });
  }, 0);

};