var https = require("https");

var callAPI = function(hostname, path, callback) {
  var response_body = "";

  console.log(hostname+path);

  var request = https.get({
    hostname: hostname,
    path: path,
    method: 'GET'
  }, function(res) {
    if (res.statusCode !== 200){
      return;
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

/**
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

module.exports = {
  callAPI: callAPI,
  buildPath: buildPath
}
