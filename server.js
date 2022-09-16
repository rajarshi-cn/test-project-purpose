var express = require("express")
const mongoose = require("mongoose")
var cookieParser = require("cookie-parser")
var logger = require("morgan")
const dotenv = require("dotenv")
const cors = require("cors")
const passport = require("passport")
require("./middlewares/passport-middleware")
dotenv.config()

const swaggerJsDoc = require("swagger-jsdoc")
const swaggerUI = require("swagger-ui-express")
const cookieSession = require("cookie-session")
const session = require("express-session")

var app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())
app.use(cookieParser())
app.set("view engine", "ejs")

// app.use(cookieSession({
//   maxAge:24*60*60*1000,
//   keys:['secretValue']
// }))

app.use(
  session({
    secret: "somethingsecretgoeshere",
    maxAge: 1 * 60 * 60 * 1000,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
  })
)

app.use(passport.initialize())
app.use(passport.session())

const userRoute = require("./routes/userRoute.js")
const ethereumRoute = require("./routes/ethereumRoute")
const bitcoinRoute = require("./routes/bitcoinRoute")
const adaRoute = require("./routes/adaRoute")
const productRoute = require("./routes/productRoute")
const orderRoute = require("./routes/orderRoute")

mongoose
  .connect(process.env.db_local, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
  })
  .then(() => {
    console.log("Database Connected")
  })
  .catch(error => {
    console.log("UNABLE to connect to DB because=", error)
  })

app.listen(3000, function () {
  // var host = app.address().address
  // var port = app.address().port
  console.log("Example app listening at", 3000)
  // console.log("app=", app)
  //    console.log("host=",host);
  //    console.log("port=",port);
})

// const swaggerOptions = {
//   swaggerDefinition: {
//     openapi: "3.0.0",
//     info: {
//       title: "User Apis",
//       version: "1.0.0",
//     },
//   },
//   apis: ["./routes/userRoute.js"],
// }

// const swaggerDocs = swaggerJsDoc(swaggerOptions)

// console.log("swaggerDocs==", swaggerDocs)

// // console.log("swaggerOptions==", swaggerOptions)
// console.log("swaggerUI.setup(swaggerDocs)==", swaggerUI.setup(swaggerDocs))
// /**
//  *@swagger
//  * /user:
//  *   get:
//  *     description: Get all users
//  *     responses:
//  *       200:
//  *        description: Success
//  *
//  **/
// app.get("/", (req, res) => {
//   res.send("Hello World!")
// })
// app.use(function (req, res, next) {
//   req.setEncoding("utf8")
//   let hdr = res.setHeader("Access-Control-Allow-Origin", "*")
//   console.log("res.setHeader==", hdr)
//   next()
// })
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "http://localhost:4200")
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   )
//   next()
// })

app.use("/api/user", userRoute)
app.use("/api/ethereum", ethereumRoute)
app.use("/api/bitcoin", bitcoinRoute)
app.use("/api/ada", adaRoute)
app.use("/api/product", productRoute)
app.use("/api/order", orderRoute)

// app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs))
