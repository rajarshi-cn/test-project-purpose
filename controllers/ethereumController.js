"use strict"

const fetch = require("node-fetch")

const testnet_api_key = "3274a729-66d9-4b04-94e9-3f5bccee5e6b" // rinkeby

const etherservice = require("../services/etherService")
const transactionService = require("../services/transactionService")

// --------function to Generate Ethereum wallet--------------------//
exports.generateWallet = async (req, res, next) => {
  try {
    const resp = await fetch("https://api-eu1.tatum.io/v3/ethereum/wallet", {
      method: "GET",
      headers: {
        "x-testnet-type": "ethereum-rinkeby",
        "x-api-key": testnet_api_key,
        // "access-control-allow-origin": ["Access-Control-Allow-Origin", "*"],
        // "Content-Type": "application/json",
      },
    })

    const wallet_data = await resp.json()
    console.log("wallet_data==", wallet_data)
    const etherdata = await etherservice.inserEtherData(wallet_data)
    console.log("etherdata==", etherdata)

    return res.send({
      success: true,
      message: "Wallet created successfully",
      status: 200,
      etherdata,
    })
  } catch (err) {
    console.log("catch err==", err)

    return res.send({
      success: false,
      err: err,
    })
  }
}

// --------function to Generate Ethereum account address--------------------//
exports.generateAcAddress = async (req, res, next) => {
  console.log("req.body==", req.body)
  try {
    const xpub = req.body.xpub
    const index = req.body.index
    const resp = await fetch(
      `https://api-eu1.tatum.io/v3/ethereum/address/${xpub}/${index}`,
      {
        method: "GET",
        headers: {
          "x-testnet-type": "ethereum-rinkeby",
          "x-api-key": testnet_api_key,
        },
      }
    )

    const addressdata = await resp.json()
    console.log("resp==", resp)
    console.log("addressdata==", addressdata)
    if (addressdata.statusCode && addressdata.statusCode != 200) {
      throw addressdata.message
    }
    const addressUpdateddata = await etherservice.updateEtherDoc({
      xpub: req.body.xpub,
      ...addressdata,
      index: index,
    })
    console.log("addressUpdateddata==", addressUpdateddata)
    if (addressUpdateddata == null) throw "Something Went wrong"
    return res.send({
      success: true,
      status: 200,
      addressUpdateddata,
    })
  } catch (err) {
    console.log("catch err==", err)

    return res.send({
      success: false,
      err: err,
    })
  }
}

// --------function to Generate Ethereum private key--------------------//
exports.generatePvtKey = async (req, res, next) => {
  console.log("req.body==", req.body)
  try {
    const resp = await fetch(
      `https://api-eu1.tatum.io/v3/ethereum/wallet/priv`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-testnet-type": "ethereum-rinkeby",
          "x-api-key": testnet_api_key,
        },
        body: JSON.stringify({
          index: req.body.index,
          mnemonic: req.body.mnemonic,
        }),
      }
    )

    const pvt_key = await resp.json()
    //return res.status(200).send(pvt_key)
    console.log("pvt_key==", pvt_key)
    if (pvt_key.statusCode && pvt_key.statusCode != 200) {
      throw pvt_key.message
    }
    const etherUpdateddata = await etherservice.updateEtherDoc({
      mnemonic: req.body.mnemonic,
      pvt_key: pvt_key,
      index: req.body.index,
    })
    console.log("etherUpdateddata==", etherUpdateddata)
    if (etherUpdateddata == null) throw "Something Went wrong"
    // console.log("resp==", resp)
    // console.log("resp.status==", resp.status)
    // console.log("resp.statusText==", resp.statusText)

    return res.send({
      statusText: resp.statusText,
      status: resp.status,
      pvt_key,
      etherUpdateddata,
    })
  } catch (err) {
    console.log("catch err==", err)

    return res.send({
      success: false,
      err: err,
    })
  }
}

