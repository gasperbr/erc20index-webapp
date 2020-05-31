const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const coingecko = axios.create({baseURL: 'https://api.coingecko.com/api/v3/coins/ethereum/contract/'});
const cors = require('cors');
const Web3 = require('web3');
let mongodb = require("mongodb");
let ObjectID = mongodb.ObjectID;

// const ercIndexAbi = [{"inputs":[{"internalType":"address","name":"_myKyberProxyAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contractERC20","name":"token","type":"address"}],"name":"AddedTopToken","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"balance","type":"uint256"}],"name":"MintedERCI","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"oldOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnerSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"contractERC20","name":"_token","type":"address"}],"name":"addNextTopToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_daiAmount","type":"uint256"}],"name":"buyERCIWithDai","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"changeOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"exit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_addAmount","type":"uint256"},{"internalType":"uint256","name":"_totalDaiValue","type":"uint256"}],"name":"getMintAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getTokenAddressAndBalance","outputs":[{"internalType":"contractERC20","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"isActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"myKyberProxy","outputs":[{"internalType":"contractMyKyberProxy","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"removeTopTopen","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_erciAmount","type":"uint256"}],"name":"sellERCIforDai","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_myKyberProxyAddress","type":"address"}],"name":"setMyKyberProxy","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"topTokens","outputs":[{"internalType":"contractERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"topTokensLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}];
const ercIndexAbi = [{"inputs":[{"internalType":"address","name":"_myProxyAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"oldOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnerSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"contractERC20","name":"_token","type":"address"}],"name":"addNextTopToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_daiAmount","type":"uint256"}],"name":"buyERCIWithDai","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"changeOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"exit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_addAmount","type":"uint256"},{"internalType":"uint256","name":"_totalDaiValue","type":"uint256"}],"name":"getMintAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getTokenAddressAndBalance","outputs":[{"internalType":"contractERC20","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"isActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"myUniswapProxy","outputs":[{"internalType":"contractMyUniswapProxy","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"removeTopTopen","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_erciAmount","type":"uint256"}],"name":"sellERCIforDai","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"topTokens","outputs":[{"internalType":"contractERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"topTokensLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}];
const erc20abi = [{"inputs":[{"internalType":"address","name":"_myKyberProxyAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contractERC20","name":"token","type":"address"}],"name":"AddedTopToken","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"balance","type":"uint256"}],"name":"MintedERCI","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"oldOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnerSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"contractERC20","name":"_token","type":"address"}],"name":"addNextTopToken","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_daiAmount","type":"uint256"}],"name":"buyERCIWithDai","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"changeOwner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"exit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_addAmount","type":"uint256"},{"internalType":"uint256","name":"_totalDaiValue","type":"uint256"}],"name":"getMintAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getTokenAddressAndBalance","outputs":[{"internalType":"contractERC20","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"isActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"myKyberProxy","outputs":[{"internalType":"contractMyKyberProxy","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"removeTopTopen","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_erciAmount","type":"uint256"}],"name":"sellERCIforDai","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_myKyberProxyAddress","type":"address"}],"name":"setMyKyberProxy","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"topTokens","outputs":[{"internalType":"contractERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"topTokensLength","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}];
// const ercIndexContractAddress = '0x6f82aaE05A3C0B31E6A0244005A8C2Ff19397C8d';
 const ercIndexContractAddress = '0xAa08765440eafD580654Cdf66c0e055BEdd8AA2C';
const daiContractAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';

let ERCI_COLLECTION = "erciCollection";

const web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/afb899cc7918472e9c54417ec13b6c39'));
const ercindexContract = new web3.eth.Contract(ercIndexAbi, ercIndexContractAddress, {
  from: '0x1234567890123456789012345678901234567891', // default from address
  gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
});

// console.log(ercindexContract.methods);// ercindexContract.methods.name().call().then(console.log);// ercindexContract.methods.topCoins(1).call().then(console.log);

let app = express();
let db; // Create a database variable outside of the database connection callback to reuse the connection pool in your app.
let distDir = __dirname + "/dist/"; // Create link to Angular build directory

app.use(bodyParser.json());
app.use(express.static(distDir));
app.use(cors());
app.options('*', cors());

// if (!process.env.MONGODB_URI) {
//   let server = app.listen(process.env.PORT || 8080, function () { // Initialize the app.
//     let port = server.address().port;
//     console.log("App now running on port", port);
//     console.log('guide: https://devcenter.heroku.com/articles/mean-apps-restful-api');
//     const job = new CronJob('*/1 * * * *', getData, null, true, 'America/Los_Angeles');
//     job.start();
//   });
// }

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/test", function (err, client) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  db = client.db(); // Save database object from the callback for reuse.
  console.log("Database connection ready");

  let server = app.listen(process.env.PORT || 8080, function () { // Initialize the app.
    let port = server.address().port;
    console.log("App now running on port", port);
    console.log('guide: https://devcenter.heroku.com/articles/mean-apps-restful-api');
  });

});

