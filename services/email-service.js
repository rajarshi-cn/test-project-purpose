"use strict"
var nodemailer = require("nodemailer")

//-------------mail sending function---------------- //
exports.sendemail = async function (data_for_email, flag) {
  let subject = "",
    text = "",
    html = "",
    attachments

  // console.log("data_for_email in service==", data_for_email[0])
  // console.log("data_for_email.name==", data_for_email[0].name)
  // console.log("data_for_email.email==", data_for_email[0].email)

  if (flag == "changePassword") {
    subject = "Password Changed alert"
    text = `"Hi ${data_for_email[0].name} Your password has been changed successfully"`
  }

  if (flag == "forgotPassword") {
    subject = "Reset your Password"
    // text = `"Hi ${data_for_email[0].name}, please follow the link ${data_for_email[0].resetLink} to reset your password"`
    html = `"Hi ${data_for_email[0].name}, please <a href=${data_for_email[0].resetLink}>clickHere</a> to reset your password, please keep in mind that this link is valid for 24 hours from the time you receieved this mail."`
  }

  if (flag == "resetPassword") {
    subject = "Your new Password has been updated"
    text = `"Hi ${data_for_email[0].name}, your password has been updated successfully."`
  }

  if (flag == "orderMailToCustomer") {
    // console.log("data_for_email==", data_for_email)
    // console.log(
    //   "data_for_email[0].file_to_be_attached==",
    //   data_for_email[0].file_to_be_attached
    // )

    subject = "Payment Details"
    html = `"Hi ${data_for_email[0].customerName}, your total purchase amount is ${data_for_email[0].discountedPrice}. Please pay the amount directly to merchant's ethereum account address(${data_for_email[0].merchantEthereumAccountAddress}) or you can <a href=${data_for_email[0].paymentRedirectLink}>clickHere</a> to make payment."`

    if (data_for_email[0].file_to_be_attached) {
      attachments = [
        {
          path: data_for_email[0].file_to_be_attached,
        },
      ]
    }
  }

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "bcpoctest@gmail.com",
      pass: process.env.thirdPartyMailPw,
    },
  })

  var mailOptions = {
    from: "Poc Support Team<bcpoctest@gmail.com>",
    to: data_for_email[0].email,
    cc: "",
    bcc: "rajarshi@capitalnumbers.com , sohamr@capitalnumbers.com",
    subject: subject,
    text: text,
    html: html,
    attachments: attachments,
  }

  // transporter.sendMail(mailOptions, function (error, info) {
  //   if (error) {
  //     console.log("error==", error)
  //     return false
  //   } else {
  //     console.log("info: " + info)
  //     console.log("Email sent: " + info.response)
  //     return info
  //   }
  // })
  return transporter.sendMail(mailOptions)
}
