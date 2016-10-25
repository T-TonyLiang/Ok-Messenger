var OM_Exception = require("./00_Exception.js");

function NotImplementedException(message) {
    this.name = "NotImplementedException";
    this.message = message;
}

NotImplementedException.prototype = OM_Exception.prototype;

module.exports = NotImplementedException;
