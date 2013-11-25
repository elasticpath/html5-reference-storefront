/**
 * Copyright Elastic Path Software 2013.
 *
 * User: sbrookes
 * Date: 26/04/13
 * Time: 2:53 PM
 *
 *
 *  UI Store Front
 *
 *  app.js
 *
 */
var express = require('express');
var http = require('http');
var path = require('path');
var winston = require('winston');
var app = express();
var less = require("less");

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: 'logs/app.log' })
  ]
});

app.configure(function(){
  app.set('port', process.env.PORT || 3008);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use('/', express.static(path.join(__dirname, '../ext')));
  app.use('/', express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});



/*
 *
 * ROUTES
 *
 * */
//require('./routes/routes-config')(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log("EP UI Storefront listening on port " + app.get('port'));
});
