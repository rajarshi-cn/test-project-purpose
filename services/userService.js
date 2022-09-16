"use strict"
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const crypto = require("crypto")
const users = require("../models/users")
// const users = require("../models/user_joi")
const jwt = require("jsonwebtoken")
var base64 = require("nodejs-base64-converter")
var nodemailer = require("nodemailer")
const fetch = require("node-fetch")
var qs = require("qs")

// function for encrypting anything
function encrypt(text) {
  // console.log("text==", text)
  let cipher = crypto.createCipher(
    process.env.algorithm,
    process.env.supersecret
  )
  let encryptedData = cipher.update(text, "utf-8", "hex")
  encryptedData += cipher.final("hex")
  return encryptedData
}

// function for decrypting anything //
function decrypt(text) {
  const decipher = crypto.createDecipher(
    process.env.algorithm,
    process.env.supersecret
  )
  let decryptedData = decipher.update(text, "hex", "utf-8")
  decryptedData += decipher.final("utf8")
  return decryptedData
}

// function for encrypting with hash
function hashEncrypt(text) {
  bcrypt.hash(text, 8, function (err, resp) {
    if (err) {
      console.log("password hash error==", err)
      return err
    }
    console.log(" hashed resp==", resp)
    return resp
  })
}

exports.encryptFromOtherFunc = text => {
  // console.log("text==", text)
  let cipher = crypto.createCipher(
    process.env.algorithm,
    process.env.supersecret
  )
  let encryptedData = cipher.update(text, "utf-8", "hex")
  encryptedData += cipher.final("hex")
  return encryptedData
}

// insert new user
exports.insertuser = body => {
  //   console.log("body==", body)
  body.password = encrypt(body.password)
  const userdoc = new users({
    ...body,
  })
  //   console.log("userdoc==", userdoc)
  return userdoc.save()
}

// body.houseCount = { $inc: { houseCount: 1 } }
// update user data
exports.updateuser = body => {
  console.log("body==", body)

  let qry = {},
    to_be_updated = {}

  if (body.password && (body.password != null || body.password != ""))
    body.password = encrypt(body.password)

  if (body._id) {
    qry = { _id: body._id }
  }
  if (body.email) {
    qry = { email: body.email }
  }

  if (body.to_be_updated) {
    to_be_updated = body.to_be_updated
  } else to_be_updated = { ...body }

  console.log("body after==", body)
  return users.findOneAndUpdate(qry, to_be_updated, { new: true })
}

// fetch users
exports.fetchusers = () => {
  let fields = "name  createdAt phone"
  return users.find({}).sort({ _id: -1 })
}

// find user by any query
exports.findbyQuery = body => {
  console.log("body==", body)
  let query = {}
  let project = ""
  if (body.project && body.project != "") project = body.project

  if (body.email || body.phone) {
    if (body.email) {
      query.email = body.email.trim().toLowerCase()
    } else {
      query.phone = body.phone
    }
  }

  if (body._id) {
    query = { _id: mongoose.Types.ObjectId(body._id) }
  }
  console.log("query==", query)

  return users.findOne(query, project)
}

// match passwords
exports.comparePassword = data => {
  console.log("data==", data)
  if (data.entered_pw == encrypt(data.found_pw)) return true
  else return false
}

// jwt create
exports.jwtCreate = function () {
  // console.log("jwtCreate hit")
  try {
    let token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
        foo: "bar",
      },
      base64.encode(process.env.supersecret)
    )
    // console.log("token==", token)
    return token
  } catch (err) {
    console.log("err in token creation==", err)
    return null
  }
}
