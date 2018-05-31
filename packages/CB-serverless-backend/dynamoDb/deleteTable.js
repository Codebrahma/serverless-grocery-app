const AWS = require('aws-sdk');
const indexOf = require('lodash/indexOf');
const chalk = require('chalk');

const { awsConfigUpdate } = require('./awsConfigUpdate');

awsConfigUpdate();

const dynamodb = new AWS.DynamoDB();
/* Delete Tables */
const getDeleteParams = tableName => ({
  TableName: tableName,
});

const tableName = [
  'grocery',
  'cart',
  'orders',
];

const deleteAllTablePromise = tableName.map(table => dynamodb.deleteTable(getDeleteParams(table)).promise());

Promise
  .all(deleteAllTablePromise)
  .then(() => {
    console.log(chalk.green('Deleted all tables successfully'));
  })
  .catch((e) => {
    console.log(chalk.red('Could not delete tables. Reason: ', e.message));
  });