const saveStateToDB = function (callback = () => {}) {

  getData((error, data) => {
    if (error) {
      callback(error, undefined);
    } else {
      db.collection(ERCI_COLLECTION).insertOne(data, callback);
    }
  });
}

const getData = function (callback) {

  ercindexContract.methods.topTokensLength().call().then(length => {

    let promisesArray = [];

    for (let i = 0; i < length; i++) {
      promisesArray.push(ercindexContract.methods.topTokens(i).call());
    }

    Promise.all(promisesArray).then(tokens => {
      
      promisesArray = [];
      tokens.push(daiContractAddress);

      tokens.forEach(token => {

        const erc20token = new web3.eth.Contract(erc20abi, token, {
          from: '0x1234567890123456789012345678901234567891', // default from address
          gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
        });

        promisesArray.push(erc20token.methods.balanceOf(ercIndexContractAddress).call());
        promisesArray.push(erc20token.methods.decimals().call());
        promisesArray.push(coingecko(mapTokenAddressToMainnet(token)));
        
      });

      promisesArray.push(ercindexContract.methods.totalSupply().call());

      Promise.all(promisesArray).then(info => {

        let value = 0;
        const tokenBalances = [];
        
        for(let i = 0; i < info.length - 1; i += 3) {
          
          const balanceNormalized = info[i] / (10 ** info[i + 1]);
          value += balanceNormalized * parseFloat(info[i + 2].data.market_data.current_price.usd);
          
          tokenBalances.push({
            balance: balanceNormalized,
            coingeckoId: info[i + 2].data.id
          });
        }

        callback(undefined, {
          createdAt: Math.floor(new Date().getTime() / 1000),
          usdValue: value,
          tokenPrice: value / (info[info.length - 1] / (10 ** 18)),
          tokenBalances: tokenBalances
        });

      }).catch(err => callback(err, undefined));
    }).catch(err => callback(err, undefined));;
  });
}

const deleteHistory = function (callback) {
  db.collection(ERCI_COLLECTION).remove({}, callback);
}

// CONTACTS API ROUTES BELOW

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

app.get("/api/history", function(req, res) {

  let from = req.query.from;
  let to = req.query.to;
  let filter = (from && to) ? 
  {createdAt: {
    $gte: parseInt(from, 10),
    $lt: parseInt(to, 10)}
  } : {};

  db.collection(ERCI_COLLECTION).find(filter).sort({createdAt: -1 }).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get contacts.");
    } else {
      res.status(200).json(docs);
    }
  });

});

app.post("/api/history", function(req, res) {

  if (!req.query.adminKey || req.query.adminKey !== process.env.ADMINKEY) {

    handleError(res, 'Unauthorized call', 'Bad admin key', 401);
    
  } else {

    saveStateToDB(function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to create new contact.");
      } else {
        res.status(201).json(doc.ops[0]);
      }
    });

  }
});

app.delete("/api/history", function(req, res) {

  if (!req.query.adminKey || req.query.adminKey !== process.env.ADMINKEY) {
    
    handleError(res, 'Unauthorized call', 'Bad admin key', 401);

  } else {

    deleteHistory(function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to delete entries.")
      } else {
        res.status(200).json();
      }
    });
    
  }
});

