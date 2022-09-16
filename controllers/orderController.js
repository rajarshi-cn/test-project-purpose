"use strict"

const Order = require("../models/order")
const Product = require("../models/products")
const Invoice = require("../models/invoice")
const Customer = require("../models/customerUsers")
const Merchant = require("../models/users")
const EthModel = require("../models/ethereum")
const OrderService = require("../services/orderService")
const mongoose = require("mongoose")
const userservice = require("../services/userService")
const emailService = require("../services/email-service")
var easyinvoice = require("easyinvoice")

const createOrderMerchant = async (req, res, next) => {
  let orderCreated
  try {
    const orderCreationData = {
      orderDetails: req.body.order,
      merchantId: req.body.merchantId,
      customerId: req.body.customerId,
      discountPercentage: req.body.discountPercentage,
    }

    // let totalPrice = 0
    // let allOrders = []

    orderCreated = await OrderService.createOrUpdateOrder(orderCreationData)
    console.log("orderCreated in controller==", orderCreated)

    return res.send({
      success: true,
      status: 200,
      message: "Order Created successfully",
      createdOrder: orderCreated,
    })
  } catch (err) {
    return res.send({
      success: false,
      status: 500,
      message: err.message,
    })
  }
}

const createInvoiceAndSendMail = async (req, res, next) => {
  try {
    const { merchantId, customerId, _id, order, totalPrice, discountedPrice } =
      req.body

    let data_for_email = []
    let mailResultMsg = ""
    let statusApi

    const customer = await Customer.findById(customerId)

    const customerName = await customer.name
    const customerEmail = await customer.email

    const merchant = await Merchant.findById(merchantId)
    const merchantName = await merchant.firstname
    const merchantEmail = await merchant.email
    const merchantEthDoc = await EthModel.findOne({
      userId: merchantId,
    })
    const merEthAccAddr = await merchantEthDoc.accounts[0].address

    // const orderDetails = specifiedOrder.order;
    // console.log(orderDetails)

    let inVoiceData = {
      customerName: customerName,
      customerEmail: customerEmail,
      allOrders: order,
      totalPrice: totalPrice,
      discountedPrice: discountedPrice,
      invoiceNumber: _id,
    }
    const invoiceCreation = await OrderService.generateInvoice(
      inVoiceData,
      "orderInvoice"
    )

    const updatedOrder = await OrderService.updateOrder(_id, {
      invoiceGenerated: true,
      invoice: invoiceCreation.path,
    })

    console.log("invoiceCreation.path==", invoiceCreation.path)

    const details = {
      email: customerEmail,
      customerName: customerName,
      orderDetails: order,
      discountedPrice: discountedPrice,
      merchantName: merchantName,
      merchantEthereumAccountAddress: merEthAccAddr,
      paymentRedirectLink: req.body.paymentRedirectLink,
      file_to_be_attached: invoiceCreation.path,
    }
    data_for_email.push(details)
    try {
      const mailresp = await emailService.sendemail(
        data_for_email,
        "orderMailToCustomer"
      )

      if (mailresp.messageId)
        mailResultMsg = "Payment For Order mail has been sent to customer"
      statusApi = 200
    } catch (mailerr) {
      mailResultMsg = mailerr.message
      statusApi = 500
    }
    return res.send({
      success: true,
      status: statusApi,
      message: mailResultMsg,
      updatedOrder,
    })

    //const invoice = await Invoice.create(invoiceDetails);

    return res.status(200).send(invoiceCreation)
  } catch (err) {
    console.log("catch err==", err)
    return res.status(500).send(err)
  }
}

//------------------ resend invoice email------------------//

const resendOrderEmail = async (req, res, next) => {
  console.log("resendOrderEmail hit !")
  let data_for_email = []
  try {
    console.log("req.body==", req.body)
    const merchantEthDoc = await EthModel.findOne({
      userId: req.body.merchantId,
    })

    const merEthAccAddr = await merchantEthDoc.accounts[0].address

    data_for_email.push({
      email: req.body.customerId.email,
      customerName: req.body.customerId.name,
      discountedPrice: req.body.discountedPrice,
      merchantEthereumAccountAddress: merEthAccAddr,
      paymentRedirectLink: req.body.paymentRedirectLink,
      file_to_be_attached: req.body.invoice,
    })
    console.log("data_for_email==", data_for_email)

    const mailresp = await emailService.sendemail(
      data_for_email,
      "orderMailToCustomer"
    )
    console.log("mailresp==", mailresp)

    return res.send({
      success: true,
      status: 200,
      message: "Payment For Order mail has been sent again to customer",
    })
  } catch (error) {
    console.log("catch error==", error)

    return res.send({
      success: false,
      status: 500,
      error: error,
    })
  }
}

//------------ edit a order---------------------//

