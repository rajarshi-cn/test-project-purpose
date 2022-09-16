"use strict"

const mongoose = require("mongoose")

const transaction = require("../models/transaction")

// insert new transaction
exports.insertTransaction = body => {
  //   console.log("body in insertTransaction==", body)

  const transactiondoc = new transaction({
    ...body,
  })

  return transactiondoc.save()
}

// ----------fetch transactions---------//
exports.findTransactions = body => {
  console.log("body==", body)

  let query = {}

  if (body.userId && body.userId != null && body.userId != "") {
    query = {
      $or: [
        { "from.userId": mongoose.Types.ObjectId(body.userId) },
        { "to.userId": mongoose.Types.ObjectId(body.userId) },
      ],
    }
  }

  return transaction.find(query).sort({ _id: -1 })
}
