const express = require("express")
const productController = require("../controllers/productController")
const route = express.Router()

route.post("/createOrUpdateProduct", productController.createOrUpdateProduct)
route.put("/getOneProduct/:id", productController.findOneProduct)
route.delete("/deleteProduct", productController.deleteProduct)
route.post("/getAllProducts", productController.findAllProducts)

module.exports = route