// --------function for Web3 HTTP driver--------------------//
exports.web3HttpDriver = async (req, res, next) => {
  try {
    const resp = await fetch(
      `https://api-eu1.tatum.io/v3/ethereum/web3/${testnet_api_key}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "web3_clientVersion",
          params: [],
          id: 2,
        }),
      }
    )

    const web3httpdriverdata = await resp.json()
    console.log("web3httpdriverdata==", web3httpdriverdata)

    return res.send({
      statusText: resp.statusText,
      status: resp.status,
      web3httpdriverdata,
    })
  } catch (err) {
    console.log("catch err==", err)

    return res.send({
      success: false,
      err: err,
    })
  }
}

// --------function to Get current block number--------------------//
exports.getCurrentBlockNumber = async (req, res, next) => {
  try {
    const resp = await fetch(
      `https://api-eu1.tatum.io/v3/ethereum/block/current`,
      {
        method: "GET",
        headers: {
          "x-testnet-type": "ethereum-ropsten",
          "x-api-key": testnet_api_key,
        },
      }
    )

    const block_number = await resp.json()
    console.log("block_number==", block_number)

    return res.send({
      statusText: resp.statusText,
      status: resp.status,
      block_number,
    })
  } catch (err) {
    console.log("catch err==", err)

    return res.send({
      success: false,
      err: err,
    })
  }
}

// --------function to Get Ethereum block by hash--------------------//
exports.getEthereumBlockbyHash = async (req, res, next) => {
  try {
    const blockhash = req.body.blockhash
    const resp = await fetch(
      `https://api-eu1.tatum.io/v3/ethereum/block/${blockhash}`,
      {
        method: "GET",
        headers: {
          "x-testnet-type": "ethereum-rinkeby",
          "x-api-key": testnet_api_key,
        },
      }
    )

    const ethereum_blockby_hash = await resp.json()
    console.log("ethereum_blockby_hash==", ethereum_blockby_hash)

    return res.send({
      statusText: resp.statusText,
      status: resp.status,
      ethereum_blockby_hash,
    })
  } catch (err) {
    console.log("catch err==", err)

    return res.send({
      success: false,
      err: err,
    })
  }
}

// --------function to Get Ethereum account balance--------------------//
exports.getEthereumBalance = async accountaddress => {
  // const address = "0x93fd4c410711896ccedf78538b67529ff60d6143"
  // const address = "0x885c54c629cc58781bf49e07937eee0c674c5b17"

  const resp = await fetch(
    `https://api-eu1.tatum.io/v3/ethereum/account/balance/${accountaddress}`,
    {
      method: "GET",
      headers: {
        "x-testnet-type": "ethereum-sepolia",
        "x-api-key": testnet_api_key,
      },
    }
  )

  const ether_balance = await resp.json()
  console.log("ether_balance==", ether_balance)

  return ether_balance
}

exports.getBalance = async (req, res) => {
  // const address = "0x93fd4c410711896ccedf78538b67529ff60d6143"
  // const address = "0x885c54c629cc58781bf49e07937eee0c674c5b17"

  const resp = await fetch(
    `https://api-eu1.tatum.io/v3/ethereum/account/balance/${req.body.address}`,
    {
      method: "GET",
      headers: {
        "x-testnet-type": "ethereum-rinkeby",
        "x-api-key": testnet_api_key,
      },
    }
  )

  const ether_balance = await resp.json()
  console.log("ether_balance==", ether_balance)

  return res.status(200).send(ether_balance)
}

// --------function to Get Ethereum Transaction--------------------//
exports.getEthereumTransaction = async (req, res, next) => {
  try {
    const hash = req.body.txId
    //"0x8f3ba7ad704386018345476209f729564d9ddf9b2c4854a8f464f336ceb5b2e6" // tx-id
    const resp = await fetch(
      `https://api-eu1.tatum.io/v3/ethereum/transaction/${hash}`,
      {
        method: "GET",
        headers: {
          "x-testnet-type": "ethereum-sepolia",
          "x-api-key": testnet_api_key,
        },
      }
    )

    let transaction_data = await resp.json()
    console.log("transaction_data==", transaction_data)
    // console.log("resp==", resp)

    return res.send({
      statusText: resp.statusText,
      status: resp.status,
      transaction_data,
    })
  } catch (err) {
    console.log("catch err==", err)

    return res.send({
      success: false,
      err: err,
    })
  }
}

