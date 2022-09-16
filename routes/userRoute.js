"use strict"

const express = require("express")
const userrouter = express.Router()

const usercontroler = require("../controllers/userController")
const gapi = require("../controllers/gapi")
const middleware = require("../middlewares/middleware")
const passport = require("passport")
require("../middlewares/passport-middleware")

userrouter.get("/profile", (req, res) => {
  res.send(req.user)
})

userrouter.post(
  "/addUpdateUser",
  // middleware.verifytoken,
  usercontroler.addUpdateUser
)

userrouter.post(
  "/addCustomerbyMerchant",
  // middleware.verifytoken,
  usercontroler.addCustomerbyMerchant
)

userrouter.post(
  "/fetchOneUser",
  // middleware.verifytoken,
  usercontroler.fetchOneUser
)

userrouter.get(
  "/findUsers",
  //  middleware.verifytoken,
  usercontroler.findUsers
)
userrouter.post("/login", usercontroler.login)
userrouter.post("/changePassword", usercontroler.changePassword)
userrouter.post("/forgotPassword", usercontroler.forgotPassword)
userrouter.post("/resetPassword", usercontroler.resetPassword)
userrouter.post("/getGapiUrl", gapi.getGapiUrl)
userrouter.get("/sessons/oauth/google", gapi.gapiUserData)
userrouter.post("/getCryptoBalance", usercontroler.getUserCryptoBalance)
userrouter.post("/getAllCustomers", usercontroler.getAllCustomers)
userrouter.get("/getSingleCustomer", usercontroler.getSingleCustomer)
userrouter.post("/makePayment", usercontroler.makePayment)
userrouter.post("/fetchTransactions", usercontroler.fetchTransactions)
userrouter.post("/test", usercontroler.test)
userrouter.delete("/customerDelete/:id", usercontroler.customerDelete)
userrouter.put("/customerEdit/:_id", usercontroler.customerEdit)

userrouter.get("/failed", (req, res) => res.send("You Failed to log in!"))

// userrouter.get("/good", (req, res) => {
//   console.log("insideGood");
//   res.send({
//     firstname: req.profile.name.givenName,
//     lastname: req.profile.name.familyName,
//     //email: req.existingUser.email,
//     profile: "google"
//   })
// })

userrouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
)

userrouter.get(
  "/google/callback",
  passport.authenticate("google"),
  (req, res) => {
    if (req.user) {
      res.render("profile", { user: req.user })
    } else {
      res.send("user not logged in")
    }
  }
)

module.exports = userrouter
