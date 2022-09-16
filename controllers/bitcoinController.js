const fetch = require('node-fetch');
const BtcWalletDb = require('../models/bitcoin');

exports.generateWallet = async(req,res)=>{
    try{
        const resp = await fetch(
            `https://api-eu1.tatum.io/v3/bitcoin/wallet`,
            {
              method: 'GET',
              headers: {
                'x-api-key':'437e4fe2-818f-4a9f-9375-83fc6e72f667'
              }
            }
          );
          
          const data = await resp.json();
          console.log(data);
          res.status(200).send(data)
          const wallet = await new BtcWalletDb({
            mnemonic: data.mnemonic,
            xpub: data.xpub
          })
          wallet
                .save(wallet)
                .then(walletSavedData=>{
                  console.log(walletSavedData);
                })
                .catch(err=>{
                  console.log("walletdataSavingError", err.message)
                })
    }catch(err){
        res.status(500).send({
            message:err.message
        })
    }
}

exports.getAccountAddress = async(req,res)=>{
    try{
        const xpub = req.body.xpub
        const index = req.body.index
        const resp = await fetch(
  `https://api-eu1.tatum.io/v3/bitcoin/address/${xpub}/${index}`,
  {
    method: 'GET',
    headers: {
      'x-api-key':'437e4fe2-818f-4a9f-9375-83fc6e72f667'
    }
  }
);

const data = await resp.json();
let address = data.address
console.log(address);
let found = await BtcWalletDb.find({"xpub":xpub})
let addressVerify = await found[0].btc_wallet_account_address
addressVerify.forEach(async (item)=>{
  if(item.address===address){
     return res.status(200).send(data)
  }else{
    const updated = await BtcWalletDb.findOneAndUpdate({"xpub":xpub},{
      $push: {
        btc_wallet_account_address: {
          $each: [{address:address}],
          $position: 0,
        },
      },
    },{new:true})
    console.log(updated);
   // res.status(200).send(updated)
  }
})
res.status(200).send(data)
// let found = await BtcWalletDb.find({"xpub":xpub})
// let address;
// console.log("value esche", found[0]);
// address = await found[0].btc_wallet_account_address;
// console.log("emptyArray",address);
// //let updatedAccountDetails = await address.push(data.address)
// console.log("push-er por",updatedAccountDetails);

// const updated = await BtcWalletDb.findOneAndUpdate({"xpub":xpub},{"btc_wallet_account_address":updatedAccountDetails},{new:true})


// let preferredOrder = async(obj, order)=> {
//   var orderedObject = updated;
//   for(var i = 0; i < order.length; i++) {
//       if(obj.hasOwnProperty(order[i])) {
//           orderedObject[order[i]] = obj[order[i]];
//       }
//   }
//    return orderedObject;
// }
// updated = await preferredOrder(updated,[
//   "_id", "mnemonic","xpub", "btc_wallet_account_address", "__v","createdAt", "updatedAt"
// ])
  // let array = [...updated]
    }catch(err){
        res.status(500).send({
            message:err.message
        })
    }
}

exports.generatePrivateKey = async(req,res)=>{
  try{
    const resp = await fetch(
      `https://api-eu1.tatum.io/v3/bitcoin/wallet/priv`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': '437e4fe2-818f-4a9f-9375-83fc6e72f667'
        },
        body: JSON.stringify({
          index: req.body.index,
          mnemonic: req.body.mnemonic
        })
      }
    );
    
    const data = await resp.json();
    console.log(data);
     let updated = await BtcWalletDb.findOneAndUpdate({"mnemonic":req.body.mnemonic},{"pvt_key":data.key},{new:true})
     console.log(updated);
    res.status(200).send(data)
  }catch(err){
    res.status(500).send({
      message:err.message
    })
  }
}

exports.connnectToBTCTatumNode = async(req,res)=>{
  try{
    const resp = await fetch(
      `https://api-eu1.tatum.io/v3/bitcoin/node`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jsonrpc: '1.0',
          id: 'test',
          method: 'getblockcount',
          params: []
        })
      }
    );
    
    const data = await resp.json();
    console.log(data);
    res.status(200).send(data)
  }catch(err){
    res.status(500).send({
      message:err.message
    })
  }
}

exports.blockChainInfo = async(req,res)=>{
  try{
    const resp = await fetch(
      `https://api-eu1.tatum.io/v3/bitcoin/info`,
      {
        method: 'GET',
        headers: {
          'x-api-key': '437e4fe2-818f-4a9f-9375-83fc6e72f667'
        }
      }
    );
    
    const data = await resp.json();
    console.log(data);
    res.status(200).send(data)
  }catch(err){
    res.status(500).send({
      message:err.message
    })
  }
}

exports.getBlockHash = async(req,res)=>{
  try{
    const i = req.body.block;
    const resp = await fetch(
  `https://api-eu1.tatum.io/v3/bitcoin/block/hash/${i}`,
  {
    method: 'GET',
    headers: {
      'x-api-key': '437e4fe2-818f-4a9f-9375-83fc6e72f667'
    }
  }
);

const data = await resp.json();
console.log(data);
res.status(200).send(data)
  }catch(err){
    res.status(500).send({
      message:err.message
    })
  }
}