// --------function to Get count of outgoing Ethereum transactions--------------------//
exports.countOutgoingEthereumTransactions = async (req, res, next) => {
  try {
    const address = "0x9f7545ac0810cd338bb6aa8f7026eb4083f14946"
    const resp = await fetch(
      `https://api-eu1.tatum.io/v3/ethereum/transaction/count/${address}`,
      {
        method: "GET",
        headers: {
          "x-testnet-type": "ethereum-ropsten",
          "x-api-key": testnet_api_key,
        },
      }
    )

    const count = await resp.json()
    console.log("count==", count)

    return res.send({
      statusText: resp.statusText,
      status: resp.status,
      count,
    })
  } catch (err) {
    console.log("catch err==", err)

    return res.send({
      success: false,
      err: err,
    })
  }
}

// --------function to Get Ethereum transactions by address--------------------//
exports.getEtherTransByAddrs = async (req, res, next) => {
  try {
    const query = new URLSearchParams({
      pageSize: "10",
      offset: "0",
      from: "1087623",
      to: "1087823",
      sort: "ASC",
    }).toString()

    const address = req.body.address
    const resp = await fetch(
      `https://api-eu1.tatum.io/v3/ethereum/account/transaction/${address}?${query}`,
      {
        method: "GET",
        headers: {
          "x-testnet-type": "ethereum-rinkeby",
          "x-api-key": testnet_api_key,
        },
      }
    )

    const ether_trans = await resp.json()
    console.log("ether_trans==", ether_trans)
    console.log("resp==", resp)

    return res.send({
      statusText: resp.statusText,
      status: resp.status,
      ether_trans,
    })
  } catch (err) {
    console.log("catch err==", err)

    return res.send({
      success: false,
      err: err,
    })
  }
}

// --------function to Send Ethereum / ERC20 from account to account--------------------//
exports.sendEterAddrsToAddrs = async reqBody => {
  console.log("reqBody==", reqBody)

  // let nonce = 0
  try {
    let payerAccountData = await etherservice.findDocument({
      userId: reqBody.userId,
      populate_field: "userId",
      populate_from_collection: "customers",
    })
    console.log("payerAccountData==", payerAccountData)

    let payeeAccountData = await etherservice.findDocument({
      accountAddress: reqBody.accountAddress,
      populate_field: "userId",
      populate_from_collection: "users",
    })

    console.log("payeeAccountData==", payeeAccountData)

    // if (payerAccountData.nonce) nonce = payerAccountData.nonce + 1
    // console.log("nonce==", nonce)

    const resp = await fetch(
      `https://api-eu1.tatum.io/v3/ethereum/transaction`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-testnet-type": "ethereum-sepolia",
          "x-api-key": testnet_api_key,
        },
        body: JSON.stringify({
          data: "Yo! check the amount.",
          //nonce: nonce,
          to: reqBody.accountAddress,
          currency: "ETH",
          fee: {
            gasLimit: "40000",
            gasPrice: "20",
          },
          //     gas: "128028",
          // gasPrice: "2000000000",
          // gasLimit: "9000",
          // from: accounts[0],
          amount: "0.00001",

          fromPrivateKey: payerAccountData.privateKey[0].key,
          // "0xf95251cd952fa94f157801706fca044e4374ce7187e7c3d4d9e58fc028ee7dfb",
          // "0xb3c316b1f4569a3ad1bba797894e61215772ec0f39f4912286728a0a5226490b",
        }),
      }
    )

    const transaction_data = await resp.json()
    console.log("transaction_data==", transaction_data)
    // console.log("transaction resp==", resp)

    if (
      transaction_data.errorCode &&
      transaction_data.message &&
      transaction_data.errorCode != 200
    )
      throw { transaction_data }

    const transactionInsert = await transactionService.insertTransaction({
      txId: transaction_data.txId,
      amount: "0.00001",
      currency: reqBody.currency,
      from: {
        userId: payerAccountData.userId._id,
        userType: payerAccountData.userId.type,
      },
      to: {
        userId: payeeAccountData.userId._id,
        userType: payeeAccountData.userId.type,
        accountAddress: reqBody.accountAddress,
      },
    })
    console.log("transactionInsert==", transactionInsert)

    // const etherUpdateddata = await etherservice.updateManyEtherDoc({
    //   transaction_data,
    //   xpub: [payerAccountData.xpub, payeeAccountData.xpub],
    // })
    // console.log("etherUpdateddata==", etherUpdateddata)
    // if (etherUpdateddata.modifiedCount == 0)
    //   throw "Something went wrong while updating !"

    return {
      statusText: resp.statusText,
      status: resp.status,
      transaction_data,
    }
  } catch (err) {
    console.log("catch err==", err)

    return err
  }
}

