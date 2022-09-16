const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ether = new mongoose.Schema({
  xpub: String,
  mnemonic: String,
  accounts: Array,
  userId: {
    type: Schema.Types.ObjectId,
    //ref: "users",
  },
  // userId: {
  //   type: Schema.Types.ObjectId,
  //   refPath: "user_collections",
  // },
  // user_collections: {
  //   type: String,
  //   enum: ["users", "customers"],
  //   // required: true,
  // },
  privateKey: Array,
  nonce: Number,
  txId: { type: Array, default: undefined },
})

// module.exports = mongoose.models("ethereumDetails", ether)

const etherdb = mongoose.model("ethereumDetails", ether)
module.exports = etherdb
