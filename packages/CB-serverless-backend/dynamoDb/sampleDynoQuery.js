var AWS = require('aws-sdk');
var indexOf = require('lodash/indexOf');
const chalk = require('chalk');

// Configure the AWS to lookup the right server and endpoint for DynamoDB
// In case of local set endpoint to localhost
AWS.config.update({
  region: 'ap-south-1',
  endpoint: 'http://localhost:8000',
});

var docClient = new AWS.DynamoDB.DocumentClient();


  const params = {
    TableName: 'orders',
  }


docClient.scan(params).promise()
.then((result) => {
  console.log(result);
})
.catch((e) => {
  console.log(e);
});