// --------function to Invoke Smart Contract method--------------------//
exports.invokeSmartContract = async (req, res, next) => {
  try {
    const resp = await fetch(
      `https://api-eu1.tatum.io/v3/ethereum/smartcontract`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-testnet-type": "ethereum-ropsten",
          "x-api-key": testnet_api_key,
        },
        body: JSON.stringify({
          contractAddress: "0x0fb51f591dee8431951f6c54bbc6d0aa02e6842c",
          methodName: "transfer",
          methodABI: {
            inputs: [
              {
                internalType: "uint256",
                name: "amount",
                type: "uint256",
              },
            ],
            name: "stake",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          params: ["0x632"],
          amount: "100000",
          fromPrivateKey:
            "0x8e4844782a68af5bf5e4f1e4dc6246de2b95f60dcde00cd7a47e3721d10e4fdb",
          nonce: 0,
          fee: {
            gasLimit: "40000",
            gasPrice: "20",
          },
        }),
      }
    )
    console.log("resp==", resp)

    const smart_contract = await resp.json()
    console.log("smart_contract==", smart_contract)

    return res.send({
      statusText: resp.statusText,
      status: resp.status,
      smart_contract,
    })
  } catch (err) {
    console.log("catch err==", err)

    return res.send({
      success: false,
      err: err,
    })
  }
}

// --------function to Get Ethereum internal transactions by address--------------------//
exports.etherInternalTransByAddrs = async (req, res, next) => {
  try {
    const query = new URLSearchParams({
      pageSize: "10",
      offset: "0",
    }).toString()

    const address = "0x93fd4c410711896ccedf78538b67529ff60d6143"
    const resp = await fetch(
      `https://api-eu1.tatum.io/v3/ethereum/account/transaction/erc20/internal/${address}?${query}`,
      {
        method: "GET",
        headers: {
          "x-testnet-type": "ethereum-ropsten",
          "x-api-key": testnet_api_key,
        },
      }
    )

    const internal_transaction = await resp.json()
    console.log("internal_transaction==", internal_transaction)

    return res.send({
      statusText: resp.statusText,
      status: resp.status,
      internal_transaction,
    })
  } catch (err) {
    console.log("catch err==", err)

    return res.send({
      success: false,
      err: err,
    })
  }
}

// --------function to Broadcast signed Ethereum transaction--------------------//
exports.broadcastSignedEther = async (req, res, next) => {
  try {
    const resp = await fetch(`https://api-eu1.tatum.io/v3/ethereum/broadcast`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-testnet-type": "ethereum-ropsten",
        "x-api-key": testnet_api_key,
      },
      body: JSON.stringify({
        txData:
          "62BD544D1B9031EFC330A3E855CC3A0D51CA5131455C1AB3BCAC6D243F65460D",
        signatureId: "1f7f7c0c-3906-4aa1-9dfe-4b67c43918f6",
      }),
    })

    const signed_ether = await resp.json()
    console.log("signed_ether==", signed_ether)

    return res.send({
      statusText: resp.statusText,
      status: resp.status,
      signed_ether,
    })
  } catch (err) {
    console.log("catch err==", err)

    return res.send({
      success: false,
      err: err,
    })
  }
}

