const API_KEY = require("../config.json").GOOGLE_API_KEY;

var Command = require("./Command.js");
var googleapi_utils = require("../util/googleapis.js");
var utils = require("../util/utils.js");

function ToCommand() {
  Command.call(this, "time", "");

  this.request_hostname = "maps.googleapis.com";
  this.request_path = "/maps/api/directions/json?";

}

ToCommand.prototype = Command.prototype;
ToCommand.prototype.constructor = ToCommand;

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
    throw new Error("Error, no keyword 'to' found in query.");
  } else if (arr.length > 2) {
    throw new Error("Error, multiple keywords 'to' found in query.");
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

ToCommand.prototype.call = function(request_number, request) {
  var parameters = this.parseRequest(request);
  var path = utils.buildPath(this.request_path, parameters);
  utils.callAPI(this.request_hostname, path, this.callback);
}

ToCommand.prototype.callback = function(response) {
  console.log(response);
}

var x = new ToCommand();
x.call("asdf", "8 castlemere cres to davis center, waterloo: by car arriving 18:30");
