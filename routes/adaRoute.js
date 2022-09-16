const express = require('express')
const adaController = require('../controllers/adaController')
const route = express.Router()

route.get('/get-blockchain-info', adaController.getBlockChainInfo)
route.get('/connect-to-tatum-ada-node', adaController.connectToAdaTatumNode)
route.get('/generate-wallet', adaController.generateWallet)
route.get('/get-account-address', adaController.getADADepositAddress)
route.get('/generate-private-key', adaController.generatePvtKey)
route.get('/get-block-by-hash', adaController.getBlockByHash)
route.get('/get-transactions-by-address', adaController.getTransactionsByAdress)
route.get('/get-transaction-by-hash', adaController.getTransactionByHash)
route.get('/get-utxo-by-address', adaController.getUTXOByAddress)
route.get('/send-ada', adaController.sendADA)

module.exports = route