//-------------virtual account---------------------------//

// --------function to Create new account--------------------//
exports.createAccount = async (req, res, next) => {
  try {
    const resp = await fetch(`https://api-eu1.tatum.io/v3/ledger/account`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": testnet_api_key,
      },
      body: JSON.stringify({
        currency: "ETH",
        xpub: "xpub6FNqu7owP6FBEf288jQLWKza8uzFbx8y13xLPW2v1VNAJQs7B1U1iLuvNrGXFWUpUFQdqDWnYb1RNALQjcK8GwQmE92b4eESAqXMX4xkp5M",
        customer: {
          accountingCurrency: "USD",
          customerCountry: "US",
          externalId: "123654",
          providerCountry: "US",
        },
        compliant: false,
        accountCode: "AC_1011_B",
        accountingCurrency: "USD",
        accountNumber: "123456",
      }),
    })

    const account_data = await resp.json()
    console.log("account_data==", account_data)

    return res.send({
      statusText: resp.statusText,
      status: resp.status,
      account_data,
    })
  } catch (err) {
    console.log("catch err==", err)

    return res.send({
      success: false,
      err: err,
    })
  }
}

// --------function to get list of all accounts--------------------//
exports.accountList = async (req, res, next) => {
  try {
    const query = new URLSearchParams({
      pageSize: "20",
      page: "0",
      sort: "asc",
      // sortBy: "_id",
      // active: "true",
      onlyNonZeroBalance: "false",
      frozen: "true",
      currency: "ETH",
      accountCode: "AC_1011_B",
      accountNumber: "123456",
      customerId: "62aabd0c5af3f0b48bbec420",
    }).toString()

    const resp = await fetch(
      `https://api-eu1.tatum.io/v3/ledger/account?${query}`,
      {
        method: "GET",
        headers: {
          "x-api-key": testnet_api_key,
        },
      }
    )

    const ac_list = await resp.json()
    console.log("ac_list==", ac_list)

    return res.send({
      statusText: resp.statusText,
      status: resp.status,
      ac_list,
    })
  } catch (err) {
    console.log("catch err==", err)

    return res.send({
      success: false,
      err: err,
    })
  }
}

// --------function to get Count of found entities for get accounts request-------------------//
exports.entitiesCount = async (req, res, next) => {
  try {
    const query = new URLSearchParams({
      pageSize: "20",
      page: "0",
      sort: "asc",
      // sortBy: "_id",
      active: "true",
      onlyNonZeroBalance: "true",
      frozen: "true",
      currency: "ETH",
      accountCode: "AC_1011_B",
      accountNumber: "123456",
      customerId: "62aabd0c5af3f0b48bbec420",
    }).toString()

    const resp = await fetch(
      `https://api-eu1.tatum.io/v3/ledger/account/count?${query}`,
      {
        method: "GET",
        headers: {
          "x-api-key": testnet_api_key,
        },
      }
    )

    const enrtityCount = await resp.json()
    console.log("enrtityCount==", enrtityCount)

    return res.send({
      statusText: resp.statusText,
      status: resp.status,
      enrtityCount,
    })
  } catch (err) {
    console.log("catch err==", err)

    return res.send({
      success: false,
      err: err,
    })
  }
}

