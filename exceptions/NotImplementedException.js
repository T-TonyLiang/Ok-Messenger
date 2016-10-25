function NotImplementedException(message) {
    this.name = "NotImplementedException";
    this.message = message;
}

NotImplementedException.prototype = Error.prototype;

module.exports = NotImplementedException;
