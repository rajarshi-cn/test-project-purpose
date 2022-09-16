const Product = require("../models/products");

exports.createOrUpdateProduct = async (body) => {
    if (!body.id) {
        if(!body.merchantId||!body.title||!body.price){
            return {message:"All 3 fields merchantId, title and price are required for Product creation",
        status:404};
        }
      const product = await Product.create({
        title: body.title,
        price: body.price,
        merchantId: body.merchantId,
      })
      return {
        message:"Product Created",
        status:201,
        createdData:product,
      };
    } else {
      const id = body.id;
        const updated = await Product.findByIdAndUpdate(id, body, {
          new: true
        });
        return {
            message:"Product Updated",
            status:200,
            updatedProduct:updated,
          };
    }
  }

  exports.delete = async (id) => {
    const deleted = await Product.findByIdAndDelete(id);
    return deleted;
  }

  exports.fetchAll = async(body) => {
  
    const allProducts = await Product.find(body);
    return allProducts;
  }

  exports.fetchOne = async(id)=>{
    const product = await Product.findById(id);
    return product;
  }