const orderEdit = async (req, res, next) => {
  try {
    const orderUpdateQuery = {
      orderId: req.params.id,
      orderDetails: req.body.order,
      merchantId: req.body.merchantId,
      customerId: req.body.customerId,
      discountPercentage: req.body.discountPercentage,
    }
    const orderUpdated = await OrderService.createOrUpdateOrder(
      orderUpdateQuery
    )
    console.log("orderUpdated in controller==", orderUpdated)

    return res.send({
      success: true,
      status: 200,
      message: "Order Updated successfully",
      updatedOrder: orderUpdated,
    })
  } catch (err) {
    return res.send({
      success: false,
      status: 500,
      message: err.message,
    })
  }
}

const orderDelete = async (req, res, next) => {
  const id = req.params.id
  try {
    const deleted = await OrderService.deleteOrder(id)
    if (deleted == null) throw "data not found"
    return res.send({
      success: true,
      status: 200,
      message: "deleted successfully",
      deleted,
    })
  } catch (err) {
    console.log("err==", err)
    return res.send({ message: err, success: false, status: 500 })
  }
}

const getInvoicebyMerchantId = async (req, res, next) => {
  const invoices = await Invoice.find({ merchantId: req.body.merchantId })
  res.send(invoices)
}

const generateInvoicePDF = async (req, res, next) => {
  let orderId = req.body.orderId
  let orderSpecific = await Order.findById(orderId).select(
    "order totalPrice -_id"
  )
  const products = orderSpecific.order
  console.log(products)
  let customerId = orderSpecific.customerId

  var data = {
    //"documentTitle": "RECEIPT", //Defaults to INVOICE
    currency: "USD",
    taxNotation: "vat", //or gst
    marginTop: 25,
    marginRight: 25,
    marginLeft: 25,
    marginBottom: 25,
    logo: "https://www.easyinvoice.cloud/img/logo.png", //or base64
    //"logoExtension": "png", //only when logo is base64
    sender: {
      company: "Sample Corp",
      address: "Sample Street 123",
      zip: "1234 AB",
      city: "Sampletown",
      country: "Samplecountry",
      //"custom1": "custom value 1",
      //"custom2": "custom value 2",
      //"custom3": "custom value 3"
    },
    client: {
      company: "Client Corp",
      address: "Clientstreet 456",
      zip: "4567 CD",
      city: "Clientcity",
      country: "Clientcountry",
      //"custom1": "custom value 1",
      //"custom2": "custom value 2",
      //"custom3": "custom value 3"
    },
    invoiceNumber: "2020.0001",
    invoiceDate: "05-01-2020",
    products: [
      {
        quantity: "2",
        description: "Test1",
        tax: 6,
        price: 33.87,
      },
      {
        quantity: "4",
        description: "Test2",
        tax: 21,
        price: 10.45,
      },
    ],
    bottomNotice: "Kindly pay your invoice within 15 days.",
  }
  //Create your invoice! Easy!
  easyinvoice.createInvoice(data, function (result) {
    //The response will contain a base64 encoded PDF file
    //console.log(result.pdf);
    res.send(result)
  })
}

const allOrdersMerchant = async (req, res, next) => {
  console.log("req.query==", req.query)
  if (!req.query.merchantId) {
    return res.status(404).send({ message: "Please input merchantId in query" })
  }
  try {
    const page = Number(
        !isNaN(req.query.page) && req.query.page != 0 ? req.query.page : 1
      ),
      limit = Number(
        !isNaN(req.query.limit) && req.query.limit != 0 ? req.query.limit : 10
      )

    const searchQuery = { merchantId: req.query.merchantId }

    const allOrdersMerchant = await OrderService.getAllOrdersByMerchantId({
      searchQuery,
      page,
      limit,
    })
    console.log("allOrdersMerchant==", allOrdersMerchant)

    return res.status(200).send({
      message: "All orders of merchant fetched",
      success: true,
      allOrders: allOrdersMerchant,
    })
  } catch (err) {
    return res.status(500).send({ success: false, message: err.message })
  }
}

const findOneOrderById = async (req, res, next) => {
  if (!req.query._id) {
    return res.status(404).send({ message: "orderId not found in input link" })
  }
  const id = req.query._id
  try {
    const updateOrder = await OrderService.getOrderById(id)
    console.log("updateOrder==", updateOrder)
    return res.send({
      status: 200,
      success: true,
      message: "data fetched successfully",
      orderDetails: updateOrder,
    })
  } catch (err) {
    return res.send({ status: 500, success: false, message: err.message })
  }
}

module.exports = {
  createOrderMerchant,
  createInvoiceAndSendMail,
  allOrdersMerchant,
  findOneOrderById,
  orderDelete,
  orderEdit,
  resendOrderEmail,
}
