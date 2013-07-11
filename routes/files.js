/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 08/05/13
 * Time: 8:34 AM
 *
 */
var fs = require('fs');
var path = require("path");
var winston = require('winston');
var EE = require('events').EventEmitter;
var EventBus = new EE();
var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: './logs/files.log' })
  ]
});
exports.getDirFileList = function(req, res){

  // get requested directory

  var path = req.param('path',null);
  if (path){
    // establish the path
    // get a list of files
    // filter to make srue we have them all
    // create an array
    // when the loop is done, return it

    var p = './public/' + path;
    var returnArray = [];
    fs.readdir(p,function(err,files){
      if (err){
        logger.error('exception reading module files: ' + err);
        return res.send(500,'exception reading module files: ' + err);
      }
//    files.map(function (file) {
//        return path.join(p, file);
//      }
//    );
      files.filter(function (file) {
          return fs.statSync(path.join(p, file)).isFile();
        }
      );
      files.forEach(function(file){


        logger.info('||   PUSH file  [' + file + '] ||');
        returnArray.push({file:file});

      });
      return res.send(returnArray);
    });


  }



};
exports.getDirFileList = function(req,res){

  var p = './public/modules';
  var returnArray = [];
  fs.readdir(p,function(err,files){
    if (err){
      logger.error('exception reading module dirs: ' + err);
      return res.send(500,'exception reading module dirs: ' + err);
    }
//    files.map(function (file) {
//        return path.join(p, file);
//      }
//    );
    var dirs = files.filter(function (file) {
        return fs.statSync(path.join(p, file)).isDirectory();
      }
    );
    // loop over the directories
    dirs.forEach(function(dir){


      logger.info(dir);

      logger.info('||   PUSH DIR  [' + dir + '] ||');
      returnArray.push({moduleName:dir});
    });


    return res.send(returnArray);
  });
};
exports.getCSSFile = function(req, res){
  logger.info('getModuleFile');
  // determine the file
  //var path = req.param('path',null);
  var dir = req.param('dir',null);
  var fileName = req.param('fileName',null);
  var fileExt = 'js';
//  if (fileType === 'templates'){
//    fileExt = 'html';
//  }
  var f = './' + dir + '/' + fileName;
  logger.info('get file path: ' + f);
  try{
    fs.readFile(f, function (err, data) {
      if (err) {
        logger.error('error trying to read file[' + f + ']: ' + err);
        return res.send(500,'error reading file[' + f + ']: ' + err);
      }
      return res.send(data);
    });
  }
  catch(err){
    logger.error('error reading file [' + f + ']' + err.message);
    return res.send(500,'error reading file[' + f + ']: ' + err);

  }

};
exports.getModuleFile = function(req, res){
  logger.info('getModuleFile');
  // determine the file
  //var path = req.param('path',null);
  var moduleName = req.param('moduleName',null);
  var fileName = req.param('fileName',null);
  var fileExt = 'js';
//  if (fileType === 'templates'){
//    fileExt = 'html';
//  }
  var f = './public/modules/' + moduleName + '/' + fileName;
  logger.info('get file path: ' + f);
  try{
    fs.readFile(f, function (err, data) {
      if (err) {
        logger.error('error trying to read file[' + f + ']: ' + err);
        return res.send(500,'error reading file[' + f + ']: ' + err);
      }
      return res.send(data);
    });
  }
  catch(err){
    logger.error('error reading file [' + f + ']' + err.message);
    return res.send(500,'error reading file[' + f + ']: ' + err);

  }

};
exports.addNewLessFile = function(req,res){
  var fileName = req.param('fileName',null);
  if (fileName){
    // check if file already exists
    var cssPath = './stylesrc/' + fileName + '.less';
    fs.exists(cssPath,function(exists){
      if (exists){
        return res.send(400,'file already exists');
      }
      fs.writeFile(cssPath,'',function(err){
        if (err){
          logger.error('error creating css file: [' + cssPath + '] ' + err);
          return res.send(500,err);
        }
        return res.send('file created');
      });

    });
  }
  else{
    return res.send(400,'no file name');
  }

};
exports.saveFile = function(req, res){
  // get the file name
  // module name
  // get the file type
  var moduleName = req.param('module',null);
  var fileType = req.param('filetype',null);
  var fileData = req.param('fileData',null);
  var fileExt = 'js';
  if (fileType === 'templates'){
    fileExt = 'html';
  }
  var f = './public/modules/' + moduleName + '/' + moduleName + '.' + fileType + '.' + fileExt;
  logger.info('file to be saved: ' + f);
  logger.info('file data to be saved: ' + fileData);

  fs.writeFile(f, fileData, function(err) {
    if(err) {
      logger.error('error saving file [' + f + ']' + err.message);
      return res.send(500,'error saving file[' + f + ']: ' + err);

    } else {
      return res.send('file saved: ' + f);
    }
  });

  // get the file data
  // save the contents
};
exports.saveThemeConfigFile = function(req, res){
  var themeData = req.param('data',null);
  if (themeData){
    // get the config file
    var f = './public/modules/theme/theme.config.json';
    fs.writeFile(f, JSON.stringify(themeData), function(err) {
      // write the data
      // close the file
      // respond
      if(err) {
        logger.error('error saving file [' + f + ']' + err.message);
        return res.send(500,'error saving file[' + f + ']: ' + err);

      } else {
        return res.send('file saved: ' + f);
      }
    });

  }
  else{
    return res.send(400,'no data');
  }
};
