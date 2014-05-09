/**
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
 *
 *
 *  UI Store Front
 *
 *  app.js
 *
 */
/* global process, __dirname */
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

app.post("/", function(req, res) {

  var origin = req.get("Origin") || "";
  if (origin.indexOf("cybersource.com")) {
    // Parse the response - extract the vaues you want
    var status = req.body.decision;
    var displayValue = req.body.req_card_number;
    var token = req.body.payment_token;

    // Return a 302 redirect to the address page, tack on the info as a query param (or three)
    res.status(302);
    res.set("Location", "http://localhost:3007/html5storefront/#paymentreceipt/" + status + "/" + token + "/" + displayValue);
    res.end();
  }

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
