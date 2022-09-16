"use strict"
const fs = require("fs")
const path = require("path")
const PDFDocument = require("pdfkit")
const Order = require("../models/order")
const Product = require("../models/products")
const Customer = require("../models/customerUsers")
const Merchant = require("../models/users")
const EthModel = require("../models/ethereum")
const mongoose = require("mongoose")

const generateInvoice = async (data_for_invoice, flag) => {
  if (flag == "orderInvoice") {
    let invoice = {
      shipping: {
        name: data_for_invoice.customerName,
        email: data_for_invoice.customerEmail,
      },
      items: data_for_invoice.allOrders,
      alltotal: data_for_invoice.totalPrice,
      discountedPrice: data_for_invoice.discountedPrice,
      invoiceNum: data_for_invoice.invoiceNumber,
    }
    console.log("invoice==", invoice)
    // let pathInvoice = "../invoice/invoice.pdf"
    let doc = new PDFDocument({ margin: 50 })

    function generateHeader(doc) {
      doc
        .fillColor("#444444")
        .fontSize(20)
        .text("Capital Numbers", 110, 57)
        .fontSize(10)
        .text("123 Main Street", 200, 65, { align: "right" })
        .text("New York, NY, 10025", 200, 80, { align: "right" })
        .moveDown()
    }

    function generateFooter(doc) {
      doc
        .fontSize(10)
        .text(
          "Payment is due within 15 days. Thank you for your business.",
          50,
          780,
          { align: "top", width: 500 }
        )
    }

    function generateCustomerInformation(doc, invoice) {
      const shipping = invoice.shipping

      doc
        .text(`Order Number: ${invoice.invoiceNum}`, 50, 200)
        .text(`Invoice Date: ${new Date()}`, 50, 215)
        .text(shipping.name, 400, 200)
        .text(shipping.email, 400, 215)
        .moveDown()
    }

    function generateTableRow(doc, y, c1, c2, c3, c4) {
      doc
        .fontSize(10)
        .text(c1, 50, y)
        .text(c2, 280, y, { width: 90, align: "right" })
        .text(c3, 370, y, { width: 90, align: "right" })
        .text(c4, 0, y, { align: "right" })
        .text(
          `Total Amount after applying discount: ${invoice.discountedPrice}`,
          50,
          130
        )
    }

    function generateInvoiceTable(doc, invoice) {
      let i,
        invoiceTableTop = 330

      for (i = 0; i < invoice.items.length; i++) {
        const item = invoice.items[i]
        const position = invoiceTableTop + (i + 1) * 30
        generateTableRow(
          doc,
          position,
          item.productTitle,
          item.price,
          item.quantity,
          item.priceWithQuantity
        )
      }
    }

    generateHeader(doc)
    generateCustomerInformation(doc, invoice)
    generateInvoiceTable(doc, invoice)
    generateFooter(doc)

    // console.log("doc==", doc)

    let created = doc.pipe(
      fs.createWriteStream(
        path.join(
          __dirname,
          `../tmp/pdf/${
            data_for_invoice.customerName
          }_${new Date().getTime()}.pdf`
        )
      )
    )
    doc.end()
    return created
  }
}

