const nodemailer = require('nodemailer');
const catchAsyncError = require('../middlewares/catchAsyncError');

const transport = nodemailer.createTransport({
    host:"smtp.gmail.com"||process.env.SMPT_HOST,
    port: 465 || process.env.SMPT_PORT,
    service: process.env.SMPT_SERVICE || "gmail",
    secure: true,
    
    auth: {
        user: "yash252525patel@gmail.com"||process.env.SMPT_MAIL,
        pass: "ftmujtjnqgariqhi" ||process.env.SMPT_PASSWORD,
      },
      tls:{
        rejectUnAuthorized:true
    }
})

const sendMail = catchAsyncError(async (email, secretToken, mode) => {
   
        if (mode == 'OTP') {
            
            return await transport.sendMail({
                from: "yash252525patel@gmail.com" || process.env.SMPT_MAIL,
                to: email,
                subject: "OTP Submission",
                html: `
        <h1>Reset Password</h1>
        <p> Here is your otp to change the password ${secretToken} </p>
      `
            })
        }
    
})

module.exports = sendMail  