const nodemailer = require('nodemailer');
const catchAsyncError = require('../middlewares/catchAsyncError');


const sendMail = catchAsyncError(async (email, secretToken, mode) => {
    const transport = nodemailer.createTransport({
        host:"smtp.gmail.com",
        port: 465,
        service: "gmail",
        secure: true,
        
        auth: {
            user: "yash252525patel@gmail.com"||process.env.SMPT_MAIL,
            pass: "ftmujtjnqgariqhi" ||process.env.SMPT_PASSWORD,
          }
    })
   
        if (mode == 'OTP') {
            
         await transport.sendMail({
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