const createOrUpdateOrder = async orderData => {
  // console.log("orderData==", orderData)

  let id = orderData.orderId
  if (!id) {
    const specificOrder = orderData.orderDetails
    let totalPrice = 0
    let allOrders = []
    let query = {}

    for (let object of specificOrder) {
      const product = await Product.findById(object.product)
      console.log("product==", product)
      const productPrice = parseInt(product.price)

      // const productId = object.product

      const productTitle = product.title

      // object.productId = mongoose.Types.ObjectId(object.product)
      object.product = mongoose.Types.ObjectId(object.product)

      object.productTitle = productTitle

      object.eachUnitPrice = productPrice

      const quantity = parseInt(object.quantity)

      const eachPrice = productPrice * quantity

      object.priceWithQuantity = eachPrice

      totalPrice = totalPrice + eachPrice

      allOrders.push(object)

      if (allOrders.length == specificOrder.length) {
        let finalPrice = 0
        const discountPercentage = orderData.discountPercentage
          ? orderData.discountPercentage
          : 0
        if (discountPercentage == 0) {
          finalPrice = totalPrice
        } else {
          const discountAmount = (discountPercentage / 100) * totalPrice

          finalPrice = totalPrice - discountAmount
        }

        query = {
          order: allOrders,
          totalPrice: totalPrice,
          customerId: orderData.customerId,
          merchantId: orderData.merchantId,
          //orderId: orderData.orderId,
          discountPercentage: discountPercentage,
          discountedFinalPrice: finalPrice,
        }

        const customerDoc = await Customer.findById(query.customerId)

        const customerEmail = await customerDoc.email
        const customerName = await customerDoc.name

        const customerFirstName = await customerDoc.given_name
        const merchantDoc = await Merchant.findById(query.merchantId)
        const merchantName = await merchantDoc.firstname
        const merchantEthDoc = await EthModel.findOne({
          userId: query.merchantId,
        })

        const merEthAccAddr = await merchantEthDoc.accounts[0].address
      }
    }
    // console.log("query ==", query)

    return Order.create({
      order: query.order,
      totalPrice: query.totalPrice,
      merchantId: query.merchantId,
      customerId: query.customerId,
      discountPercentage: query.discountPercentage,
      discountedPrice: query.discountedFinalPrice,
    })
  } else {
    // console.log("orderData in edit part==", orderData)
    const specificOrder = orderData.orderDetails
    let totalPrice = 0
    let allOrders = []
    let updateQuery = {}

    for (let object of specificOrder) {
      const product = await Product.findById(object.product)

      const productPrice = parseInt(product.price)

      // const productId = object.product

      const productTitle = product.title

      // object.productId = mongoose.Types.ObjectId(object.product)
      object.product = mongoose.Types.ObjectId(object.product)

      object.productTitle = productTitle

      object.eachUnitPrice = productPrice

      const quantity = parseInt(object.quantity)

      const eachPrice = productPrice * quantity

      object.priceWithQuantity = eachPrice

      totalPrice = totalPrice + eachPrice

      allOrders.push(object)

      if (allOrders.length == specificOrder.length) {
        let finalPrice = 0
        const discountPercentage = orderData.discountPercentage
          ? orderData.discountPercentage
          : 0
        if (discountPercentage == 0) {
          finalPrice = totalPrice
        } else {
          const discountAmount = (discountPercentage / 100) * totalPrice

          finalPrice = totalPrice - discountAmount
        }

        updateQuery = {
          order: allOrders,
          totalPrice: totalPrice,
          customerId: orderData.customerId,
          merchantId: orderData.merchantId,
          discountPercentage: discountPercentage,
          discountedPrice: finalPrice,
        }
      }
    }
    // console.log("updateQuery==", updateQuery)
    return Order.findByIdAndUpdate(id, updateQuery, {
      new: true,
    })
  }
}
const updateOrder = async (id, updateBody) => {
  return Order.findByIdAndUpdate(id, updateBody, {
    new: true,
  })
}

const deleteOrder = async id => {
  const deleted = await Order.findByIdAndDelete(id)
  return deleted
}

const getAllOrdersByMerchantId = async query => {
  const options = {
    populate: [{ path: "customerId" }],
    page: query.page,
    limit: query.limit,
    sort: { _id: -1 },
  }

  const allOrders = await Order.paginate(query.searchQuery, options)

  return allOrders
}

const getOrderById = async id => {
  const order = await Order.findById(id)
  return order
}

module.exports = {
  generateInvoice,
  createOrUpdateOrder,
  getAllOrdersByMerchantId,
  getOrderById,
  deleteOrder,
  updateOrder,
}
