var OM_Exception = require("./00_Exception.js");

function UnrecognizedInputException(message) {
    this.name = "UnrecognizedInputException";
    this.message = message;
}

UnrecognizedInputException.prototype = OM_Exception.prototype;

module.exports = UnrecognizedInputException;
