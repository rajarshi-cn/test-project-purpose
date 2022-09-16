const Mongoose = require("mongoose")
const Joigoose = require("joigoose")(Mongoose)
const Joi = require("joi")

var joiUserSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required().trim(),
  password: Joi.string().required(),
  phone: Joi.number(),
  //   phone: Joi.string().phone().required(),
  //   bestFriend: Joi.string().meta({
  //     _mongoose: { type: "ObjectId", ref: "User" },
  //   }),
  //   metaInfo: Joi.any(),
  //   addresses: Joi.array()
  //     .items({
  //       line1: Joi.string().required(),
  //       line2: Joi.string(),
  //     })
  //     .meta({ _mongoose: { _id: false, timestamps: true } }),
})
var mongooseUserSchema = new Mongoose.Schema(Joigoose.convert(joiUserSchema), {
  timestamps: true,
})

const User = Mongoose.model("users", mongooseUserSchema)
module.exports = User
