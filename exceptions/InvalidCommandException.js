var OM_Exception = require("./00_Exception.js");

function InvalidCommandException(message) {
    this.name = "InvalidCommandException";
    this.message = message;
}

InvalidCommandException.prototype = OM_Exception.prototype;

module.exports = InvalidCommandException;
