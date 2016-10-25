/**
 * An abstract class Command that defines the basic properties of a command
 */

var Command = function(keyword, description) {
  if (this.constructor === Command) {
      throw new Error("Can't instantiate abstract class Command.");
  }
  this.keyword = keyword;
  this.description = description;
}

Command.prototype.call = function(){
  throw new Error("Abstract Method");
}

Command.prototype.callback = function(){
  throw new Error("Abstract Method");
}

Command.prototype.parseRequest = function(){
  throw new Error("Abstract Method");
}

module.exports = Command;
