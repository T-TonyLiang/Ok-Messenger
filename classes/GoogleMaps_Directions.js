/**
 * Google Maps Directions.
 * Returns the directions from a given address to a given address.
 */

const API_KEY = require("../config.json").GOOGLE_API_KEY;

var OM_Command = require("./00_Command.js");
var Exception = require("../includes/exceptions.js");
var googleapi_utils = require("../utils/googleapis.js");
var utils = require("../utils/utils.js");
var twilio = require("../utils/twilio.js")
var striptags = require('striptags');

/*
 * Constructs a Google Maps Directions command
 */
function ToCommand() {
  OM_Command.call(this, "directions", "returns directions from a given current location to a given destination");

  this.request_hostname = "maps.googleapis.com";
  this.request_path = "/maps/api/directions/json?";
  this.request_number = "";
}

// inhert from base Command object
ToCommand.prototype = OM_Command.prototype;
// initialize constructor
ToCommand.prototype.constructor = ToCommand;

/*
 * Given the input query string, parses the request into URL parameters for Google APIS
 *
 * @returns a JSON object mapping the URL parameter name to parameter value
 * @throws InvalidCommandException
 */
ToCommand.prototype.parseRequest = function(string){
  var departure_time = null, arrival_time = null;

  string = string.toLowerCase();
  var mode = string.match(/ (by|mode) ([\w]+)/);

  if (mode) {
    string = string.replace(mode[0], "");
    mode = mode[2];
    // NOTE: only accepts 24hr time
    departure_time = string.match(/(depart|departure|leaving|departing) ([0-9]{1,2}:[0-9]{1,2})/);
    arrival_time = string.match(/(arrive|arrival|arriving) ([0-9]{1,2}:[0-9]{1,2})/);
    if (departure_time !== null) {
      string = string.replace(departure_time[0], "");
      string = (arrival_time)? string.replace(arrival_time[0], "") : string;
      departure_time = departure_time[2];
    }
    else if (arrival_time !== null) {
      string = string.replace(arrival_time[0], "");
      arrival_time = arrival_time[2];
    }
  } else {
    mode = "driving";
  }

  // seperate mapping if the string starts with 'from'
  var arr = string.split(" to ");
  if (arr.length <= 1) {
    throw new Exception.InvalidCommand("Error, no keyword 'to' found in query.");
  } else if (arr.length > 2) {
    throw new Exception.InvalidCommand("Error, multiple keywords 'to' found in query.");
  }
  var origin = arr[0];
  var destination = arr[1];

  return {
    mode: mode,
    origin: origin,
    destination: destination,
    departure_time: departure_time,
    arrival_time: arrival_time
  }
}

/*
 * Invokes functions to process the request and send SMS response
 *
 * @param request_number the phone number number that sent the request
 * @request the query string
 */
ToCommand.prototype.call = function(request_number, request) {
  try{
    this.request_number = request_number;
    var parameters = this.parseRequest(request);
    var path = utils.buildPath(this.request_path, parameters);
    utils.callAPI(this.request_hostname, path, this.callback.bind(this));
  } catch (exception) {
    if (exception instanceof Exception.OM_Exception) {
      var arr = new Array(exception.message);
      utils.sendResponse(request_number, arr);
    }
    throw exception;
  }
}

/*
 * Parses the response from the Google API and returns an array of response messages
 *
 * @param response the response data from the API
 * @returns response_messages the array of response messages
 * @throws UnrecognizedInputException
 */
ToCommand.prototype.parseResponse = function(response) {
  var response_messages = new Array();
  if(!(JSON.parse(response)).routes[0]) {
    throw new Exception.UnrecognizedInput("Google was unable to locate the specified address(es).")
  }

  response = (JSON.parse(response)).routes[0].legs[0];
  response_messages.push("Directions from " + response.start_address + " to " + response.end_address + "\nEstimated time: " + response.duration.text);

  var steps = response.steps;
  for (var index = 0; index < steps.length; index++){
    var step = "Distance: " + steps[index].distance.text + " in " + steps[index].duration.text + "\n";
    step += striptags(steps[index].html_instructions);
    response_messages.push(step);
  }
  return response_messages;
}

/*
 * Callback method of API calls. Invokes functions to parse response from API and send it via SMS
 *
 * @param response the response data from the API
 */
ToCommand.prototype.callback = function(response) {
  var response_messages = this.parseResponse(response);
  utils.sendResponse(this.request_number, response_messages); // change to prototype
}

module.exports = ToCommand;
