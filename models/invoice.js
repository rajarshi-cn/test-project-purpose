const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const inVoiceSchema = new mongoose.Schema({
    
    orderDetails:Object,
    merchantId:{
                 type:Schema.Types.ObjectId,
                 ref:'users'
    },
    merchantfirstName:String,
    merchantEmail:{
        type:String
    },
    customerId:{
        type:Schema.Types.ObjectId,
        ref:'customers'
    },
    customerfirstName:String,
    customerEmail:{
        type:String
    }
},{
    timestamps:true
})

const invoiceDB = mongoose.model('invoice', inVoiceSchema)
module.exports = invoiceDB