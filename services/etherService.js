"use strict"
const mongoose = require("mongoose")
const fetch = require("node-fetch")

const ethers = require("../models/ethereum")

// insert new ethereum details
exports.inserEtherData = body => {
  //   console.log("body==", body)

  const ethersdoc = new ethers({
    ...body,
  })
  //   console.log("userdoc==", userdoc)
  return ethersdoc.save()
}

// update ethereum data
exports.updateEtherDoc = body => {
  console.log("body==", body)

  let qry = {}
  let to_be_updated = {}
  // return 1
  if (body.mnemonic && body.pvt_key && body.index >= 0) {
    qry = { mnemonic: body.mnemonic }
    to_be_updated = {
      $push: {
        privateKey: {
          $each: [{ key: body.pvt_key.key, index: body.index }],
          $position: 0,
        },
      },
    }
  }
  if (body.transaction_data && body.xpub) {
    qry = { xpub: body.xpub }
    console.log("qry==", qry)
    // return
    to_be_updated = {
      $push: {
        txId: {
          $each: [body.transaction_data.txId],
          $position: 0,
        },
      },
      $inc: { nonce: 1 },
    }
    // console.log("to_be_updated==", to_be_updated)
  }
  if (body.xpub && body.address && body.index >= 0) {
    console.log("body.xpub && body.address && body.index")
    qry = { xpub: body.xpub }
    // to_be_updated = { accountAddress: body.address }
    to_be_updated = {
      $push: {
        accounts: {
          $each: [{ address: body.address, index: body.index }],
          $position: 0,
        },
      },
    }
  }

  console.log("to_be_updated==", to_be_updated)
  console.log("qry==", qry)

  return ethers.findOneAndUpdate(qry, to_be_updated, {
    new: true,
    upsert: true,
  })
}

// update many ethereum data
exports.updateManyEtherDoc = body => {
  console.log("body==", body)

  let qry = {}
  let to_be_updated = {}

  if (body.transaction_data && body.xpub) {
    qry = { xpub: { $in: body.xpub } }
    console.log("qry==", qry)
    // return
    to_be_updated = {
      $push: {
        txId: {
          $each: [body.transaction_data.txId],
          $position: 0,
        },
      },
      $inc: { nonce: 1 },
    }
  }

  console.log("to_be_updated==", to_be_updated)
  console.log("qry==", qry)

  return ethers.updateMany(qry, to_be_updated, {
    new: true,
    upsert: true,
  })
}

// find doc
exports.findDocument = body => {
  // console.log("body==", body)

  let populate

  if (
    body.populate_field &&
    body.populate_from_collection &&
    (body.populate_field != null || body.populate_field != "") &&
    (body.populate_from_collection != null ||
      body.populate_from_collection != "")
  ) {
    populate = {
      path: body.populate_field,
      model: body.populate_from_collection,
    }
  }

  let query = {}
  if (body.xpub) {
    query = { xpub: body.xpub }
  }

  if (body.userId) {
    query = { userId: body.userId }
  }

  if (body.accountAddress) {
    query = { accounts: { $elemMatch: { address: body.accountAddress } } }
  }

  return ethers.findOne(query).populate(populate)
}
