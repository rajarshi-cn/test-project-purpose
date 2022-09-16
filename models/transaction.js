const mongoose = require("mongoose")

var trans = new mongoose.Schema(
  {
    txId: {
      type: String,
    },
    amount: {
      type: String,
    },
    currency: {
      type: String,
    },
    from: {
      type: Object,
    },
    to: {
      type: Object,
    },
  },
  { timestamps: true }
)
const transdb = mongoose.model("transaction", trans)
module.exports = transdb
