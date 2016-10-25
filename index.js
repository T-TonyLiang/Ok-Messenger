'use strict';

var twilio = require('./util/twilio.js');

var express = require('express');
var bodyParser = require("body-parser");
var ToCommand = require("./classes/GoogleMaps_Directions.js");

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.post('/', function (request, response) {
    var command = new ToCommand();
    command.call(request.body.From, request.body.Body);
});

var server = app.listen(8080, function() {
  console.log('Listening on port %d', server.address().port);
});
