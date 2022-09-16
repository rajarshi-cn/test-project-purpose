const express = require("express")
const orderController = require("../controllers/orderController")
const route = express.Router()

route.post("/generateOrder", orderController.createOrderMerchant)
route.post(
  "/createInvoiceAndSendMail",
  orderController.createInvoiceAndSendMail
)
route.post("/resendOrderEmail", orderController.resendOrderEmail)
route.get("/getAllOrdersForMerchant", orderController.allOrdersMerchant)
route.get("/getOrderById", orderController.findOneOrderById)
route.delete("/deleteOrder/:id", orderController.orderDelete)
route.put("/editOrder/:id", orderController.orderEdit)

module.exports = route
