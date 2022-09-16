const mongoose = require("mongoose")

var userschema = new mongoose.Schema(
  {
    googleId:{
      type: String,
    },
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    password: {
      type: String,
      //required: true,
    },
    type: {
      type: String,
      enum: ["admin", "customer", "merchant"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      //required: "Email address is required",
      // validate: [validateEmail, "Please fill a valid email address"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    phone: {
      // type: Number,
      // min: [10, "Must be at least 10, got {VALUE}"],
      // unique: true,
      type: Number,
      validate: {
        validator: function (v) {
          return /\d{10}/.test(v)
        },
        message: props => `${props.value} is not a valid phone number!`,
      },
      //required: [true, "User phone number required"],
    },
    company: {
      type: String,
    },
    companyWebsite: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationAddedTime: {
      type: Number,
    },
    verificationCode: {
      type: String,
    },
    token:{
      type:String,
    }
  },
  { timestamps: true }
)
const Userdb = mongoose.model("users", userschema)
module.exports = Userdb
