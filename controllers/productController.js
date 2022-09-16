const Product = require("../models/products")
const ProductService = require("../services/productService");

const createOrUpdateProduct = async (req, res, next) => {
 if(!req.body){
  return res.status(404).send({message:"Please input data for creating or updating document"});
 }
 try{
 const product = await ProductService.createOrUpdateProduct(req.body);
 return res.send(product);
 }catch(err){
  return res.send({message:err.message,
                  status:500});
 }
}

const deleteProduct = async (req, res, next) => {
  const id = req.params.id
  try {
    const deleted = await ProductService.delete(id)
    return res.status(200).send(deleted)
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

const findOneProduct = async (req, res, next) => {
  if(!req.params.id){
    return res.status(404).send({message:"productId not found in input link"});
  }
  const id = req.params.id
  try {
    const product = await ProductService.fetchOne(id)
    return res.status(200).send(product)
  } catch (err) {
    return res.status(500).send(err.message)
  }
}

const findAllProducts = async (req, res, next) => {
  let qry = {}
  if (req.body.merchantId && req.body.merchantId !== ""){
    //Product List according to merchantId filter
    qry = { merchantId: req.body.merchantId }
  try {
    const allProducts = await ProductService.fetchAll(qry)
    res.status(200).send(allProducts)
  } catch (err) {
    res.status(500).send(err.message)
  }
} else {
  //Product list according to no filter
  try {
    const allProducts = await ProductService.fetchAll()
    return res.status(200).send(allProducts)
  } catch (err) {
    return res.status(500).send(err.message)
  }
}
}

module.exports = {
  createOrUpdateProduct,
  deleteProduct,
  findOneProduct,
  findAllProducts,
}
