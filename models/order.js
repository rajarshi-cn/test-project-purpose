const mongoose = require("mongoose")
const Schema = mongoose.Schema
const mongoosePaginate = require("mongoose-paginate-v2")

const orderSchema = new mongoose.Schema(
  {
    order: [
      //     {
      //     product:String,
      //     quantity:Number,
      //     eachUnitPrice:Number,
      //     priceWithQuantity:Number
      //    }
    ],
    totalPrice: {
      type: Number,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "customers",
    },
    merchantId: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    discountedPrice: {
      type: Number,
    },
    paymentCompleted: {
      type: Boolean,
      default: false,
    },
    invoiceGenerated: {
      type: Boolean,
      default: false,
    },
    invoice: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)
orderSchema.plugin(mongoosePaginate)
const orderDB = mongoose.model("order", orderSchema)
module.exports = orderDB
