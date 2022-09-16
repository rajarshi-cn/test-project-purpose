"use strict"

const jwt = require("jsonwebtoken")
var base64 = require("nodejs-base64-converter")

exports.verifytoken = (req, res, next) => {
  let encodedsecret = base64.encode(process.env.supersecret)
  //   let tokenstatus
  console.log("req.headers==", req.headers)
  console.log("req.headers['authorization']==", req.headers["authorization"])
  try {
    let decoded = jwt.verify(req.headers["authorization"], encodedsecret)
    console.log("decoded==", decoded)
    return next()
    // return (tokenstatus = true)
  } catch (error) {
    console.log("error==", error)
    // console.log("error.message==", error.message);
    // return (tokenstatus = error.message)
    return next(error)
  }
}

exports.authCheck =(req,res,next)=>{
  if(!req.user){
    res.send('user not logged in');
  }else{
    next();
  }
}
