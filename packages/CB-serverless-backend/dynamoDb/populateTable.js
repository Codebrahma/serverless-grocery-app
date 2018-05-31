var AWS = require('aws-sdk');
var fs = require('fs');
var chalk = require('chalk');
var { groceryList } = require('./data/groceryList');
var { cart } = require('./data/sampleCart');
const { awsConfigUpdate } = require('./awsConfigUpdate');

awsConfigUpdate();


var docClient = new AWS.DynamoDB.DocumentClient();

const groceryPromises = [];
const cartPromise = [];

groceryList.forEach(function (item) {
  var params = {
    TableName: 'grocery',
    Item: {
      groceryId: item.groceryId,
      name: item.name,
      url: item.url,
      category: item.category,
      subCategory: item.subCategory,
      price: item.price,
      availableQty: item.availableQty,
      soldQty: item.soldQty
    },
  };

  groceryPromises.push(docClient.put(params).promise())
});

cart.forEach(function (item) {
  var params = {
    TableName: 'cart',
    Item: {
      userId: item.userId,
      cartData: item.cartData,
    },
  };

  cartPromise.push(docClient.put(params).promise());
});
Promise
  .all(groceryPromises)
  .then(() => {
    return Promise.all(cartPromise)
  })
  .then((data) => {
    console.log(chalk.green('Populated Tables successfully'));
  })
  .catch((e) => {
    console.log(chalk.red('Could not populate tables. Reason: ', e.message))
  })