// --------function to Create multiple accounts in a batch call-------------------//
exports.createMultipleAccountsBatchCall = async (req, res, next) => {
  try {
    const resp = await fetch(
      `https://api-eu1.tatum.io/v3/ledger/account/batch`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": testnet_api_key,
        },
        body: JSON.stringify({
          accounts: [
            {
              currency: "ETH",
              xpub: "xpub6EJc4nAC95uFtWxiC9Wk2qppnVFSA1LUmQSiQ3jh3G2dX8KTAjP6h4Rsqfmizw5WQeKF9uGLec2AASEDi3WRW34hQWa51eZzdKC7PRPJmWR",
              customer: {
                accountingCurrency: "USD",
                customerCountry: "US",
                externalId: "123654",
                providerCountry: "US",
              },
              compliant: false,
              accountCode: "AC_1011_B",
              accountingCurrency: "USD",
              accountNumber: "123456",
            },
          ],
        }),
      }
    )

    const multiple_account_data = await resp.json()
    console.log("multiple_account_data==", multiple_account_data)

    return res.send({
      statusText: resp.statusText,
      status: resp.status,
      multiple_account_data,
    })
  } catch (err) {
    console.log("catch err==", err)

    return res.send({
      success: false,
      err: err,
    })
  }
}

// --------function to List all customer accounts-------------------//
exports.customerAccountsList = async (req, res, next) => {
  try {
    const query = new URLSearchParams({
      pageSize: "10",
      offset: "0",
      accountCode: "AC_1011_B",
    }).toString()

    const id = "62aabd0c5af3f0b48bbec420" // customerid
    const resp = await fetch(
      `https://api-eu1.tatum.io/v3/ledger/account/customer/${id}?${query}`,
      {
        method: "GET",
        headers: {
          "x-api-key": testnet_api_key,
        },
      }
    )

    const accountList = await resp.json()
    console.log("accountList==", accountList)

    return res.send({
      statusText: resp.statusText,
      status: resp.status,
      accountList,
    })
  } catch (err) {
    console.log("catch err==", err)

    return res.send({
      success: false,
      err: err,
    })
  }
}

// --------function to Get account by ID-------------------//
exports.getAccountbyId = async (req, res, next) => {
  try {
    const id = "62aad525386da59955da9486" // id
    const resp = await fetch(
      `https://api-eu1.tatum.io/v3/ledger/account/${id}`,
      {
        method: "GET",
        headers: {
          "x-api-key": testnet_api_key,
        },
      }
    )

    const customer_acc = await resp.json()
    console.log("customer_acc==", customer_acc)

    return res.send({
      statusText: resp.statusText,
      status: resp.status,
      customer_acc,
    })
  } catch (err) {
    console.log("catch err==", err)

    return res.send({
      success: false,
      err: err,
    })
  }
}

// --------function to Update account-------------------//
exports.updateAccount = async (req, res, next) => {
  try {
    const id = "62aad525386da59955da9486"
    const resp = await fetch(
      `https://api-eu1.tatum.io/v3/ledger/account/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": testnet_api_key,
        },
        body: JSON.stringify({
          accountCode: "AC_1011_B",
          accountNumber: "123456",
        }),
      }
    )
    console.log("resp==", resp)

    const updated_acc = await resp.text()
    console.log("updated_acc==", updated_acc)

    return res.send({
      statusText: resp.statusText,
      status: resp.status,
      updated_acc,
    })
  } catch (err) {
    console.log("catch err==", err)

    return res.send({
      success: false,
      err: err,
    })
  }
}

// --------function to Get account balance-------------------//
exports.accountBalance = async (req, res, next) => {
  try {
    const id = "62aad525386da59955da9486"
    const resp = await fetch(
      `https://api-eu1.tatum.io/v3/ledger/account/${id}/balance`,
      {
        method: "GET",
        headers: {
          "x-api-key": testnet_api_key,
        },
      }
    )

    const ac_balance = await resp.json()
    console.log("ac_balance==", ac_balance)

    return res.send({
      statusText: resp.statusText,
      status: resp.status,
      ac_balance,
    })
  } catch (err) {
    console.log("catch err==", err)

    return res.send({
      success: false,
      err: err,
    })
  }
}

//------------------------payment transaction---------------------------------//