exports.getBlockDetailsByHash = async(req,res)=>{
  try{
    const hash = req.body.hash;
    const resp = await fetch(
  `https://api-eu1.tatum.io/v3/bitcoin/block/${hash}`,
  {
    method: 'GET',
    headers: {
      'x-api-key': '437e4fe2-818f-4a9f-9375-83fc6e72f667'
    }
  }
);

const data = await resp.json();
console.log(data);
res.status(200).send(data)
  }catch(err){
    res.status(500).send({
      message:err.message
    })
  }
}

exports.transactionByHash = async(req,res)=>{
  try{
    const hash = req.body.hash; //this hash is present in the output of getBlockDetailsByHash
    const resp = await fetch(
  `https://api-eu1.tatum.io/v3/bitcoin/transaction/${hash}`,
  {
    method: 'GET',
    headers: {
      'x-api-key': '437e4fe2-818f-4a9f-9375-83fc6e72f667'
    }
  }
);

const data = await resp.json();
console.log(data);
res.status(200).send(data)
  }catch(err){
    res.status(500).send({
      message:err.message
    })
  }
}

exports.getMemPoolTransactions = async(req,res)=>{
  try{
    const resp = await fetch(
      `https://api-eu1.tatum.io/v3/bitcoin/mempool`,
      {
        method: 'GET',
        headers: {
          'x-api-key': '437e4fe2-818f-4a9f-9375-83fc6e72f667'
        }
      }
    );
    
    const data = await resp.json();
    console.log(data);
    res.status(200).send(data)
  }catch(err){
    res.status(500).send({
      message:err.message
    })
  }
}

exports.transactionByAddress = async(req,res)=>{
  try{
    const query = new URLSearchParams({
      pageSize: '10',
      offset: '0'
    }).toString();
    const address = req.body.address;
    const resp = await fetch(
  `https://api-eu1.tatum.io/v3/bitcoin/transaction/address/${address}?${query}`,
  {
    method: 'GET',
    headers: {
      'x-api-key': '437e4fe2-818f-4a9f-9375-83fc6e72f667'
    }
  }
);

const data = await resp.json();
console.log(data);
res.status(200).send(data)
  }catch(err){
    res.status(500).send({
      message:err.message
    })
  }
}

exports.getBalance = async(req,res)=>{
  try{
    const address = req.body.address;
    const resp = await fetch(
  `https://api-eu1.tatum.io/v3/bitcoin/address/balance/${address}`,
  {
    method: 'GET',
    headers: {
      'x-api-key': '437e4fe2-818f-4a9f-9375-83fc6e72f667'
    }
  }
);

const data = await resp.json();
console.log(data);
res.status(200).send(data)
  }catch(err){
    res.status(500).send({
      message:err.message
    })
  }
}

exports.getUTXOTransaction = async(req,res)=>{
  try{
    const hash = req.body.hash;
    const index = req.body.index;
const resp = await fetch(
  `https://api-eu1.tatum.io/v3/bitcoin/utxo/${hash}/${index}`,
  {
    method: 'GET',
    headers: {
      'x-api-key': '437e4fe2-818f-4a9f-9375-83fc6e72f667'
    }
  }
);

const data = await resp.json();
console.log(data);
res.status(200).send(data)

  }catch(err){
    res.status(500).send({
      message:err.message
    })
  }
}

exports.sendBitcoin = async(req,res)=>{
  try{
    const resp = await fetch(
      `https://api-eu1.tatum.io/v3/bitcoin/transaction`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': '437e4fe2-818f-4a9f-9375-83fc6e72f667'
        },
        body: JSON.stringify({
          fromAddress: [
            {
              address: req.body.fromAddress,
              privateKey: req.body.fromPrivateKey
            }
          ],
          to: [
            {
              address: req.body.toAddress,
              value: req.body.value
            }
          ]
        })
      }
    );
    
    const data = await resp.json();
    console.log(data);
    res.status(200).send(data)
  }catch(err){
    res.status(500).send({
      message:err.message
    })
  }
}

exports.broadcastSignedBitcoinTransaction = async(req,res)=>{
  try{
    const resp = await fetch(
      `https://api-eu1.tatum.io/v3/bitcoin/broadcast`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': '437e4fe2-818f-4a9f-9375-83fc6e72f667'
        },
        body: JSON.stringify({
          txData: '62BD544D1B9031EFC330A3E855CC3A0D51CA5131455C1AB3BCAC6D243F65460D',
          signatureId: '1f7f7c0c-3906-4aa1-9dfe-4b67c43918f6'
        })
      }
    );
    const data = await resp.json();
    console.log(data);
    res.status(200).send(data);
  }catch(err){
    res.status(500).send({
      message:err.message
    })
  }
}