var nodemailer = require("nodemailer"); 
const  sendOTP = function(email, otp){
var sender = nodemailer.createTransport({ 
  service: 'gmail', 
  auth: { 
    user: 'mailtest.gopi@gmail.com', 
    pass: 'Welcome@123'
  } 
}); 

var mail = { 
  from: "mailtest.gopi@gmail.com", 
  to: email, 
  subject: "Your OTP", 
  text: otp
}; 
  
sender.sendMail(mail, function(error, info) { 
  if (error) { 
    console.log(error); 
  } else { 
    console.log("Email sent successfully: "
                 + info.response); 
  } 
}); 
}
module.exports = sendOTP