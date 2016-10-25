/**
 * Helper and utility functions
 */

var Exception = require("../includes/exceptions.js");
var https = require("https");
var twilio = require("./twilio.js");

/*
 * Sends an HTTP GET request to a given hostname and path, then calls the callback function
 *
 * @param hostname the hostname of the HTTP address
 * @param path the path of the URL address to be requested
 * @param callback the callback function that will be called and passed the response of the HTTP request
 */
var callAPI = function(hostname, path, callback) {
  var response_body = "";

  var request = https.get({
    hostname: hostname,
    path: path,
    method: 'GET'
  }, function(res) {
    if (res.statusCode !== 200){
      throw new Exception.UnrecognizedInput("Invalid query. Missing required parameters.");
    }
    res.setEncoding('utf8');
    res.on('data', function (data) {
      response_body += data;
    });
    res.on('end', function (data) {
      callback(response_body);
    });
  });

  request.on('error', function(e) {
    console.log('Problem with request: ' + e.message);
  });
}

/*
 * Sends an array of response messages to a phone number via twilio SMS
 *
 * @param number the phone number which the messages will be sent to
 * @param response an array of strings representing the messages to be sent to the phone number
 */
var sendResponse = function(number, response) {
  if (response.constructor !== Array) return;
  response.forEach(function(element, index, array) {
    console.log(element);
  });
}

/*
 *  Returns a URL encoded path with specified URL parameter names and values
 *
 * @param base_path - the base path of the URL
 * @param parameters - the JSON object mapping parameter name to parameter value (with null as unspecified)
 * @returns string representing the URL path with the parameters
 */
var buildPath = function(base_path, parameters) {
  for(var param in parameters) {
    parameters[param] = encodeURIComponent(parameters[param]);
  }
  parameters = JSON.stringify(parameters);
  parameters = parameters.replace(/\"|\{|\}/g, "").replace(/:/g,"=").replace(/,/g,"&").replace(/=null/g, "=");
  return base_path + parameters;
}

/**
 * Exports
 */
module.exports = {
  callAPI: callAPI,
  buildPath: buildPath,
  sendResponse: sendResponse
}
