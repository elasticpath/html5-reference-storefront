/**
 * Copyright Elastic Path Software 2013.

 * User: sbrookes
 * Date: 18/04/13
 * Time: 10:56 AM
 *
 */

var fs = require('fs');
var less = require("less");
var path = require("path");
var winston = require('winston');
var EE = require('events').EventEmitter;
var EventBus = new EE();
var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: './logs/composer.log' })
  ]
});


exports.getCSSFileList = function(req, res){
  var fileName = req.param('fileName',null);
  var dir = req.param('dir','stylesrc')
  // get requested directory
  logger.info('inside getCSSFileList');

  if (dir){
    // establish the path
    // get a list of files
    // filter to make srue we have them all
    // create an array
    // when the loop is done, return it
    var p = './' + dir;
    var returnArray = [];
    fs.readdir(p,function(err,files){
      if (err){
        logger.error('exception reading css files: ' + err);
        return res.send(500,'exception reading css files: ' + err);
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
        returnArray.push({dir:dir,file:file});

      });
      logger.info('end getCSSFileList');
      return res.send(returnArray);
    });


  }

  logger.info('|-| terminal getCSSFileList');

};
exports.getModuleFileList = function(req, res){

  // get requested directory
  logger.info('insde getModuleFileList');

  var module = req.param('module',null);
  if (module){
    // establish the path
    // get a list of files
    // filter to make srue we have them all
    // create an array
    // when the loop is done, return it

    var dir = 'public/modules/' + module;
    var p = './' + dir;
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
        returnArray.push({dir:dir,file:file});

      });
      return res.send(returnArray);
    });


  }



};
exports.getModuleList = function(req,res){

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
exports.getFile = function(req, res){
  // determine the file
  var moduleName = req.param('module',null);
  var fileType = req.param('filetype',null);
  var fileExt = 'js';
  if (fileType === 'templates'){
    fileExt = 'html';
  }
  var f = './public/modules/' + moduleName + '/' + moduleName + '.' + fileType + '.' + fileExt;
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
exports.saveCSSFile = function(req, res){
  // get the file name
  // module name
  // get the file type
  var dir = req.param('dir',null);
  var fileName = req.param('fileName',null);
  var fileData = req.param('fileData',null);

  var f = './' + dir + '/' + fileName;
  logger.info('file to be saved: ' + f);
  logger.info('file data to be saved: ' + fileData);
  if(fileData){
    fs.writeFile(f, fileData, function(err) {
      if(err) {
        logger.error('error saving file [' + f + ']' + err.message);
        return res.send(500,'error saving file[' + f + ']: ' + err);

      } else {
       // less.render('/stylesrc/*', '/public/stlye/style.css');
//        node C:\utils\less\lessc.cmd -x -O2 ./stylesrc/style.less ./public/style/style.css
        fs.readFile('./stylesrc/style.less',function(err,data){
          if (err){
            logger.error('read style.less error: ' + err);
            return res.send(500,'read style.less error: ' + err);
          }
          data = data.toString();
          less.render(data, function (err, css) {
            if (err){
              logger.error('render  style error: ' + JSON.stringify(err));
              return res.send(500,'render style error: ' + err);
            }
            fs.writeFile('./public/style/style.css', css, function(err){
              if (err){
                logger.error('error compiling less: ' + err);
                return res.send(500,'render compile less error: ' + err);
              }
              return res.send('file saved: ' + css);
            });
          });
        });
      }
    });
  }
  else{
    return res.send(400);
  }
};