// --------function to Send payment-------------------//
exports.sendPayment = async (req, res, next) => {
  try {
    const resp = await fetch(`https://api-eu1.tatum.io/v3/ledger/transaction`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": testnet_api_key,
      },
      body: JSON.stringify({
        senderAccountId: "62aad851191792eb42180766",
        recipientAccountId: "62aad525386da59955da9486",
        amount: "5",
        anonymous: false,
        compliant: false,
        transactionCode: "1_01_EXTERNAL_CODE",
        paymentId: "9625",
        recipientNote: "Private note",
        baseRate: 1,
        senderNote: "test Sender note",
      }),
    })

    const payment_data = await resp.json()
    console.log("payment_data==", payment_data)

    return res.send({
      statusText: resp.statusText,
      status: resp.status,
      payment_data,
    })
  } catch (err) {
    console.log("catch err==", err)

    return res.send({
      success: false,
      err: err,
    })
  }
}

// --------function to Send payment in batch-------------------//
exports.sendPaymentInBatch = async (req, res, next) => {
  try {
    const resp = await fetch(
      `https://api-eu1.tatum.io/v3/ledger/transaction/batch`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": testnet_api_key,
        },
        body: JSON.stringify({
          senderAccountId: "5e6645712b55823de7ea82f1",
          transaction: [
            {
              recipientAccountId: "5e6645712b55823de7ea82f2",
              amount: "1",
              anonymous: false,
              compliant: false,
              transactionCode: "1_01_EXTERNAL_CODE",
              paymentId: "9625",
              recipientNote: "Private note",
              baseRate: 1,
              senderNote: "Sender note",
            },
          ],
        }),
      }
    )

    const batch_payment = await resp.json()
    console.log("batch_payment==", batch_payment)

    return res.send({
      statusText: resp.statusText,
      status: resp.status,
      batch_payment,
    })
  } catch (err) {
    console.log("catch err==", err)

    return res.send({
      success: false,
      err: err,
    })
  }
}

// --------function to Find transactions for account-------------------//
exports.findTransactionForAcc = async (req, res, next) => {
  try {
    const query = new URLSearchParams({
      pageSize: "10",
      offset: "0",
      count: "true",
    }).toString()

    const resp = await fetch(
      `https://api-eu1.tatum.io/v3/ledger/transaction/account?${query}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": testnet_api_key,
        },
        body: JSON.stringify({
          id: "62aad525386da59955da9486",
          counterAccount: "5e6be8e9e6aa436299950c41",
          from: 1571833231000,
          to: 1571833231000,
          currency: "BTC",
          amount: [{ op: "gte", value: "1.5" }],
          currencies: ["BTC"],
          transactionType: "FAILED",
          transactionTypes: ["CREDIT_PAYMENT"],
          opType: "PAYMENT",
          transactionCode: "1_01_EXTERNAL_CODE",
          paymentId: "65426",
          recipientNote: "65426",
          senderNote: "65426",
        }),
      }
    )

    const find_data = await resp.json()
    console.log("find_data==", find_data)

    return res.send({
      statusText: resp.statusText,
      status: resp.status,
      find_data,
    })
  } catch (err) {
    console.log("catch err==", err)

    return res.send({
      success: false,
      err: err,
    })
  }
}

//------------------------customers----------------------------------------//

// --------function to List all customers-------------------//
exports.customersList = async (req, res, next) => {
  try {
    const query = new URLSearchParams({
      pageSize: "10",
      offset: "0",
    }).toString()

    const resp = await fetch(
      `https://api-eu1.tatum.io/v3/ledger/customer?${query}`,
      {
        method: "GET",
        headers: {
          "x-api-key": testnet_api_key,
        },
      }
    )

    const customers = await resp.json()
    console.log("customers==", customers)

    return res.send({
      statusText: resp.statusText,
      status: resp.status,
      customers,
    })
  } catch (err) {
    console.log("catch err==", err)

    return res.send({
      success: false,
      err: err,
    })
  }
}

