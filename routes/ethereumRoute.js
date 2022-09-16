"use strict"

const express = require("express")
const ethereumrouter = express.Router()

const ethereumController = require("../controllers/ethereumController")

ethereumrouter.get("/generateWallet", ethereumController.generateWallet)
ethereumrouter.post("/generateAcAddress", ethereumController.generateAcAddress)
ethereumrouter.post("/generatePvtKey", ethereumController.generatePvtKey)
ethereumrouter.get("/web3HttpDriver", ethereumController.web3HttpDriver)
ethereumrouter.get(
  "/getCurrentBlockNumber",
  ethereumController.getCurrentBlockNumber
)
ethereumrouter.post(
  "/getEthereumBlockbyHash",
  ethereumController.getEthereumBlockbyHash
)
ethereumrouter.post(
  "/getEthereumBalance",
  ethereumController.getBalance
)
ethereumrouter.post(
  "/getEthereumTransaction",
  ethereumController.getEthereumTransaction
)
ethereumrouter.get(
  "/countOutgoingEthereumTransactions",
  ethereumController.countOutgoingEthereumTransactions
)
ethereumrouter.get(
  "/getEtherTransByAddrs",
  ethereumController.getEtherTransByAddrs
)
ethereumrouter.post(
  "/sendEterAddrsToAddrs",
  ethereumController.sendEterAddrsToAddrs
)
ethereumrouter.get(
  "/invokeSmartContract",
  ethereumController.invokeSmartContract
)
ethereumrouter.get(
  "/etherInternalTransByAddrs",
  ethereumController.etherInternalTransByAddrs
)
ethereumrouter.get(
  "/broadcastSignedEther",
  ethereumController.broadcastSignedEther
)
ethereumrouter.get("/createAccount", ethereumController.createAccount)
ethereumrouter.get("/accountList", ethereumController.accountList)
ethereumrouter.get("/entitiesCount", ethereumController.entitiesCount)
ethereumrouter.get(
  "/createMultipleAccountsBatchCall",
  ethereumController.createMultipleAccountsBatchCall
)
ethereumrouter.get(
  "/customerAccountsList",
  ethereumController.customerAccountsList
)
ethereumrouter.get("/getAccountbyId", ethereumController.getAccountbyId)
ethereumrouter.get("/updateAccount", ethereumController.updateAccount)
ethereumrouter.get("/accountBalance", ethereumController.accountBalance)
ethereumrouter.get("/sendPayment", ethereumController.sendPayment)
ethereumrouter.get("/sendPaymentInBatch", ethereumController.sendPaymentInBatch)
ethereumrouter.get(
  "/findTransactionForAcc",
  ethereumController.findTransactionForAcc
)
ethereumrouter.get("/customersList", ethereumController.customersList)
ethereumrouter.get("/getCustomer", ethereumController.getCustomer)
ethereumrouter.get("/updateCustomer", ethereumController.updateCustomer)
ethereumrouter.get("/activateCustomer", ethereumController.activateCustomer)
ethereumrouter.get("/deactivateCustomer", ethereumController.deactivateCustomer)
ethereumrouter.get("/enableCustomer", ethereumController.enableCustomer)
ethereumrouter.get("/disableCustomer", ethereumController.disableCustomer)

module.exports = ethereumrouter
