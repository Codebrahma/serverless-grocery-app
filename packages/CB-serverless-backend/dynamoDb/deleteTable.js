var AWS = require('aws-sdk');
var indexOf = require('lodash/indexOf');
const chalk = require('chalk');

// Configure the AWS to lookup the right server and endpoint for DynamoDB
// In case of local set endpoint to localhost
AWS.config.update({
  region: 'ap-south-1',
  endpoint: 'http://localhost:8000',
});

var dynamodb = new AWS.DynamoDB();
/* Delete Tables */
const getDeleteParams = (tableName) => ({
  TableName: tableName
});Î

const tableName = [
  'grocery',
  'cart',
  'orders',
];

const deleteAllTablePromise = tableName.map((table) => dynamodb.deleteTable(getDeleteParams(table)).promise());

Promise
  .all(deleteAllTablePromise)
  .then(() => {
    console.log(chalk.green('Deleted all tables successfully'));
  })
  .catch((e) => {
    console.log(chalk.red('Could not delete tables. Reason: ', e.message))
  })