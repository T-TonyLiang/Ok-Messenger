'use strict';

var twilio = require('./util/twilio.js');

var express = require('express');
var bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.post('/', function (request, response) {
    console.log(request.body);
    twilio.sendMessage("Hello World", "+16475183093");
});

var server = app.listen(8080, function() {
  console.log('Listening on port %d', server.address().port);
});
