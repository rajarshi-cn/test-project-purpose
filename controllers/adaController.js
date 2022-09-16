const fetch = require('node-fetch')
const AdaWalletDb = require('../models/ada')

exports.getBlockChainInfo = async(req,res)=>{
    try{
        const resp = await fetch(
            `https://api-eu1.tatum.io/v3/ada/info`,
            {
              method: 'GET',
              headers: {
                'x-api-key': '437e4fe2-818f-4a9f-9375-83fc6e72f667'
              }
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

exports.connectToAdaTatumNode = async(req,res)=>{
    try{
        const resp = await fetch(
            `https://api-eu1.tatum.io/v3/ada/graphql`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-api-key': '437e4fe2-818f-4a9f-9375-83fc6e72f667'
              },
              body: JSON.stringify({
                query: '{ testnet { tip { 3655325 61678131 epoch { 213 } }} }'
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

exports.generateWallet = async(req,res)=>{
    try{
        const resp = await fetch(
            `https://api-eu1.tatum.io/v3/ada/wallet`,
            {
              method: 'GET',
              headers: {
                'x-api-key': '437e4fe2-818f-4a9f-9375-83fc6e72f667'
              }
            }
          );
     const data = await resp.json();
     console.log(data);
     let newWallet = {
        mnemonic : data.mnemonic,
        xpub: data.xpub
     }
     const created = await AdaWalletDb.create(newWallet)
     res.status(200).send(created);
    }catch(err){
        res.status(500).send({
            message:err.message
        })
    }
}

exports.getADADepositAddress = async(req,res)=>{
    try{
        const xpub = req.body.xpub;
        const index = 2
        const resp = await fetch(
          `https://api-eu1.tatum.io/v3/ada/address/${xpub}/${index}`,
          {
            method: 'GET',
            headers: {
              'x-api-key': '437e4fe2-818f-4a9f-9375-83fc6e72f667'
            }
          }
        );
     const data = await resp.json();
     console.log(data);
     const updated = await AdaWalletDb.findOneAndUpdate({"xpub":xpub},{"ada_wallet_account_address":data.address},{new:true})
     res.status(200).send(updated);
    }catch(err){
        res.status(500).send({
            message:err.message
        })
    }
}

exports.generatePvtKey = async(req,res)=>{
    try{
        const resp = await fetch(
            `https://api-eu1.tatum.io/v3/ada/wallet/priv`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-api-key': '437e4fe2-818f-4a9f-9375-83fc6e72f667'
              },
              body: JSON.stringify({
                index: 1,
                mnemonic: req.body.mnemonic
              })
            }
          );
     const data = await resp.json();
     console.log(data);
     const updated = await AdaWalletDb.findOneAndUpdate({"mnemonic":req.body.mnemonic},{"pvt_key":data.key},{new:true})
     res.status(200).send(updated);
    }catch(err){
        res.status(500).send({
            message:err.message
        })
    }
}

exports.getBlockByHash = async(req,res)=>{
    try{
        const hash = req.body.hash;
        const resp = await fetch(
            `https://api-eu1.tatum.io/v3/ada/block/?${hash}`,
            {
              method: 'GET',
              headers: {
                'x-api-key': '437e4fe2-818f-4a9f-9375-83fc6e72f667'
              }
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

exports.getTransactionsByAdress = async(req,res)=>{
    try{
        const query = new URLSearchParams({
            pageSize: '10',
            offset: '0'
          }).toString();
          
          const address = req.body.address;
          const resp = await fetch(
            `https://api-eu1.tatum.io/v3/ada/transaction/address/${address}?${query}`,
            {
              method: 'GET',
              headers: {
                'x-api-key': '437e4fe2-818f-4a9f-9375-83fc6e72f667'
              }
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

exports.getTransactionByHash = async(req,res)=>{
    try{
        const hash = req.body.hash;
        const resp = await fetch(
          `https://api-eu1.tatum.io/v3/ada/transaction/${hash}`,
          {
            method: 'GET',
            headers: {
              'x-api-key': '437e4fe2-818f-4a9f-9375-83fc6e72f667'
            }
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

exports.getUTXOByAddress = async(req,res)=>{
    try{
        const address = req.body.address;
        const resp = await fetch(
          `https://api-eu1.tatum.io/v3/ada/${address}/utxos`,
          {
            method: 'GET',
            headers: {
              'x-api-key': '437e4fe2-818f-4a9f-9375-83fc6e72f667'
            }
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

exports.sendADA = async(req,res)=>{
    try{
        const resp = await fetch(
            `https://api-eu1.tatum.io/v3/ada/transaction`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-api-key': '437e4fe2-818f-4a9f-9375-83fc6e72f667'
              },
              body: JSON.stringify({
                changeAddress: 'addr_test1qrtwscgy7l8qu8c7k2du74lcw9rtzlw4c29gfrtjagnjeswmw32mdh6r0vrhm2faeh3y28nnvj649xzc75ndut2kw0vqyruqd4',
                fee: '0.5',
                fromAddress: [
                  {
                    address: 'addr_test1qpscvwaceze80gnugsr2pndjxf2297dyym9rcrq0xd8t5c7mw32mdh6r0vrhm2faeh3y28nnvj649xzc75ndut2kw0vqad0gk6',
                    privateKey: 'b0cd752c5b7fe0bb6a94f730b1a7d8e88c19b94bd6b4ac3c40fe012f493f494a5bfde8d9906f33a2c0c525bbfa72f8ac51505b93df58a04e54407f64caed94adf639e2eafe9500f8a44a788af984289fbe9d7533c347045ed21f5f4d906d1bace6c6ec8aa62d77f68bfd764f817371c965d6142bb8e70a8a3daf5786c137d23b'
                  }
                ],
                to: [
                  {
                    address: 'addr_test1qq8h30p0h7w5qgjlfs8ll8r6u89969nzwlsjhnkwzxes0l7mw32mdh6r0vrhm2faeh3y28nnvj649xzc75ndut2kw0vqaxe60l',
                    value: 0.2963284
                  }
                ]
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

exports.functionName = async(req,res)=>{
    try{
    
     const data = await resp.json();
     console.log(data);
     res.status(200).send(data);
    }catch(err){
        res.status(500).send({
            message:err.message
        })
    }
}

exports.functionName = async(req,res)=>{
    try{
    
     const data = await resp.json();
     console.log(data);
     res.status(200).send(data);
    }catch(err){
        res.status(500).send({
            message:err.message
        })
    }
}