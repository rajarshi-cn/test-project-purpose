"use strict"

const mongoose = require("mongoose")
const moment = require("moment")
require("dotenv").config()
const os = require("os")

const userservice = require("../services/userService")
const emailService = require("../services/email-service")
const customerservice = require("../services/customerService")
const EthModel = require("../models/ethereum")
const EthereumController = require("./ethereumController")
const etherservice = require("../services/etherService")
const pdfService = require("../services/pdf-service")
const transactionService = require("../services/transactionService")

function makeRandomString(length) {
  var result = ""
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

// const addUpdateUser = (req, res, next) => {
//   //   console.log("req.body==", req.body)

//   let userdata = new users({
//     name: req.body.name,
//     email: req.body.email,
//     phone: req.body.phone,
//     password: hashEncrypt(req.body.password),
//   })
//   //   console.log("userdata==", userdata)
//   userdata
//     .save()
//     .then(response => {
//       console.log("response==", response)
//       res.json({
//         message: "user added successfully",
//         response: response,
//       })
//     })
//     .catch(error => {
//       console.log("error==", error)
//       res.json({
//         message: error.message,
//       })
//     })
// }
const addUpdateUser = async (req, res, next) => {
  let userdata
  let message = ""
  try {
    // console.log("req.body ==", req.body)
    if (req.body._id) {
      if (req.body.email) delete req.body.email
      if (req.body.password) delete req.body.password
      userdata = await userservice.updateuser(req.body)
      console.log("userdata==>", userdata)
      message = "Successfully Updated"
    } else {
      if (req.body.email) {
        req.body.email = req.body.email.trim()
      }
      userdata = await userservice.insertuser(req.body)
      console.log("userdata==>", userdata)
      message = "User added successfully"
    }
    if (!userdata) {
      throw "Something Went Wrong !"
    }

    return res.send({
      success: true,
      status: 200,
      message: message,
      data: userdata,
    })
  } catch (err) {
    console.log("catch err==", err)
    if (err.message) {
      message = err.message
    } else {
      {
        message = err
      }
    }
    console.log("catch err.message==", err.message)
    return res.send({
      success: false,
      message: message,
    })
  }
}

//-------------find users from user collection------------------//

const findUsers = async (req, res, next) => {
  let userdata
  let message = ""
  try {
    userdata = await userservice.fetchusers()
    console.log("userdata==>", userdata)
    message = "User found successfully"

    if (!userdata) {
      throw "Something Went Wrong !"
    }

    return res.send({
      success: true,
      status: 200,
      message: message,
      data: userdata,
    })
  } catch (err) {
    console.log("catch err==", err)
    if (err.message) {
      message = err.message
    } else {
      {
        message = err
      }
    }
    console.log("catch err.message==", err.message)
    return res.send({
      success: false,
      message: message,
    })
  }
}

async function login(req, res, next) {
  console.log("req.body==", req.body)
  try {
    if (!req.body.email && !req.body.phone) {
      throw "Email is required !"
    }
    if (!req.body.password) {
      throw "Password is required !"
    }
    const userExist = await userservice.findbyQuery(req.body)
    console.log("userExist==", userExist)
    if (!userExist) {
      console.log("The user doesn't exist !")
      throw "The User doesn't exist !"
    }
    const passwordMatch = await userservice.comparePassword({
      entered_pw: userExist.password,
      found_pw: req.body.password,
    })
    console.log("passwordMatch==", passwordMatch)
    if (!passwordMatch) {
      console.log("Wrong Password entered !")
      throw "Wrong Password entered !"
    }
    const jwt = await userservice.jwtCreate()
    console.log("jwt==", jwt)
    if (!jwt) {
      throw "Token could not be created !"
    }

    return res.send({
      success: true,
      message: "Login Successfull",
      userData: userExist,
      jwt,
    })
  } catch (error) {
    // return next(error)
    return res.send({
      success: false,
      message: error,
    })
  }
}

const fetchOneUser = async (req, res, next) => {
  let userdata
  let message = ""
  try {
    userdata = await userservice.findbyQuery(req.body)
    console.log("userdata==>", userdata)
    message = "User found successfully"

    if (!userdata) {
      throw "Something Went Wrong !"
    }
    return res.send({
      success: true,
      status: 200,
      message: message,
      data: userdata,
    })
  } catch (err) {
    console.log("catch err==", err)
    if (err.message) {
      message = err.message
    } else {
      {
        message = err
      }
    }
    console.log("catch err.message==", err.message)
    return res.send({
      success: false,
      message: message,
    })
  }
}

async function changePassword(req, res, next) {
  console.log("req.body==", req.body)
  let mailResultMsg
  let data_for_email = []
  let fullName = ""

  try {
    if (!req.body.oldpassword) {
      throw "Please enter old Password !"
    }
    const userExist = await userservice.findbyQuery({
      _id: req.body._id,
      project: "password email firstname lastname",
    })
    console.log("userExist==", userExist)
    if (!userExist) {
      console.log("The user doesn't exist !")
      throw "The User doesn't exist !"
    }
    if (userExist.firstname && userExist.lastname) {
      fullName = userExist.firstname + " " + userExist.lastname
    } else fullName = userExist.firstname

    data_for_email.push({ email: userExist.email, name: fullName })
    console.log("data_for_email in controller==", data_for_email)

    const passwordMatch = await userservice.comparePassword({
      entered_pw: userExist.password,
      found_pw: req.body.oldpassword,
    })
    if (!passwordMatch) {
      console.log("Wrong Old Password entered !")
      throw "Wrong Old Password entered !"
    }
    // console.log("passwordMatch==", passwordMatch)

    if (!req.body.newpassword) {
      throw "Please enter new Password !"
    }
    if (req.body.newpassword == req.body.oldpassword) {
      throw "New password cannot be same as old one!"
    }
    if (req.body.newpassword != req.body.confirmpassword) {
      throw "New password does not match, confirm it again!"
    }

    const userdata = await userservice.updateuser({
      _id: req.body._id,
      password: req.body.newpassword,
    })
    console.log("userdata==>", userdata)
    if (!userdata) throw "Something went wrong while updating !"

    try {
      const mailresp = await emailService.sendemail(
        data_for_email,
        "changePassword"
      )
      // console.log("mailresp==", mailresp)
      if (mailresp.messageId) mailResultMsg = "and Email sent."
    } catch (mailerr) {
      console.log("mailerr==", mailerr)
      mailResultMsg = "but Email could not be sent !"
    }

    return res.send({
      success: true,
      status: 200,
      message: "Password changed Successfully " + mailResultMsg,
      userData: userdata,
    })
  } catch (error) {
    console.log("error==", error)
    // return next(error)
    return res.send({
      success: false,
      message: error,
    })
  }
}

async function forgotPassword(req, res, next) {
  console.log("req.body==", req.body)
  let mailResultMsg
  let data_for_email = []
  let fullName = ""

  try {
    if (!req.body.email) {
      throw "Please enter email-id !"
    }
    const userExist = await userservice.findbyQuery({
      email: req.body.email,
      // project: "password email firstname lastname",
    })
    console.log("userExist==", userExist)

    if (!userExist) {
      console.log("The user doesn't exist !")
      throw "The User doesn't exist !"
    }
    if (userExist.firstname && userExist.lastname) {
      fullName = userExist.firstname + " " + userExist.lastname
    } else fullName = userExist.firstname

    const userdata = await userservice.updateuser({
      email: req.body.email,
      verificationAddedTime: Date.now(),
      verificationCode: await makeRandomString(8),
    })
    console.log("userdata==>", userdata)
    if (!userdata) throw "Something went wrong while updating !"

    data_for_email.push({
      email: userExist.email,
      name: fullName,
      resetLink:
        req.body.baseurl +
        "/reset-password/" +
        userdata.verificationCode +
        `/${userdata._id}`,
    })
    console.log("data_for_email in controller==", data_for_email)

    try {
      const mailresp = await emailService.sendemail(
        data_for_email,
        "forgotPassword"
      )
      // console.log("mailresp==", mailresp)
      if (mailresp.messageId)
        mailResultMsg = "Reset link has been sent to your email successfully."
    } catch (mailerr) {
      console.log("mailerr==", mailerr)
      mailResultMsg = "Email could not be sent !"
    }

    return res.send({
      success: true,
      status: 200,
      message: mailResultMsg,
      userData: userdata,
    })
  } catch (error) {
    console.log("error==", error)
    // return next(error)
    return res.send({
      success: false,
      message: error,
    })
  }
}

async function resetPassword(req, res, next) {
  console.log("req.body==", req.body)

  let mailResultMsg
  let data_for_email = []
  let fullName = ""
  console.log("req.params==", req.params)
  try {
    if (req.body.password != req.body.confirmpassword) {
      throw "Password does not match, confirm it again!"
    }

    if (req.body.password) {
      req.body.password = await userservice.encryptFromOtherFunc(
        req.body.password
      )
    }
    const userExist = await userservice.findbyQuery({
      _id: req.body._id,
      // project: "password email firstname lastname",
    })
    console.log("userExist==", userExist)

    if (!userExist) {
      console.log("The user doesn't exist !")
      throw "The User doesn't exist !"
    }

    if (!userExist.verificationAddedTime || !userExist.verificationCode) {
      console.log("You have not requested to reset password !")
      throw "You have not requested to reset password !"
    }

    if (userExist.verificationCode != req.body.verificationCode) {
      console.log("You are not the person !")
      throw "You are not the person !"
    }

    if (Date.now() - userExist.verificationAddedTime > 86400000) {
      console.log("verification code expired !")
      throw "verification code expired !"
    }

    if (userExist.firstname && userExist.lastname) {
      fullName = userExist.firstname + " " + userExist.lastname
    } else fullName = userExist.firstname

    const userdata = await userservice.updateuser({
      _id: req.body._id,
      to_be_updated: {
        $unset: { verificationAddedTime: 1, verificationCode: 1 },
        $set: { password: req.body.password },
      },
    })
    console.log("userdata==>", userdata)
    if (!userdata) throw "Something went wrong while updating !"

    data_for_email.push({
      email: userExist.email,
      name: fullName,
    })
    console.log("data_for_email in controller==", data_for_email)

    try {
      const mailresp = await emailService.sendemail(
        data_for_email,
        "resetPassword"
      )
      // console.log("mailresp==", mailresp)
      if (mailresp.messageId)
        mailResultMsg = "Your password has been updated successfully."
    } catch (mailerr) {
      console.log("mailerr==", mailerr)
      mailResultMsg = "Email could not be sent !"
    }

    return res.send({
      success: true,
      status: 200,
      message: mailResultMsg,
      userData: userdata,
    })
  } catch (error) {
    console.log("error==", error)
    // return next(error)
    return res.send({
      success: false,
      message: error,
    })
  }
}

const getUserCryptoBalance = async (req, res, next) => {
  if (!req.body.userId) {
    return res.status(404).send({ message: "Please Input userId" })
  } else {
    try {
      const userEthereumWalletDetails = await etherservice.findDocument({
        userId: req.body.userId,
      })

      console.log("userEthereumWalletDetails==", userEthereumWalletDetails)

      if (userEthereumWalletDetails == null)
        throw "You haven't added this crypto account yet !"

      const accountAddress = await userEthereumWalletDetails.accounts[0]
      console.log("accountAddress==", accountAddress)

      const userEthAccountBalance = await EthereumController.getEthereumBalance(
        accountAddress.address
      )
      return res.send({
        success: true,
        status: 200,
        data: userEthAccountBalance,
      })
    } catch (err) {
      console.log("catch err==", err)
      return res.send({
        success: false,
        message: err,
      })
    }
  }
}

//------------------add customer by a merchant--------------------------------//
const addCustomerbyMerchant = async (req, res, next) => {
  let userdata
  let message = ""
  try {
    // console.log("req.body ==", req.body)

    if (req.body.email) {
      req.body.email = req.body.email.trim()
    }
    userdata = await customerservice.insertCustomer(req.body)
    console.log("userdata==>", userdata)
    message = "Customer added successfully."

    if (!userdata) {
      throw "Something Went Wrong !"
    }

    return res.send({
      success: true,
      status: 200,
      message: message,
      data: userdata,
    })
  } catch (err) {
    console.log("catch err==", err)
    if (err.message) {
      message = err.message
    } else {
      {
        message = err
      }
    }
    console.log("catch err.message==", err.message)
    return res.send({
      success: false,
      message: message,
    })
  }
}

//---------------------edit a customer--------------------------------------//

const customerEdit = async (req, res, next) => {
  console.log("req.body==", req.body)
  console.log("req.params==", req.params)

  try {
    const updatedCustomer = await customerservice.editCustomer({
      to_be_updated: req.body,
      _id: req.params._id,
    })

    console.log("updatedCustomer in controller==", updatedCustomer)

    return res.send({
      success: true,
      status: 200,
      message: "Customer data Updated successfully",
      updatedCustomer,
    })
  } catch (err) {
    return res.send({
      success: false,
      status: 500,
      message: err.message,
    })
  }
}

//----------------- customers list---------------------//
const getAllCustomers = async (req, res, next) => {
  let customerData
  let message = ""
  let merchantId = req.body.merchantId
  try {
    customerData = await customerservice.fetchcustomers(merchantId)
    console.log("customerData==>", customerData)
    message = "User found successfully"

    if (!customerData) {
      throw "Something Went Wrong !"
    }

    return res.send({
      success: true,
      status: 200,
      message: message,
      data: customerData,
    })
  } catch (err) {
    console.log("catch err==", err)
    if (err.message) {
      message = err.message
    } else {
      {
        message = err
      }
    }
    console.log("catch err.message==", err.message)
    return res.send({
      success: false,
      message: message,
    })
  }
}

//----------------- single customer fetch---------------------//

const getSingleCustomer = async (req, res, next) => {
  let message = ""

  try {
    const customerData = await customerservice.findbyQuery({
      _id: req.query._id,
    })
    console.log("customerData==>", customerData)
    message = "Customer found successfully"

    if (customerData === null) {
      throw "Something Went Wrong !"
    }

    return res.send({
      success: true,
      status: 200,
      message: message,
      data: customerData,
    })
  } catch (err) {
    console.log("catch err==", err)
    if (err.message) {
      message = err.message
    } else {
      {
        message = err
      }
    }
    console.log("catch err.message==", err.message)
    return res.send({
      success: false,
      message: message,
    })
  }
}

//--------------delete a single customer---------------------------//

const customerDelete = async (req, res, next) => {
  try {
    const deleted = await customerservice.deleteSingleCustomer(req.params.id)
    console.log("deleted==", deleted)
    if (deleted == null) throw "data not found"

    return res.send({
      success: true,
      status: 200,
      message: "deleted successfully",
      deleted,
    })
  } catch (err) {
    console.log("err==", err)
    return res.send({ message: err, success: false, status: 500 })
  }
}

//----------payment via crypto-------------------//

const makePayment = async (req, res, next) => {
  let message = ""
  try {
    const paymentData = await EthereumController.sendEterAddrsToAddrs({
      ...req.body,
    })
    console.log("paymentData==>", paymentData)

    if (!paymentData) {
      throw "Something Went Wrong !"
    }

    if (paymentData.status != 200) throw paymentData.transaction_data.message

    return res.send({
      success: true,
      status: paymentData.status ? paymentData.status : 200,
      message: "Payment done successfully",
      paymentData,
    })
  } catch (err) {
    console.log("catch err==", err)

    return res.send({
      success: false,
      message: err,
    })
  }
}

//----------------find all transactions-------------------//

const fetchTransactions = async (req, res, next) => {
  try {
    const transactionData = await transactionService.findTransactions({
      ...req.body,
    })
    console.log("transactionData==", transactionData)

    return res.send({
      success: true,
      status: 200,
      message: "Found successfully",
      transactionData,
    })
  } catch (error) {
    console.log("catch error==", error)

    return res.send({
      success: false,
      message: error,
    })
  }
}

//---------- test purpose------------//

const test = async (req, res, next) => {
  try {
    const pdfFile = pdfService.createPdf()

    console.log("pdfFile==", pdfFile)

    return res.send({
      success: true,
      status: 200,
    })
  } catch (err) {
    console.log("catch err==", err)

    return res.send({
      success: false,
      message: err,
    })
  }
}

module.exports = {
  addUpdateUser,
  login,
  findUsers,
  fetchOneUser,
  changePassword,
  forgotPassword,
  resetPassword,
  getUserCryptoBalance,
  addCustomerbyMerchant,
  customerEdit,
  getAllCustomers,
  customerDelete,
  getSingleCustomer,
  makePayment,
  fetchTransactions,
  test,
}
