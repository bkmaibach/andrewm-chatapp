let https = require('https');
const querystring = require('querystring');

//Requires the environment variables:
//fromPhone
//accountSid
//authToken

let twilio = {};

twilio.sendTwilioSms = async (phone, message) => {
    return new Promise( (resolve, reject) => {
        console.log('ENVIRONMENT VARIABLES:')
        console.log(process.env.accountSid);
        console.log(process.env.fromPhone);
        console.log(process.env.authToken);

        //Validate params
        phone = typeof(phone) == 'string' 
            && phone.trim().length == 10 
            ? phone.trim() : false;

        message = typeof(message) == 'string' 
            && message.trim().length > 0 
            && message.trim().length < 1600 
            ? message.trim() : false;

        if (phone && message){
            //Configure the request payload
            let payload = {
                "From" : process.env.fromPhone,
                "To" : '+1'+phone,
                'Body': message
            };
            //Configure the request details
            let stringPayload = querystring.stringify(payload);
            let requestDetails = {
                'protocol': 'https:',
                'hostname' : 'api.twilio.com',
                'method' : 'POST',
                'path' : '/2010-04-01/Accounts/'+process.env.accountSid+'/Messages.json',
                'auth' : process.env.accountSid+':'+process.env.authToken,
                'headers': {
                    'Content-Type' : 'application/x-www-form-urlencoded',
                    'Content-Length' : Buffer.byteLength(stringPayload),
                }
            };
            //Instantiate a request object
            let req = https.request(requestDetails, (res) => {
                //Grab the status of the sent request
                var status = res.statusCode;

                //@TODO - REMOVE ME
                let buffer = '';
                res.on('data', (data)=>{
                    buffer += data;
                    console.log(buffer);
                });

                //Return success if the request went through
                if(status >= 200 && status < 300){
                    resolve();
                } else {
                    reject('Twilio rejected the request');
                    console.log(status);
                }
            });
            //Bind to the error event so it doesn't get thrown
            req.on('error', (error) => {
                reject(error);
            });

            //Add the payload
            req.write(stringPayload);

            //End the request
            req.end();

        } else {
            reject("Given parameters were missing or invalid"); 
        }
    });
};

twilio.isPhone = (string) => {
    let phone = typeof(string) == 'string'
        && string.trim().length == 10
        ? string.trim() : false
    return phone;
};

module.exports = twilio;