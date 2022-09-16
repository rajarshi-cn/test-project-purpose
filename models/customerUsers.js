const mongoose = require("mongoose")
const Schema = mongoose.Schema

const cus = new mongoose.Schema(
  {
    sub: {
      type: String,
    },
    name: {
      type: String,
    },
    given_name: {
      type: String,
    },
    family_name: {
      type: String,
    },
    picture: {
      type: String,
    },
    email: {
      type: String,
    },
    email_verified: {
      type: Boolean,
    },
    locale: {
      type: String,
    },
    hd: {
      type: String,
    },
    type: {
      type: String,
      default: "customer",
    },
    merchantId: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
)

const customerdb = mongoose.model("customers", cus)
module.exports = customerdb
