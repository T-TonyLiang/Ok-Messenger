function UnrecognizedInputException(message) {
    this.name = "UnrecognizedInputException";
    this.message = message;
}

UnrecognizedInputException.prototype = Error.prototype;

module.exports = UnrecognizedInputException;
