/**
 * An abstract class Command that defines the basic properties of a command
 */

var Exception = require("../includes/exceptions.js");
var utils = require("../utils/utils.js");

var OM_Command = function(keyword, description) {
  if (this.constructor === OM_Command) {
      throw new Error("Can't instantiate abstract class Command.");
  }
  this.keyword = keyword;
  this.description = description;
}

OM_Command.prototype.call = function(child_call){
  if (child_call === undefined) {
    throw new Error("Undefined call method parameter");
  }
  try {
    child_call();
  } catch(err) {
    if (err instanceof Exception.OM_Exception) {
      var arr = new Array(err.message);
      utils.sendResponse(arr);
    }
  }
}

OM_Command.prototype.callback = function(){
  throw new Error("Abstract Method");
}

OM_Command.prototype.parseRequest = function(){
  throw new Error("Abstract Method");
}

module.exports = OM_Command;
