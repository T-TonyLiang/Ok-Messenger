var twilio = require('../node_modules/twilio/lib');
var config = require('../config.json');

var accountSid = config.TWILIO_SID;
var authToken = config.TWILIO_AUTH;

var client = new twilio.RestClient(accountSid, authToken);

function sendSMS(message, number)
{
    //create message
    client.messages.create({
        body: message,
        to: number,
        from: config.TWILIO_NUMBER
    }, function(err, message) {
        if (err) console.log(err);
        else process.stdout.write(message.body);
    });
}

module.exports = {
  sendSMS: sendSMS
}