// --------function to Get customer details-------------------//
exports.getCustomer = async (req, res, next) => {
  try {
    const id = "62aabd0c5af3f0b48bbec420"
    const resp = await fetch(
      `https://api-eu1.tatum.io/v3/ledger/customer/${id}`,
      {
        method: "GET",
        headers: {
          "x-api-key": testnet_api_key,
        },
      }
    )

    const customer_data = await resp.json()
    console.log("customer_data==", customer_data)

    return res.send({
      statusText: resp.statusText,
      status: resp.status,
      customer_data,
    })
  } catch (err) {
    console.log("catch err==", err)

    return res.send({
      success: false,
      err: err,
    })
  }
}

// --------function to Update customer details-------------------//
exports.updateCustomer = async (req, res, next) => {
  try {
    const id = "62aabd0c5af3f0b48bbec420"
    const resp = await fetch(
      `https://api-eu1.tatum.io/v3/ledger/customer/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": testnet_api_key,
        },
        body: JSON.stringify({
          externalId: "123654",
          accountingCurrency: "USD",
          customerCountry: "US",
          providerCountry: "US",
        }),
      }
    )

    const update_data = await resp.text()
    console.log("update_data==", update_data)

    return res.send({
      statusText: resp.statusText,
      status: resp.status,
      customer_data,
    })
  } catch (err) {
    console.log("catch err==", err)

    return res.send({
      success: false,
      err: err,
    })
  }
}

// --------function to Activate customer-------------------//
exports.activateCustomer = async (req, res, next) => {
  try {
    const id = "62aabd0c5af3f0b48bbec420"
    const resp = await fetch(
      `https://api-eu1.tatum.io/v3/ledger/customer/${id}/activate`,
      {
        method: "PUT",
        headers: {
          "x-api-key": testnet_api_key,
        },
      }
    )

    const activate_data = await resp.json()
    console.log("activate_data==", activate_data)

    return res.send({
      statusText: resp.statusText,
      status: resp.status,
      activate_data,
    })
  } catch (err) {
    console.log("catch err==", err)

    return res.send({
      success: false,
      err: err,
    })
  }
}

// --------function to deactivate customer-------------------//
exports.deactivateCustomer = async (req, res, next) => {
  try {
    const id = "62aabd0c5af3f0b48bbec420"
    const resp = await fetch(
      `https://api-eu1.tatum.io/v3/ledger/customer/${id}/deactivate`,
      {
        method: "PUT",
        headers: {
          "x-api-key": testnet_api_key,
        },
      }
    )

    const deactivate_data = await resp.json()
    console.log("deactivate_data==", deactivate_data)

    return res.send({
      statusText: resp.statusText,
      status: resp.status,
      deactivate_data,
    })
  } catch (err) {
    console.log("catch err==", err)

    return res.send({
      success: false,
      err: err,
    })
  }
}

// --------function to Enable customer-------------------//
exports.enableCustomer = async (req, res, next) => {
  try {
    const id = "62aabd0c5af3f0b48bbec420"
    const resp = await fetch(
      `https://api-eu1.tatum.io/v3/ledger/customer/${id}/enable`,
      {
        method: "PUT",
        headers: {
          "x-api-key": testnet_api_key,
        },
      }
    )

    const enable_data = await resp.json()
    console.log("enable_data==", enable_data)

    return res.send({
      statusText: resp.statusText,
      status: resp.status,
      enable_data,
    })
  } catch (err) {
    console.log("catch err==", err)

    return res.send({
      success: false,
      err: err,
    })
  }
}

// --------function to Disable customer-------------------//
exports.disableCustomer = async (req, res, next) => {
  try {
    const id = "62aabd0c5af3f0b48bbec420"
    const resp = await fetch(
      `https://api-eu1.tatum.io/v3/ledger/customer/${id}/disable`,
      {
        method: "PUT",
        headers: {
          "x-api-key": testnet_api_key,
        },
      }
    )

    const disable_data = await resp.text()
    console.log("disable_data==", disable_data)

    return res.send({
      statusText: resp.statusText,
      status: resp.status,
      disable_data,
    })
  } catch (err) {
    console.log("catch err==", err)

    return res.send({
      success: false,
      err: err,
    })
  }
}