const mapTokenAddressToMainnet = function(token) {
  token = token.toUpperCase();
  if (token === '0XF22E3F33768354C9805D046AF3C0926F27741B43') {
    return '0xe41d2489571d322189246dafa5ebde1f4699f498'; /// ZRX
  } else if (token === '0XF9BA5210F91D0474BD1E1DCDAEC4C58E359AAD85') {
    return '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2'; // MKR
  } else if (token === '0XB4F7332ED719EB4839F091EDDB2A3BA309739521') {
    return '0X514910771AF9CA656AF840DFF83E8264ECF986CA'; // LINK
  } else if (token === '0X7B2810576AA1CCE68F2B118CEF1F36467C648F92') {
    return '0XDD974D5C2E2928DEA5F71B9825B8B646686BD200'// KNC
  } else if (token === '0X4BFBA4A8F28755CB2061C413459EE562C6B9C51B' || 
             token === '0X879884C3C46A24F56089F3BBBE4D5E38DB5788C0') {
    return '0XD26114CD6EE289ACCF82350C8D8487FEDB8A0C07'; // OMG
  } else if (token === '0XDB0040451F373949A4BE60DCD7B6B8D6E42658B6' ||
             token === '0XDA5B056CFB861282B4B59D29C9B395BCC238D29B') {
    return '0X0D8775F648430679A709E98D2B0CB6250D2887EF'; // BAT
  } else if (token === '0XAD6D458402F60FD3BD25163575031ACDCE07538D' ||
             token === '0X2448EE2641D78CC42D7AD76498917359D961A783') {
    return '0X6B175474E89094C44DA98B954EEDEAC495271D0F'; // DAI
  } else {
    return token;
  }
}
/* 
app.get("/api/top-coins", function(req, res) {

  getTopCoinsList(function(error, result) {
    if (error) {
      handleError(res, error, 'Failed to get top coins from api!');
    } else {
      res.status(200).json(result);
    }
  });
});

function getTopCoinsList(callback) {

  httpRequest('https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD&order=market_cap_desc&per_page=200&page=1&sparkline=false', function (error, response, body) {
    
    if (error) {
      console.error("Failed to get top coins.");
      callback(error, null);
    } else {
      
      httpRequest('https://api.coingecko.com/api/v3/exchanges/kyber_network/tickers', function(error_kyber, response_kyber, body_kyber) {
        
        if (error_kyber) {
          console.error("Failed to get kyber network markets.")
          callback(error_kyber, null);
        } else {
          
          const topListIds = JSON.parse(body).map(coin => coin.id);
          const kyberNetworkTickers = JSON.parse(body_kyber).tickers.map(coin => coin.coin_id).filter(coin_id => !stableCoinsIds.includes(coin_id)); 
          const result = topListIds.filter(coinId => kyberNetworkTickers.includes(coinId));
          
          callback(null, result);

        }
      });
    }
  });
}

app.get("/api/value", function(req, res) {
  
  ercindexContract.methods.topCoinLength().call().then((length) => {
    
    const promisesArray = [];

    for(let i = 0; i < length; i++) {
      promisesArray.push(ercindexContract.methods.topCoins(i).call());
    }

    Promise.all(promisesArray).then(result => { // result is array of arrays

      let queryString = 'dai';
      const indexTokens = [];
      result.forEach(token => {
        queryString += ',' + token.id;
        indexTokens.push({id: token.id, balance: parseInt(token.balance)});
      });

      httpRequest(`https://api.coingecko.com/api/v3/simple/price?ids=${queryString}&vs_currencies=usd`, function(error, response, body) {

        if (error) {
          handleError(res, error, 'could not get top token prices from coingecko')
        } else {
          
          const prices = JSON.parse(body);
          const daiPrice = prices.dai.usd;
          let usdValue = 0;
          
          indexTokens.forEach(token => {
            usdValue += prices[token.id].usd * token.balance;
          });

          res.status(200).send('' + usdValue/daiPrice);
        }
      });
    }).catch(err => handleError(res, err, 'could not get top tokens form contract'));
  });
});

app.get("/api/top-coins-order", function(req, res) {
  res.status(200).json([1,2,3]);
});

app.get("/api/next-top-token", function(req, res) {
  let id = req.query.coingeckoId;
  let address = req.query.address;
  console.log('API CALL ***********************************************************');
  console.log(id);
  console.log(address);
  if (!id || !address) {
    return handleError(res, null, '"id" and "address" query parameters are required.');
  }
  res.status(200).json({result: 'ok'});
});

app.post("api/top-coin-order", function(req, res) {
  //confirms new top coins order
}); */