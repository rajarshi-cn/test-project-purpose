"use strict"

const mongoose = require("mongoose")

const customers = require("../models/customerUsers")

// insert new customer
exports.insertCustomer = body => {
  console.log("body==", body)

  const custodoc = new customers({
    ...body,
  })

  return custodoc.save()
}

// edit customer
exports.editCustomer = body => {
  console.log("body in edit==", body)
  let query = {},
    to_be_updated = {}

  if (
    body._id &&
    body._id !== "" &&
    body.to_be_updated &&
    body.to_be_updated !== null
  ) {
    query = { _id: body._id }
    to_be_updated = body.to_be_updated
  }

  return customers.findByIdAndUpdate(query, to_be_updated, {
    new: true,
  })
}

// find a customer by any query
exports.findbyQuery = body => {
  console.log("body==", body)

  let query = {}
  let project = ""

  if (body._id && body._id != "") {
    query = { _id: body._id }
  }

  if (
    body.fetchflag &&
    body.fetchflag == "login & signup" &&
    body.gapiData &&
    body.gapiData.sub
  ) {
    query = { sub: body.gapiData.sub }
  }

  console.log("query==", query)

  return customers.findOne(query, project)
}

// fetch customers
exports.fetchcustomers = merchantId => {
  return customers.find({ merchantId: merchantId }).sort({ _id: -1 })
}

//----------- delete single customer------------------------------//
exports.deleteSingleCustomer = id => {
  return customers.findByIdAndDelete(id)
}
