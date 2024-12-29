import twilio from 'twilio';

const accountSid = 'AC2ec9c12ca42f6448bad8aef6dc94a943';
const authToken = '54c8ebf1f22a7d4259191930f338578d';

const client = twilio(accountSid, authToken);

const sendSms = (phone, otp)=>{
    return client.messages
    .create({
        body: `Hi, Your generated OTP is ${otp}`,
        from: '+12513136425',
        to: `+91${phone}`
    })
}

export default sendSms;