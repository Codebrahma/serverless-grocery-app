var AWS = require('aws-sdk');

// Configure the AWS to lookup the right server and endpoint for DynamoDB
// In case of local set endpoint to localhost
AWS.config.update({
  region: 'ap-south-1',
  endpoint: 'http://localhost:8000',
});

var dynamodb = new AWS.DynamoDB();

// Params are must
var params = {
  TableName: 'grocery',
  KeySchema: [
    { AttributeName: 'groceryId', KeyType: 'HASH' },
  ],
  AttributeDefinitions: [
    { AttributeName: 'groceryId', AttributeType: 'N' },
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 2,
    WriteCapacityUnits: 2
  }
};

createTable = dynamodb.createTable(params, (err, data) => {
  if (err) {
    console.log('unable to create table. Error ', JSON.stringify(err, null, 2));
  } else {
    console.log('Table created successfully')
  }
});
