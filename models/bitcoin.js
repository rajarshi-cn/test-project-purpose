const mongoose = require('mongoose');

const btcWalletSchema = new mongoose.Schema({
   any:{}
    },{
        strict:false
    })
const BTCWalletDB = mongoose.model('btcWallet', btcWalletSchema)
module.exports = BTCWalletDB