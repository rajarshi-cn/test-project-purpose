const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new mongoose.Schema({
   
   title:String,

   price:Number,

   merchantId: {
    type:Schema.Types.ObjectId,
    ref:'user'
   } 
    },{
        timestamps:true
    })
const productDB = mongoose.model('product', productSchema)
module.exports = productDB