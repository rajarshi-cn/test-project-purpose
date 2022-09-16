"use strict"

const mongoose = require("mongoose")
const flash = require("req-flash")
require("dotenv").config()
const axios = require("axios")
const open = require("open")
const urlParse = require("url-parse")
const { google } = require("googleapis")
var http = require("http")
const fetch = require("node-fetch")

const customers = require("../models/customerUsers")
const customerService = require("../services/customerService")

/**
 * To use OAuth2 authentication, we need access to a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI
 * from the client_secret.json file. To get these credentials for your application, visit
 * https://console.cloud.google.com/apis/credentials.
 */

const oauth2Client = new google.auth.OAuth2(
  // client_id
  "130538332004-ugbl637c22vvlk6k2ggtklvguuuvgj42.apps.googleusercontent.com",
  // client_secret
  "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",
  // redirect_uri
  "http://localhost:3000/api/user/sessons/oauth/google"
)

exports.getGapiUrl = async function (req, res, next) {
  // console.log("google==", google)
  // console.log("req.body==", req.body)

  const scopes = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
  ]

  try {
    // Generate a url that asks permissions for the Drive activity scope
    const authorizationUrl = oauth2Client.generateAuthUrl({
      // 'online' (default) or 'offline' (gets refresh_token)
      access_type: "offline",
      /** Pass in the scopes array defined above.
       * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
      scope: scopes,
      // Enable incremental authorization. Recommended as a best practice.
      include_granted_scopes: true,

      state: JSON.stringify({
        flag: req.query.flag,
        type: req.body.type,
        successRedirectUrl: req.body.successRedirectUrl,
      }),
    })

    console.log("authorizationUrl==", authorizationUrl)

    // await open(authorizationUrl, "_self")

    // res.redirect(`${authorizationUrl}`)
    // res.writeHead(301, { Location: authorizationUrl })
    res.send(JSON.stringify(authorizationUrl))
    // res.send("<script>window.close()</script>")

    // res.end()
  } catch (err) {
    console.log("catch err==", err)

    return res.send({
      success: false,
      err: err,
    })
  }
}

exports.gapiUserData = async function (req, res, next) {
  // console.log("req==", req)
  // console.log("req.res==", req.res)

  const code = req.query.code
  const state = req.query.state
  console.log("code==", code)
  console.log("state==", state)
  const success_redirect_url = JSON.parse(state).successRedirectUrl
  // console.log("success_redirect_url==", success_redirect_url)

  // get refresh, access, Id_token
  const token = await oauth2Client.getToken(code)
  console.log("tokens==", token)
  const access_token = token.tokens.access_token
  const id_token = token.tokens.id_token

  //   oauth2Client.setCredentials(token.tokens)
  //   oauth2Client.setCredentials({
  //     refresh_token:
  //       "1//0gVGkilqpJBgyCgYIARAAGBASNwF-L9IrGW_-QXs-pklKI_2KL-Wj1CUjbRq21fjwAltS57-mv91GDhvXj1y8E2twW2nGVEkMHD8",
  //   })

  //   oauth2Client.on("token", token => {
  //     if (token.tokens.refresh_token) {
  //       // store the refresh_token in  database!
  //       console.log("on refresh=", token.tokens.refresh_token)
  //     }
  //     console.log("onaccess", token.tokens.access_token)
  //   })

  const result = await axios({
    method: "GET",
    "content-Type": "application/json",
    url: `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`,
    headers: {
      Authorization: `Bearer ${id_token}`,
    },
  })

  console.log("result.data==", result.data)
  result.data.type = JSON.parse(state).type

  try {
    let success = Boolean,
      status = Number,
      userInfo = undefined,
      message = ""

    if (!JSON.parse(state).flag) throw "flag not found"

    const customerData = await customerService.findbyQuery({
      gapiData: result.data,
      fetchflag: "login & signup",
    })
    console.log("customerData==", customerData)

    switch (JSON.parse(state).flag) {
      case "login":
        console.log("login case")

        if (customerData == null) {
          success = false
          status = 200
          throw "Please Signup first !"
        }

        if (customerData !== null) {
          success = true
          status = 200
          message = "Successfully logged in"
          userInfo = customerData

          res.cookie("userData", JSON.stringify(customerData))
          res.cookie("jwt", id_token)
          res.redirect(
            `${success_redirect_url}/${customerData.type}/${customerData._id}`
          )
          // res.send("<script> window.close()</script>")
          // return open(`http://localhost:4200/portofolio/${userInfo.sub}`, {
          //   app: ["google chrome", "--incognito"],
          // })
        }
        break

      case "signup":
        console.log("signup case")
        if (customerData !== null) {
          success = false
          status = 200
          throw "Your profile is already registered with us, please login"
        } else {
          const createdCustomer = await customerService.insertCustomer(
            result.data
          )
          console.log("createdCustomer==", createdCustomer)

          if (createdCustomer !== null) {
            success = true
            status = 200
            message = "Your profile registration successful."
            userInfo = createdCustomer
            res.cookie("userData", JSON.stringify(createdCustomer))
            res.cookie("jwt", id_token)

            res.redirect(
              `${success_redirect_url}/${createdCustomer.type}/${createdCustomer._id}`
            )
            // res.send("<script> window.close()</script>")
            // return open(`http://localhost:4200/portofolio/${userInfo.sub}`, {
            //   app: ["google chrome", "--incognito"],
            // })
          } else throw "something went wrong while registering !"
        }

        break
    }

    // return res.send({
    //   success,
    //   status,
    //   message,
    //   // userInfo,
    // })
  } catch (error) {
    console.log("catch error==", error)
    // return next(error)
    return res.send({
      success: false,
      message: error,
    })
  }
}
