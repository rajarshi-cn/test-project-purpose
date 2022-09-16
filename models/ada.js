const mongoose = require('mongoose');

const adaWalletSchema = new mongoose.Schema({
    any:{}
    },{
        timestamps:true
    },{
        strict:false
    })
const ADAWalletDB = mongoose.model('adaWallet', adaWalletSchema)
module.exports = ADAWalletDB