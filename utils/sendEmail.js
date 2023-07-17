const { createTransport } = require("nodemailer")
const asyncHandler = require("express-async-handler")

const sendEmail = asyncHandler( async (options) => {
   // 1- create transporter => it is a service provider to send email from ('gmail', 'sendGrid', mailGun, mainTrap)
   const transporter = createTransport({
      service: 'gmail',
      auth: {
         user: process.env.EMAIL,
         pass: process.env.PASSWORD_EMAIL,
      },
   })
   // 2- define email options
   const mailOptions = {
      from: 'E-commerce App',
      to: options.email,
      subject: options.subject,
      html: `<h1>Welcome ${options.name}</h1> <span>your reset code is<h2 style="display: inline">${options.resetCode}</h2> reset code valid for <strong>10</strong> minutes </span> 
      `
   }
   // 3- send email 
   await transporter.sendMail(mailOptions)

})





module.exports = sendEmail